'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

interface Order {
    id: string;
    totalAmount: string;
    status: string;
    createdAt: string;
    orderItems: {
        id: string;
        product: {
            name: string;
        };
        quantity: number;
        price: string;
    }[];
}

export default function CustomerOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const { data } = await api.get('/orders');
                setOrders(data);
            } catch (error) {
                console.error('Failed to fetch orders');
            }
        };
        fetchOrders();
    }, []);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <h1 className="text-2xl font-bold mb-6">My Orders</h1>
            <div className="space-y-6">
                {orders.map((order) => (
                    <div key={order.id} className="bg-white shadow overflow-hidden sm:rounded-lg">
                        <div className="px-4 py-5 sm:px-6 flex justify-between items-center bg-gray-50">
                            <div>
                                <h3 className="text-lg leading-6 font-medium text-gray-900">
                                    Order #{order.id.slice(0, 8)}
                                </h3>
                                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                                    Placed on {new Date(order.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                            <div>
                                <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">
                                    {order.status}
                                </span>
                                <p className="text-lg font-bold mt-1 text-right">₹{order.totalAmount}</p>
                            </div>
                        </div>
                        <div className="border-t border-gray-200">
                            <ul className="divide-y divide-gray-200">
                                {order.orderItems.map((item) => (
                                    <li key={item.id} className="px-4 py-4 sm:px-6">
                                        <div className="flex justify-between">
                                            <p className="text-sm font-medium text-indigo-600">{item.product.name}</p>
                                            <p className="text-sm text-gray-500">
                                                Qty: {item.quantity} x ₹{item.price}
                                            </p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                ))}
                {orders.length === 0 && (
                    <p className="text-center text-gray-500 py-10">You haven't placed any orders yet.</p>
                )}
            </div>
        </div>
    );
}
