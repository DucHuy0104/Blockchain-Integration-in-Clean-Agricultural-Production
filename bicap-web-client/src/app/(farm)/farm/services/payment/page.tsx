'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { auth } from '@/lib/firebase';
import axios from 'axios';

function PaymentContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { user } = useAuth();
    const packageId = searchParams.get('package');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [selectedPackage, setSelectedPackage] = useState<any>(null);

    // Form inputs
    const [cardName, setCardName] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvc, setCvc] = useState('');

    useEffect(() => {
        if (!packageId) {
            router.push('/farm/services');
            return;
        }

        // Fetch package details again to confirm (optional, could pass via context state but API check is safer)
        axios.get('http://localhost:5001/api/subscriptions/packages')
            .then(res => {
                const pkg = res.data.find((p: any) => p.id === packageId);
                if (pkg) setSelectedPackage(pkg);
                else setError('Gói dịch vụ không tồn tại');
            });
    }, [packageId, router]);

    const handlePayment = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const token = await auth?.currentUser?.getIdToken();
            if (!token) throw new Error("Vui lòng đăng nhập lại");

            // Call Backend Mock Payment
            await axios.post('http://localhost:5001/api/subscriptions/subscribe', {
                packageId: packageId,
                paymentDetails: {
                    cardNumber,
                    cardName,
                    expiry,
                    cvc
                }
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Success
            alert('Thanh toán thành công! Gói dịch vụ đã được kích hoạt.');
            router.push('/farm'); // Back to dashboard

        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.message || 'Có lỗi xảy ra khi thanh toán');
        } finally {
            setLoading(false);
        }
    };

    if (!selectedPackage && !error) return <div className="p-8">Đang tải thông tin...</div>;
    if (error) return <div className="p-8 text-red-600">{error}</div>;

    return (
        <div className="max-w-md mx-auto bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl mt-10">
            <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Thanh Toán Dịch Vụ</h1>

            <div className="mb-6 bg-green-50 dark:bg-green-900 p-4 rounded-lg">
                <h3 className="font-semibold text-green-800 dark:text-green-200">{selectedPackage.name}</h3>
                <p className="text-2xl font-bold text-green-700 dark:text-green-300 mt-2">
                    {selectedPackage.price.toLocaleString('vi-VN')}đ
                    <span className="text-sm font-normal text-green-600 dark:text-green-400"> / {selectedPackage.durationMonths} tháng</span>
                </p>
            </div>

            <form onSubmit={handlePayment} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tên trên thẻ</label>
                    <input
                        type="text"
                        required
                        value={cardName}
                        onChange={e => setCardName(e.target.value)}
                        placeholder="NGUYEN VAN A"
                        className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Số thẻ</label>
                    <input
                        type="text"
                        required
                        value={cardNumber}
                        onChange={e => setCardNumber(e.target.value)}
                        placeholder="0000 0000 0000 0000"
                        maxLength={19}
                        className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Hết hạn (MM/YY)</label>
                        <input
                            type="text"
                            required
                            value={expiry}
                            onChange={e => setExpiry(e.target.value)}
                            placeholder="12/25"
                            maxLength={5}
                            className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">CVC</label>
                        <input
                            type="text"
                            required
                            value={cvc}
                            onChange={e => setCvc(e.target.value)}
                            placeholder="123"
                            maxLength={3}
                            className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                        />
                    </div>
                </div>

                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold text-white bg-green-600 hover:bg-green-700 focus:outline-none disabled:opacity-50"
                    >
                        {loading ? 'Đang xử lý...' : `Thanh Toán ${selectedPackage.price.toLocaleString('vi-VN')}đ`}
                    </button>
                    <p className="text-xs text-center text-gray-500 mt-2">
                        Đây là thanh toán giả lập. Không có tiền thật bị trừ.
                    </p>
                </div>
            </form>
        </div>
    );
}

// Wrap in Suspense as required by Next.js for useSearchParams
export default function PaymentPage() {
    return (
        <Suspense fallback={<div>Đang tải...</div>}>
            <PaymentContent />
        </Suspense>
    );
}
