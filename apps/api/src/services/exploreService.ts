import Listing, { IListingModel } from '../models/mongo/Listing';

class ExploreService {
  async getTopRated(limit: number = 6): Promise<IListingModel[]> {
    // For MVP, using conversions + requests as a proxy for "top rated"
    return Listing.find({ isActive: true })
      .sort({ 'analytics.conversions': -1, 'analytics.requests': -1 })
      .limit(limit)
      .populate('userId', 'name avatarUrl reputationScore isVerified');
  }

  async getQuickTurnaround(limit: number = 6): Promise<IListingModel[]> {
    return Listing.find({ isActive: true, turnaroundDays: { $lte: 3 } })
      .sort({ turnaroundDays: 1, 'analytics.views': -1 })
      .limit(limit)
      .populate('userId', 'name avatarUrl reputationScore isVerified');
  }

  async getNewThisWeek(limit: number = 6): Promise<IListingModel[]> {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    return Listing.find({ isActive: true, createdAt: { $gte: oneWeekAgo } })
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('userId', 'name avatarUrl reputationScore isVerified');
  }

  async getCuratedCollections() {
    const [topRated, quickTurnaround, newThisWeek] = await Promise.all([
      this.getTopRated(),
      this.getQuickTurnaround(),
      this.getNewThisWeek(),
    ]);

    return {
      topRated,
      quickTurnaround,
      newThisWeek,
    };
  }
}

export const exploreService = new ExploreService();
