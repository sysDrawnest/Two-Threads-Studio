import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate';
import {
  getAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from '../controllers/address.controller';
import {
  createAddressSchema,
  updateAddressSchema,
  setDefaultAddressSchema,
} from '../validators/address.validator';

const router = Router();

// Address endpoints require user authentication
router.use(requireAuth);

router.get('/', getAddresses);
router.post('/', validate(createAddressSchema), createAddress);
router.put('/:id', validate(updateAddressSchema), updateAddress);
router.delete('/:id', deleteAddress);
router.patch('/:id/default', validate(setDefaultAddressSchema), setDefaultAddress);

export default router;
