'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';

function PaymentContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { getAccessToken } = useAuth();
    const packageId = searchParams.get('package');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [selectedPackage, setSelectedPackage] = useState<any>(null);

    useEffect(() => {
        if (!packageId) {
            router.push('/farm/services');
            return;
        }

        axios.get('http://localhost:5001/api/subscriptions/packages')
            .then(res => {
                const pkg = res.data.find((p: any) => p.id === packageId);
                if (pkg) setSelectedPackage(pkg);
                else setError('Gói dịch vụ không tồn tại');
            });
    }, [packageId, router]);

    const handleManualConfirmation = async () => {
        setLoading(true);
        setError('');

        try {
            const token = await getAccessToken();
            if (!token) throw new Error("Vui lòng đăng nhập lại");

            // 1. Tạo bản ghi Subscription (pending)
            const subRes = await axios.post('http://localhost:5001/api/subscriptions/subscribe', {
                packageId: packageId
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (subRes.data.paymentRequired) {
                // 2. Xác nhận thanh toán thủ công (Giả lập bank transfer thành công)
                // Gọi endpoint mới confirmManualPayment
                await axios.post('http://localhost:5001/api/payments/confirm-manual', {
                    subscriptionId: subRes.data.subscription.id,
                    amount: subRes.data.paymentData.amount,
                    description: `BICAP ${selectedPackage.name.replace(/\s+/g, '')}`
                }, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                // 3. Chuyển hướng thành công
                router.push('/farm/services?success=true');
            } else if (subRes.data.subscription.status === 'active') {
                // Trường hợp gói miễn phí hoặc đã active
                router.push('/farm/services?success=true');
            }

        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.message || 'Có lỗi xảy ra khi xác nhận thanh toán');
            setLoading(false);
        }
    };

    if (!selectedPackage && !error) return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500">Đang tải thông tin...</div>;
    if (error) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
            <div className="text-red-500 font-bold mb-4">{error}</div>
            <button onClick={() => router.push('/farm/services')} className="text-blue-600 underline">Quay lại</button>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center font-sans">
            <div className="max-w-md w-full">
                <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-8 text-center text-white">
                        <div className="bg-white/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-md">
                            <span className="text-3xl">💳</span>
                        </div>
                        <h2 className="text-2xl font-bold">Thanh Toán Dịch Vụ</h2>
                        <p className="text-green-100 text-sm mt-1">Cổng thanh toán an toàn qua VNPay</p>
                    </div>

                    <div className="p-8">
                        {/* Package Info */}
                        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-6 mb-8 border border-gray-100 dark:border-gray-600">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-gray-500 text-xs uppercase font-bold tracking-wider">Thông tin gói</span>
                                <span className="bg-green-100 text-green-700 text-[10px] font-black px-2 py-0.5 rounded uppercase">Premium</span>
                            </div>
                            <p className="text-xl font-black text-gray-800 dark:text-white uppercase">{selectedPackage.name}</p>
                            <p className="text-sm text-gray-500 mb-4">{selectedPackage.durationMonths} tháng sử dụng</p>
                            <div className="w-full border-t border-gray-200 dark:border-gray-600 my-4 border-dashed"></div>
                            <div className="flex justify-between items-end">
                                <span className="text-gray-500 text-sm">Tổng thanh toán:</span>
                                <span className="text-2xl font-black text-green-600">
                                    {selectedPackage.price.toLocaleString('vi-VN')} đ
                                </span>
                            </div>
                        </div>

                        {/* VietQR Bank Transfer Info */}
                        <div className="bg-white border-2 border-blue-500 rounded-2xl p-6 mb-8 text-center shadow-lg transform hover:scale-105 transition-transform duration-300">
                            <h3 className="text-lg font-bold text-blue-800 mb-2 uppercase">Chuyển khoản Ngân hàng</h3>

                            {/* QR Code */}
                            <div className="mx-auto w-64 h-64 bg-gray-200 mb-4 rounded-xl overflow-hidden shadow-inner">
                                {selectedPackage && (
                                    <img
                                        src={`https://img.vietqr.io/image/MB-0000123456789-compact2.png?amount=${selectedPackage.price}&addInfo=BICAP ${selectedPackage.name.replace(/\s+/g, '')}&accountName=BiCap System`}
                                        alt="VietQR Payment"
                                        className="w-full h-full object-contain"
                                    />
                                )}
                            </div>

                            <p className="text-sm text-gray-500 mb-2">Quét mã QR bằng ứng dụng ngân hàng của bạn</p>

                            <div className="bg-blue-50 rounded-lg p-3 text-left space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Ngân hàng:</span>
                                    <span className="font-bold text-gray-800">MB Bank (Quân Đội)</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Số tài khoản:</span>
                                    <span className="font-bold text-gray-800 tracking-wider">0000 1234 56789</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Chủ tài khoản:</span>
                                    <span className="font-bold text-gray-800 uppercase">BiCap System</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Nội dung:</span>
                                    <span className="font-bold text-red-500">BICAP {selectedPackage?.name.replace(/\s+/g, '')}</span>
                                </div>
                            </div>
                        </div>

                        {/* Note */}
                        <div className="mb-8 flex items-start gap-3 p-4 bg-yellow-50 dark:bg-yellow-900/10 rounded-xl border border-yellow-100 dark:border-yellow-800 text-xs text-yellow-700 dark:text-yellow-400">
                            <span>⚡</span>
                            <p>Sau khi chuyển khoản thành công, vui lòng nhấn nút <b>"Tôi đã chuyển khoản"</b> bên dưới để hệ thống kích hoạt gói ngay lập tức.</p>
                        </div>

                        {/* Payment Button */}
                        <div className="mt-8 space-y-3">
                            <button
                                onClick={handleManualConfirmation}
                                disabled={loading}
                                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-lg shadow-lg shadow-blue-200 transition-all transform active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
                            >
                                {loading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                        <span>Đang xử lý...</span>
                                    </>
                                ) : (
                                    <> ✅ Tôi đã chuyển khoản </>
                                )}
                            </button>
                            <button
                                onClick={() => router.back()}
                                className="w-full py-3 text-gray-400 font-bold text-sm hover:text-gray-600 transition-colors"
                            >
                                Hủy giao dịch
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function PaymentPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Đang tải...</div>}>
            <PaymentContent />
        </Suspense>
    );
}
