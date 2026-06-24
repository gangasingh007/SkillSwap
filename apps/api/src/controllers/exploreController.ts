import { Request, Response } from 'express';
import { exploreService } from '../services/exploreService';

export const getExploreCollections = async (req: Request, res: Response) => {
  try {
    const collections = await exploreService.getCuratedCollections();
    res.json(collections);
  } catch (error) {
    console.error('Explore collections error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
