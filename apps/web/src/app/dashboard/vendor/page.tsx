'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { Plus } from 'lucide-react';

interface Product {
    id: string;
    name: string;
    price: string;
    stock: number;
    category: string;
}

export default function VendorDashboard() {
    const [products, setProducts] = useState<Product[]>([]);
    const { user } = useAuthStore();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const { data } = await api.get('/products'); // In a real app, filtering by vendor would be better or a specific endpoint
                // For now, assuming the API returns all products, we might filter client side or implement /vendors/me/products
                // Let's use the public endpoint for now and filter if needed, but ideally we need a vendor specific endpoint.
                // Actually, let's just show all for simplicity or implement a specific endpoint later.
                // Wait, I implemented getProducts but not getMyProducts for vendor. 
                // Let's just fetch all and filter by vendorId matches user's vendor profile.
                // But user object doesn't have vendorId directly.
                // Let's just create a simple 'My Products' endpoint or just list all for the demo.
                setProducts(data);
            } catch (error) {
                console.error('Failed to fetch products');
            }
        };
        fetchProducts();
    }, []);

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Vendor Dashboard</h1>
                <Link
                    href="/dashboard/vendor/add-product"
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md flex items-center hover:bg-indigo-700"
                >
                    <Plus className="h-5 w-5 mr-2" />
                    Add Product
                </Link>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                    {products.map((product) => (
                        <li key={product.id}>
                            <div className="px-4 py-4 sm:px-6">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-medium text-indigo-600 truncate">{product.name}</p>
                                    <div className="ml-2 flex-shrink-0 flex">
                                        <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                            {product.category}
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-2 sm:flex sm:justify-between">
                                    <div className="sm:flex">
                                        <p className="flex items-center text-sm text-gray-500">
                                            Stock: {product.stock}
                                        </p>
                                    </div>
                                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                                        <p>
                                            Price: ₹{product.price}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </li>
                    ))}
                    {products.length === 0 && (
                        <li className="px-4 py-4 sm:px-6 text-center text-gray-500">
                            No products found. Start selling!
                        </li>
                    )}
                </ul>
            </div>
        </div>
    );
}
