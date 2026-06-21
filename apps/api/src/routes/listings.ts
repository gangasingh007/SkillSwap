import { Router } from 'express';
import {
  createListing,
  getListings,
  searchListings,
  getTrendingListings,
  getMyListings,
  getListingById,
  updateListing,
  deleteListing,
} from '../controllers/listingController';
import { auth } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createListingSchema, updateListingSchema } from '../utils/validators';
import { searchLimiter, writeLimiter } from '../middleware/rateLimit';

const router = Router();

// Static routes MUST come before parameterized /:id routes
router.get('/search', searchLimiter, searchListings);
router.get('/trending', getTrendingListings);
router.get('/my', auth, getMyListings);

// CRUD
router.get('/', getListings);
router.post('/', auth, writeLimiter, validate(createListingSchema), createListing);
router.get('/:id', getListingById);
router.patch('/:id', auth, writeLimiter, validate(updateListingSchema), updateListing);
router.delete('/:id', auth, writeLimiter, deleteListing);

export default router;
