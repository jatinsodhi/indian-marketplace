'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { api } from '@/lib/api';
import { useCartStore } from '@/store/cartStore';
import { toast, Toaster } from 'react-hot-toast';

interface Product {
    id: string;
    name: string;
    description: string;
    price: string;
    stock: number;
    category: string;
    images: string[];
    vendor: {
        storeName: string;
    };
}

export default function ProductDetailPage() {
    const { id } = useParams();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const { addItem } = useCartStore();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { data } = await api.get(`/products/${id}`);
                setProduct(data);
            } catch (error) {
                toast.error('Failed to load product');
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchProduct();
    }, [id]);

    if (loading) return <div>Loading...</div>;
    if (!product) return <div>Product not found</div>;

    return (
        <div className="bg-white">
            <Toaster />
            <div className="pt-6">
                {/* Image gallery */}
                <div className="mt-6 max-w-2xl mx-auto sm:px-6 lg:max-w-7xl lg:px-8 lg:grid lg:grid-cols-3 lg:gap-x-8">
                    <div className="aspect-w-3 aspect-h-4 rounded-lg overflow-hidden lg:block">
                        <img
                            src={product.images[0] || 'https://via.placeholder.com/600'}
                            alt={product.name}
                            className="w-full h-full object-center object-cover"
                        />
                    </div>
                </div>

                {/* Product info */}
                <div className="max-w-2xl mx-auto pt-10 pb-16 px-4 sm:px-6 lg:max-w-7xl lg:pt-16 lg:pb-24 lg:px-8 lg:grid lg:grid-cols-3 lg:grid-rows-[auto,auto,1fr] lg:gap-x-8">
                    <div className="lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8">
                        <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">{product.name}</h1>
                    </div>

                    {/* Options */}
                    <div className="mt-4 lg:mt-0 lg:row-span-3">
                        <h2 className="sr-only">Product information</h2>
                        <p className="text-3xl text-gray-900">₹{product.price}</p>

                        <div className="mt-10">
                            <button
                                type="submit"
                                onClick={() => {
                                    addItem(product);
                                    toast.success('Added to cart');
                                }}
                                className="mt-10 w-full bg-indigo-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Add to Cart
                            </button>
                        </div>

                        <div className="mt-6 text-sm text-gray-500">
                            Sold by: <span className="font-medium text-gray-900">{product.vendor?.storeName}</span>
                        </div>
                    </div>

                    <div className="py-10 lg:pt-6 lg:pb-16 lg:col-start-1 lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8">
                        {/* Description and details */}
                        <div>
                            <h3 className="sr-only">Description</h3>
                            <div className="space-y-6">
                                <p className="text-base text-gray-900">{product.description}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
