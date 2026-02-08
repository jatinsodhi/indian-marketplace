import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getMyVendorProfile = async (req: Request, res: Response) => {
    try {
        if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

        const vendor = await prisma.vendor.findUnique({
            where: { userId: req.user.userId },
            include: { user: { select: { name: true, email: true } } },
        });

        if (!vendor) return res.status(404).json({ error: 'Vendor profile not found' });

        res.json(vendor);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch vendor profile' });
    }
};

export const updateVendorProfile = async (req: Request, res: Response) => {
    try {
        if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
        const { storeName, description } = req.body;

        const vendor = await prisma.vendor.upsert({
            where: { userId: req.user.userId },
            update: { storeName, description },
            create: {
                userId: req.user.userId,
                storeName,
                description,
            },
        });

        res.json(vendor);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update vendor profile' });
    }
};
