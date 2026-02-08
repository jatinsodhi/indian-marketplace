'use client';

import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { ShoppingCart, User, LogOut } from 'lucide-react';
import { useEffect } from 'react';

export default function Navbar() {
    const { user, isAuthenticated, logout, loadUser } = useAuthStore();

    useEffect(() => {
        loadUser();
    }, [loadUser]);

    return (
        <nav className="bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <Link href="/" className="flex-shrink-0 flex items-center">
                            <span className="font-bold text-xl text-indigo-600">MarketIndia</span>
                        </Link>
                    </div>
                    <div className="flex items-center space-x-4">
                        <Link href="/cart" className="text-gray-600 hover:text-indigo-600">
                            <ShoppingCart className="h-6 w-6" />
                        </Link>

                        {isAuthenticated ? (
                            <div className="flex items-center space-x-4">
                                {user?.role === 'VENDOR' && (
                                    <Link href="/dashboard/vendor" className="text-sm font-medium text-gray-700 hover:text-indigo-600">
                                        Vendor Dashboard
                                    </Link>
                                )}
                                <span className="text-sm text-gray-700">Hi, {user?.name || user?.email}</span>
                                <button onClick={logout} className="text-gray-600 hover:text-red-600">
                                    <LogOut className="h-5 w-5" />
                                </button>
                            </div>
                        ) : (
                            <Link href="/auth" className="flex items-center text-gray-600 hover:text-indigo-600">
                                <User className="h-5 w-5 mr-1" />
                                <span>Login / Register</span>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
