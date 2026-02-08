'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

interface OrderItem {
    id: string;
    quantity: number;
    product: {
        name: string;
        price: string;
    };
    order: {
        id: string;
        createdAt: string;
        user: {
            name: string;
            email: string;
        };
    };
}

export default function VendorOrdersPage() {
    const [orderItems, setOrderItems] = useState<OrderItem[]>([]); // These are items sold by the vendor

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const { data } = await api.get('/orders/vendor');
                setOrderItems(data);
            } catch (error) {
                console.error('Failed to fetch vendor orders');
            }
        };
        fetchOrders();
    }, []);

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Received Orders</h1>
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                    {orderItems.map((item) => (
                        <li key={item.id}>
                            <div className="px-4 py-4 sm:px-6">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-medium text-indigo-600 truncate">
                                        Order #{item.order.id.slice(0, 8)}
                                    </p>
                                    <div className="ml-2 flex-shrink-0 flex">
                                        <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                            Sold
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-2 sm:flex sm:justify-between">
                                    <div className="sm:flex">
                                        <p className="flex items-center text-sm text-gray-500">
                                            Product: {item.product.name} (x{item.quantity})
                                        </p>
                                        <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                                            Customer: {item.order.user.name || item.order.user.email}
                                        </p>
                                    </div>
                                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                                        <p>
                                            Date: {new Date(item.order.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </li>
                    ))}
                    {orderItems.length === 0 && (
                        <li className="px-4 py-4 sm:px-6 text-center text-gray-500">
                            No orders received yet.
                        </li>
                    )}
                </ul>
            </div>
        </div>
    );
}
