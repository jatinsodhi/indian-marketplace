import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createOrder = async (req: Request, res: Response) => {
    try {
        if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
        const { items } = req.body; // items: { productId: string, quantity: number }[]

        if (!items || items.length === 0) {
            return res.status(400).json({ error: 'No items in order' });
        }

        let totalAmount = 0;
        const orderItemsData = [];

        for (const item of items) {
            const product = await prisma.product.findUnique({ where: { id: item.productId } });
            if (!product) {
                return res.status(404).json({ error: `Product ${item.productId} not found` });
            }
            if (product.stock < item.quantity) {
                return res.status(400).json({ error: `Insufficient stock for ${product.name}` });
            }

            const itemTotal = Number(product.price) * item.quantity;
            totalAmount += itemTotal;
            orderItemsData.push({
                productId: item.productId,
                quantity: item.quantity,
                price: product.price,
            });

            // Decrease stock
            await prisma.product.update({
                where: { id: item.productId },
                data: { stock: product.stock - item.quantity },
            });
        }

        const order = await prisma.order.create({
            data: {
                userId: req.user.userId,
                totalAmount,
                orderItems: {
                    create: orderItemsData,
                },
            },
            include: { orderItems: true },
        });

        res.status(201).json(order);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create order' });
    }
};

export const getMyOrders = async (req: Request, res: Response) => {
    try {
        if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

        const orders = await prisma.order.findMany({
            where: { userId: req.user.userId },
            include: { orderItems: { include: { product: true } } },
            orderBy: { createdAt: 'desc' },
        });

        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
};

export const getVendorOrders = async (req: Request, res: Response) => {
    try {
        if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

        const vendor = await prisma.vendor.findUnique({ where: { userId: req.user.userId } });
        if (!vendor) return res.status(403).json({ error: 'Vendor profile required' });

        // Find order items that belong to this vendor's products
        const orderItems = await prisma.orderItem.findMany({
            where: {
                product: {
                    vendorId: vendor.id,
                },
            },
            include: {
                order: {
                    include: { user: { select: { name: true, email: true } } },
                },
                product: true,
            },
            orderBy: { order: { createdAt: 'desc' } },
        });

        res.json(orderItems);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch vendor orders' });
    }
};
