import Listing, { IListingModel } from '../models/mongo/Listing';
import mongoose from 'mongoose';

export interface ListingFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  availability?: boolean;
  paymentType?: 'cash' | 'credits';
  visibility?: string;
  userId?: string;
}

export interface PaginationOptions {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ListingCreateInput {
  userId: string;
  title: string;
  description: string;
  category: string;
  skillTags?: string[];
  cashPrice: number;
  creditPrice: number;
  deliveryFormat: string;
  turnaroundDays: number;
  revisionsIncluded: number;
  samples?: { type: string; url: string }[];
  visibility?: string;
}

export interface ListingUpdateInput {
  title?: string;
  description?: string;
  category?: string;
  skillTags?: string[];
  cashPrice?: number;
  creditPrice?: number;
  deliveryFormat?: string;
  turnaroundDays?: number;
  revisionsIncluded?: number;
  samples?: { type: string; url: string }[];
  visibility?: string;
}

class ListingService {
  async create(input: ListingCreateInput): Promise<IListingModel> {
    const listing = new Listing({
      userId: new mongoose.Types.ObjectId(input.userId),
      title: input.title,
      description: input.description,
      category: input.category,
      skillTags: input.skillTags || [],
      cashPrice: input.cashPrice,
      creditPrice: input.creditPrice,
      deliveryFormat: input.deliveryFormat,
      turnaroundDays: input.turnaroundDays,
      revisionsIncluded: input.revisionsIncluded,
      samples: input.samples || [],
      visibility: input.visibility || 'public',
    });

    return listing.save();
  }


  async getById(id: string, incrementView: boolean = false): Promise<IListingModel | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return null;
    }

    if (incrementView) {
      return Listing.findOneAndUpdate(
        { _id: id, isActive: true },
        { $inc: { 'analytics.views': 1 } },
        { new: true }
      ).populate('userId', 'name avatarUrl reputationScore isVerified skillTags');
    }

    return Listing.findOne({ _id: id, isActive: true })
      .populate('userId', 'name avatarUrl reputationScore isVerified skillTags');
  }


  async browse(
    filters: ListingFilters,
    pagination: PaginationOptions
  ): Promise<{ listings: IListingModel[]; total: number; page: number; totalPages: number }> {
    const query: Record<string, unknown> = { isActive: true };

    if (filters.userId) {
      if (!mongoose.Types.ObjectId.isValid(filters.userId)) {
        return {
          listings: [],
          total: 0,
          page: pagination.page,
          totalPages: 0,
        };
      }
      query.userId = new mongoose.Types.ObjectId(filters.userId);
    }

    if (filters.category) {
      query.category = filters.category;
    }

    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      query.cashPrice = {};
      if (filters.minPrice !== undefined) {
        (query.cashPrice as Record<string, number>).$gte = filters.minPrice;
      }
      if (filters.maxPrice !== undefined) {
        (query.cashPrice as Record<string, number>).$lte = filters.maxPrice;
      }
    }

    if (filters.visibility) {
      query.visibility = filters.visibility;
    }

    const { page, limit, sortBy = 'createdAt', sortOrder = 'desc' } = pagination;
    const skip = (page - 1) * limit;

    const sortOptions: Record<string, 1 | -1> = {
      [sortBy]: sortOrder === 'asc' ? 1 : -1,
    };

    const [listings, total] = await Promise.all([
      Listing.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .populate('userId', 'name avatarUrl reputationScore isVerified'),
      Listing.countDocuments(query),
    ]);

    return {
      listings,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Full-text search using MongoDB text index.
   */
  async search(
    searchQuery: string,
    filters: ListingFilters,
    pagination: PaginationOptions
  ): Promise<{ listings: IListingModel[]; total: number; page: number; totalPages: number }> {
    const query: Record<string, unknown> = {
      isActive: true,
      $text: { $search: searchQuery },
    };

    if (filters.category) {
      query.category = filters.category;
    }

    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      query.cashPrice = {};
      if (filters.minPrice !== undefined) {
        (query.cashPrice as Record<string, number>).$gte = filters.minPrice;
      }
      if (filters.maxPrice !== undefined) {
        (query.cashPrice as Record<string, number>).$lte = filters.maxPrice;
      }
    }

    const { page, limit } = pagination;
    const skip = (page - 1) * limit;

    const [listings, total] = await Promise.all([
      Listing.find(query, { score: { $meta: 'textScore' } })
        .sort({ score: { $meta: 'textScore' } })
        .skip(skip)
        .limit(limit)
        .populate('userId', 'name avatarUrl reputationScore isVerified'),
      Listing.countDocuments(query),
    ]);

    return {
      listings,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Trending listings: aggregated by order count in the last 7 days.
   * For now (before orders exist), falls back to most-viewed in last 7 days.
   */
  async getTrending(limit: number = 10): Promise<IListingModel[]> {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    return Listing.find({
      isActive: true,
      createdAt: { $gte: sevenDaysAgo },
    })
      .sort({ 'analytics.requests': -1, 'analytics.views': -1 })
      .limit(limit)
      .populate('userId', 'name avatarUrl reputationScore isVerified');
  }

  /**
   * Update a listing. Only the owner can update.
   * Returns null if listing not found or userId doesn't match.
   */
  async update(
    listingId: string,
    userId: string,
    input: ListingUpdateInput
  ): Promise<IListingModel | null> {
    if (!mongoose.Types.ObjectId.isValid(listingId)) {
      return null;
    }

    const listing = await Listing.findOne({ _id: listingId, isActive: true });
    if (!listing) return null;
    if (listing.userId.toString() !== userId) return null;

    // Apply only provided fields
    if (input.title !== undefined) listing.title = input.title;
    if (input.description !== undefined) listing.description = input.description;
    if (input.category !== undefined) listing.category = input.category as IListingModel['category'];
    if (input.skillTags !== undefined) listing.skillTags = input.skillTags;
    if (input.cashPrice !== undefined) listing.cashPrice = input.cashPrice;
    if (input.creditPrice !== undefined) listing.creditPrice = input.creditPrice;
    if (input.deliveryFormat !== undefined) listing.deliveryFormat = input.deliveryFormat as IListingModel['deliveryFormat'];
    if (input.turnaroundDays !== undefined) listing.turnaroundDays = input.turnaroundDays;
    if (input.revisionsIncluded !== undefined) listing.revisionsIncluded = input.revisionsIncluded;
    if (input.samples !== undefined) listing.samples = input.samples as IListingModel['samples'];
    if (input.visibility !== undefined) listing.visibility = input.visibility as IListingModel['visibility'];

    return listing.save();
  }

  async softDelete(listingId: string, userId: string): Promise<IListingModel | null> {
    if (!mongoose.Types.ObjectId.isValid(listingId)) {
      return null;
    }

    const listing = await Listing.findOne({ _id: listingId, isActive: true });
    if (!listing) return null;
    if (listing.userId.toString() !== userId) return null;

    listing.isActive = false;
    return listing.save();
  }

  async getByUserId(
    userId: string,
    includeInactive: boolean = false
  ): Promise<IListingModel[]> {
    const query: Record<string, unknown> = {
      userId: new mongoose.Types.ObjectId(userId),
    };

    if (!includeInactive) {
      query.isActive = true;
    }

    return Listing.find(query).sort({ createdAt: -1 });
  }
}

export const listingService = new ListingService();
