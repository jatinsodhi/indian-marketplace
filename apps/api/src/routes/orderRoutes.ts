import { createOrder, getMyOrders, getVendorOrders } from '../controllers/orderController';
import { authenticate, authorize } from '../middleware/authMiddleware';
import { Role } from '@prisma/client';

const router = express.Router();

router.post('/', authenticate, createOrder);
router.get('/', authenticate, getMyOrders);
router.get('/vendor', authenticate, authorize([Role.VENDOR, Role.ADMIN]), getVendorOrders);

export default router;
