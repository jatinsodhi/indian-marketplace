import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createProduct = async (req: Request, res: Response) => {
    try {
        if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
        const { name, description, price, stock, category, images } = req.body;

        const vendor = await prisma.vendor.findUnique({ where: { userId: req.user.userId } });
        if (!vendor) return res.status(403).json({ error: 'Vendor profile required' });

        const product = await prisma.product.create({
            data: {
                vendorId: vendor.id,
                name,
                description,
                price,
                stock: parseInt(stock),
                category,
                images: images || [],
            },
        });

        res.status(201).json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create product' });
    }
};

export const getProducts = async (req: Request, res: Response) => {
    try {
        const products = await prisma.product.findMany({
            include: { vendor: { select: { storeName: true } } },
        });
        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch products' });
    }
};

export const getProductById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const product = await prisma.product.findUnique({
            where: { id },
            include: { vendor: { select: { storeName: true } } },
        });
        if (!product) return res.status(404).json({ error: 'Product not found' });
        res.json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch product' });
    }
};
