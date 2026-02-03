'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

interface ServicePackage {
    id: string;
    name: string;
    price: number;
    durationMonths: number;
    features: string[];
}

export default function ServicePage() {
    const [packages, setPackages] = useState<ServicePackage[]>([]);
    const [currentPkg, setCurrentPkg] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const { getAccessToken, user } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 1. Fetch Packages
                const pkgRes = await axios.get('http://localhost:5001/api/subscriptions/packages');
                setPackages(pkgRes.data);

                // 2. Fetch Current Subscription (if logged in)
                const token = await getAccessToken();
                if (token) {
                    const subRes = await axios.get('http://localhost:5001/api/subscriptions/my-subscription', {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    if (subRes.data.subscription && subRes.data.subscription.status === 'active') {
                        setCurrentPkg(subRes.data.subscription.packageType);
                    }
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();

        // Show success alert if redirected from payment
        if (searchParams.get('success')) {
            alert('Thanh toán thành công! Gói dịch vụ đã được kích hoạt.');
        }

    }, [getAccessToken, searchParams]);

    const handleBuy = (pkgId: string) => {
        if (!user) {
            router.push('/auth/login');
            return;
        }
        router.push(`/farm/services/payment?package=${pkgId}`);
    };

    if (loading) return <div className="p-8 flex justify-center">Đang tải gói dịch vụ...</div>;

    return (
        <div className="max-w-6xl mx-auto p-4">
            <h1 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-white">Gói Dịch Vụ Nông Nghiệp</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {packages.map((pkg) => {
                    const isActive = currentPkg === pkg.id;
                    return (
                        <div key={pkg.id} className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border flex flex-col relative overflow-hidden ${isActive ? 'border-green-500 ring-2 ring-green-500 transform scale-105' : 'border-gray-100 dark:border-gray-700'}`}>

                            {isActive && (
                                <div className="absolute top-0 right-0 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">
                                    Đang sử dụng
                                </div>
                            )}

                            <div className="p-8 flex-grow">
                                <h2 className={`text-2xl font-bold text-center mb-4 ${isActive ? 'text-green-600' : 'text-gray-800 dark:text-white'}`}>{pkg.name}</h2>
                                <div className="text-center mb-6">
                                    <span className="text-4xl font-extrabold text-gray-800 dark:text-white">
                                        {pkg.price.toLocaleString('vi-VN')}đ
                                    </span>
                                    <span className="text-gray-500"> / {pkg.durationMonths} tháng</span>
                                </div>

                                <ul className="space-y-4 mb-8">
                                    {pkg.features.map((feature, index) => (
                                        <li key={index} className="flex items-center text-gray-600 dark:text-gray-300">
                                            <svg className={`h-5 w-5 mr-2 ${isActive ? 'text-green-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                            </svg>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="p-8 pt-0 mt-auto">
                                <button
                                    onClick={() => !isActive && handleBuy(pkg.id)}
                                    disabled={isActive}
                                    className={`w-full py-3 px-6 rounded-lg font-bold text-white transition-colors duration-200 ${isActive
                                            ? 'bg-green-100 text-green-700 cursor-default'
                                            : pkg.price === 0
                                                ? 'bg-gray-500 hover:bg-gray-600'
                                                : 'bg-green-600 hover:bg-green-700 shadow-md hover:shadow-lg'
                                        }`}
                                >
                                    {isActive ? '✓ Đang Sử Dụng' : (pkg.price === 0 ? 'Dùng Ngay' : 'Đăng Ký Ngay')}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
