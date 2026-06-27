import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { listingService } from '../services/listingService';


export const createListing = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const listing = await listingService.create({
      userId,
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      skillTags: req.body.skillTags,
      cashPrice: req.body.cashPrice,
      creditPrice: req.body.creditPrice,
      deliveryFormat: req.body.deliveryFormat,
      turnaroundDays: req.body.turnaroundDays,
      revisionsIncluded: req.body.revisionsIncluded,
      samples: req.body.samples,
      visibility: req.body.visibility,
    });

    res.status(201).json(listing);
  } catch (error) {
    console.error('Create listing error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


export const getListings = async (req: AuthRequest, res: Response) => {
  try {
    const {
      category,
      minPrice,
      maxPrice,
      visibility,
      userId,
      page = '1',
      limit = '12',
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = req.query;

    const filters = {
      category: category as string | undefined,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      visibility: visibility as string | undefined,
      userId: userId as string | undefined,
    };

    const pagination = {
      page: Math.max(1, Number(page)),
      limit: Math.min(50, Math.max(1, Number(limit))),
      sortBy: sortBy as string,
      sortOrder: sortOrder as 'asc' | 'desc',
    };

    const result = await listingService.browse(filters, pagination);
    res.json(result);
  } catch (error) {
    console.error('Get listings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const searchListings = async (req: AuthRequest, res: Response) => {
  try {
    const { q, category, minPrice, maxPrice, page = '1', limit = '12' } = req.query;

    if (!q || typeof q !== 'string' || q.trim().length === 0) {
      return res.status(400).json({ message: 'Search query "q" is required' });
    }

    const filters = {
      category: category as string | undefined,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
    };

    const pagination = {
      page: Math.max(1, Number(page)),
      limit: Math.min(50, Math.max(1, Number(limit))),
    };

    const result = await listingService.search(q, filters, pagination);
    res.json(result);
  } catch (error) {
    console.error('Search listings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


export const getTrendingListings = async (req: AuthRequest, res: Response) => {
  try {
    const limit = Math.min(20, Math.max(1, Number(req.query.limit) || 10));
    const listings = await listingService.getTrending(limit);
    res.json(listings);
  } catch (error) {
    console.error('Trending listings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


export const getMyListings = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const listings = await listingService.getByUserId(req.userId, true);
    res.json(listings);
  } catch (error) {
    console.error('Get my listings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getListingById = async (req: AuthRequest, res: Response) => {
  try {
    const listing = await listingService.getById(req.params.id, true);
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }
    res.json(listing);
  } catch (error) {
    console.error('Get listing error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateListing = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const listing = await listingService.update(req.params.id, req.userId, req.body);
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found or unauthorized' });
    }

    res.json(listing);
  } catch (error) {
    console.error('Update listing error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteListing = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const listing = await listingService.softDelete(req.params.id, req.userId);
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found or unauthorized' });
    }

    res.json({ message: 'Listing deleted' });
  } catch (error) {
    console.error('Delete listing error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
