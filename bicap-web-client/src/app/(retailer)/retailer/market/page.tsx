'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

interface Product {
    id: number;
    name: string;
    price: number;
    quantity: number;
    farm: {
        name: string;
        address: string;
        certification: string;
    };
    season: {
        name: string;
    } | null;
    batchCode: string;
}

export default function RetailerMarketPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('http://localhost:5001/api/products')
            .then(res => setProducts(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    const handleBuyClick = (product: Product) => {
        // Navigate to the detail page for functionality
        router.push(`/retailer/market/${product.id}`);
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
            {/* Hero Section */}
            <div className="bg-green-700 text-white py-8 px-4 text-center rounded-b-xl shadow-md mb-6">
                <h1 className="text-3xl font-bold mb-2">Sàn Nông Sản Dành Cho Nhà Bán Lẻ</h1>
                <p className="text-green-100 max-w-2xl mx-auto text-sm">
                    Tìm nguồn hàng chất lượng cao, minh bạch nguồn gốc từ các nông trại uy tín.
                </p>
            </div>

            {/* Product List */}
            <div className="container mx-auto p-4">
                {loading ? (
                    <div className="text-center py-10">Đang tải sản phẩm...</div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {products.map(product => (
                            <div key={product.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-2xl transition hover:-translate-y-1">
                                <div
                                    className="h-48 bg-gray-200 flex items-center justify-center relative cursor-pointer"
                                    onClick={() => handleBuyClick(product)}
                                >
                                    <span className="text-4xl">🌾</span>
                                    {/* Badge for certification */}
                                    <span className="absolute top-2 right-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full shadow-sm font-medium">
                                        {product.farm.certification}
                                    </span>
                                </div>
                                <div className="p-5">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3
                                            className="text-lg font-bold text-gray-800 dark:text-white truncate cursor-pointer hover:text-green-600"
                                            title={product.name}
                                            onClick={() => handleBuyClick(product)}
                                        >
                                            {product.name}
                                        </h3>
                                    </div>
                                    <p className="text-gray-500 text-sm mb-4 truncate" title={product.farm.address}>
                                        🏠 {product.farm.name}
                                    </p>

                                    <div className="flex justify-between items-center mb-4 bg-gray-50 p-2 rounded-lg">
                                        <div>
                                            <p className="text-xs text-gray-400 uppercase font-semibold">Giá bán</p>
                                            <p className="text-lg font-bold text-green-600">{product.price.toLocaleString('vi-VN')} đ/kg</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-gray-400 uppercase font-semibold">Còn lại</p>
                                            <p className="font-semibold text-gray-800 dark:text-gray-200">{product.quantity} kg</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-2">
                                        <button
                                            onClick={() => handleBuyClick(product)}
                                            disabled={product.quantity === 0}
                                            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded transition disabled:bg-gray-400 flex items-center justify-center gap-2"
                                        >
                                            {product.quantity === 0 ? 'Hết hàng' : 'Xem Chi Tiết & Đặt Mua'}
                                        </button>

                                        {product.season && (
                                            <Link href={`/traceability/${(product as any).seasonId || '#'}`} className="text-xs text-blue-500 hover:underline flex items-center justify-center gap-1 py-1">
                                                🔍 Truy xuất nguồn gốc
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
