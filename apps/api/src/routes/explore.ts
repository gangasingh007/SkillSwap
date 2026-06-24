import { Router } from 'express';
import { getExploreCollections } from '../controllers/exploreController';

const router = Router();

router.get('/', getExploreCollections);

export default router;
