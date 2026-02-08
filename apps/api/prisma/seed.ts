import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const hashedPassword = await bcrypt.hash('password123', 10);

    // Create Admin
    const admin = await prisma.user.upsert({
        where: { email: 'admin@example.com' },
        update: {},
        create: {
            email: 'admin@example.com',
            name: 'Admin User',
            password: hashedPassword,
            role: Role.ADMIN,
        },
    });

    // Create Vendor
    const vendorUser = await prisma.user.upsert({
        where: { email: 'vendor@example.com' },
        update: {},
        create: {
            email: 'vendor@example.com',
            name: 'Vendor User',
            password: hashedPassword,
            role: Role.VENDOR,
        },
    });

    const vendorProfile = await prisma.vendor.upsert({
        where: { userId: vendorUser.id },
        update: {},
        create: {
            userId: vendorUser.id,
            storeName: 'Tech Gadgets India',
            description: 'Best electronics in India',
        },
    });

    // Create Customer
    const customer = await prisma.user.upsert({
        where: { email: 'customer@example.com' },
        update: {},
        create: {
            email: 'customer@example.com',
            name: 'Rahul Kumar',
            password: hashedPassword,
            role: Role.CUSTOMER,
        },
    });

    // Create Products
    const product1 = await prisma.product.create({
        data: {
            vendorId: vendorProfile.id,
            name: 'Wireless Headphones',
            description: 'Noise cancelling wireless headphones',
            price: 2999,
            stock: 50,
            category: 'Electronics',
            images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=80'],
        },
    });

    const product2 = await prisma.product.create({
        data: {
            vendorId: vendorProfile.id,
            name: 'Smart Watch',
            description: 'Fitness tracker and smart notifications',
            price: 1499,
            stock: 100,
            category: 'Electronics',
            images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=80'],
        },
    });

    console.log({ admin, vendorUser, customer, product1, product2 });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
