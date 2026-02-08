import express from 'express';
import { getMyVendorProfile, updateVendorProfile } from '../controllers/vendorController';
import { authenticate, authorize } from '../middleware/authMiddleware';
import { Role } from '@prisma/client';

const router = express.Router();

router.get('/me', authenticate, authorize([Role.VENDOR, Role.ADMIN]), getMyVendorProfile);
router.put('/me', authenticate, authorize([Role.VENDOR, Role.ADMIN]), updateVendorProfile);

export default router;
