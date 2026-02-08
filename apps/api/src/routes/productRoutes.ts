import express from 'express';
import { createProduct, getProducts, getProductById } from '../controllers/productController';
import { authenticate, authorize } from '../middleware/authMiddleware';
import { Role } from '@prisma/client';

const router = express.Router();

router.post('/', authenticate, authorize([Role.VENDOR, Role.ADMIN]), createProduct);
router.get('/', getProducts);
router.get('/:id', getProductById);

export default router;
