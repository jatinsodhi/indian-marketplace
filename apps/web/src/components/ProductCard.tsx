'use client';

import Link from 'next/link';

interface Product {
    id: string;
    name: string;
    price: string;
    category: string;
    images: string[];
}

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    return (
        <Link href={`/products/${product.id}`} className="group">
            <div className="w-full aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg overflow-hidden xl:aspect-w-7 xl:aspect-h-8">
                <img
                    src={product.images[0] || 'https://via.placeholder.com/300'}
                    alt={product.name}
                    className="w-full h-full object-center object-cover group-hover:opacity-75"
                />
            </div>
            <h3 className="mt-4 text-sm text-gray-700">{product.name}</h3>
            <p className="mt-1 text-lg font-medium text-gray-900">₹{product.price}</p>
            <p className="text-sm text-gray-500">{product.category}</p>
        </Link>
    );
}
