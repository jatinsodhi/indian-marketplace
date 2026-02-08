'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { api } from '@/lib/api';
import { toast, Toaster } from 'react-hot-toast';

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [role, setRole] = useState<'CUSTOMER' | 'VENDOR'>('CUSTOMER');
    const [storeName, setStoreName] = useState('');
    const [description, setDescription] = useState('');

    const router = useRouter();
    const { login } = useAuthStore();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const endpoint = isLogin ? '/auth/login' : '/auth/register';
            const payload = isLogin
                ? { email, password }
                : { email, password, name, role, storeName, description };

            const { data } = await api.post(endpoint, payload);
            login(data.token, data.user);
            toast.success(isLogin ? 'Logged in successfully' : 'Registered successfully');

            if (data.user.role === 'VENDOR') {
                router.push('/dashboard/vendor');
            } else {
                router.push('/');
            }
        } catch (error: any) {
            toast.error(error.response?.data?.error || 'Authentication failed');
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
            <Toaster />
            <h2 className="text-2xl font-bold mb-6 text-center">{isLogin ? 'Login' : 'Register'}</h2>

            <div className="flex justify-center mb-6">
                <button
                    className={`px-4 py-2 ${isLogin ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}
                    onClick={() => setIsLogin(true)}
                >
                    Login
                </button>
                <button
                    className={`px-4 py-2 ${!isLogin ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}
                    onClick={() => setIsLogin(false)}
                >
                    Register
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                            required
                        />
                    </div>
                )}

                <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                        required
                    />
                </div>

                {!isLogin && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Role</label>
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value as 'CUSTOMER' | 'VENDOR')}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                        >
                            <option value="CUSTOMER">Customer</option>
                            <option value="VENDOR">Vendor</option>
                        </select>
                    </div>
                )}

                {!isLogin && role === 'VENDOR' && (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Store Name</label>
                            <input
                                type="text"
                                value={storeName}
                                onChange={(e) => setStoreName(e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Description</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                            />
                        </div>
                    </>
                )}

                <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    {isLogin ? 'Login' : 'Register'}
                </button>
            </form>
        </div>
    );
}
