'use client';

import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { toast, Toaster } from 'react-hot-toast';
import Link from 'next/link';

export default function CartPage() {
    const { items, removeItem, clearCart, total } = useCartStore();
    const { isAuthenticated } = useAuthStore();
    const router = useRouter();

    const handleCheckout = async () => {
        if (!isAuthenticated) {
            toast.error('Please login to checkout');
            router.push('/auth');
            return;
        }

        try {
            const orderItems = items.map((item) => ({
                productId: item.id,
                quantity: item.quantity,
            }));

            await api.post('/orders', { items: orderItems });
            toast.success('Order placed successfully!');
            clearCart();
            router.push('/dashboard/orders'); // We need to create this page for customers
        } catch (error) {
            toast.error('Failed to place order');
        }
    };

    if (items.length === 0) {
        return (
            <div className="text-center py-20">
                <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
                <Link href="/" className="text-indigo-600 hover:text-indigo-800">
                    Continue Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <Toaster />
            <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <ul className="divide-y divide-gray-200">
                    {items.map((item) => (
                        <li key={item.id} className="px-4 py-4 sm:px-6 flex items-center justify-between">
                            <div className="flex items-center">
                                <img
                                    src={item.images[0] || 'https://via.placeholder.com/100'}
                                    alt={item.name}
                                    className="h-16 w-16 object-cover rounded-md"
                                />
                                <div className="ml-4">
                                    <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
                                    <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <span className="text-lg font-medium text-gray-900 mr-4">
                                    ₹{parseFloat(item.price) * item.quantity}
                                </span>
                                <button
                                    onClick={() => removeItem(item.id)}
                                    className="text-red-600 hover:text-red-800"
                                >
                                    Remove
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
                <div className="px-4 py-4 sm:px-6 bg-gray-50 flex justify-between items-center">
                    <span className="text-xl font-bold">Total: ₹{total()}</span>
                    <button
                        onClick={handleCheckout}
                        className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700"
                    >
                        Checkout
                    </button>
                </div>
            </div>
        </div>
    );
}
