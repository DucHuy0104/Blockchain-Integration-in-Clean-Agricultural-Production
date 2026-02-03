'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

function PaymentResultContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const status = searchParams.get('status');
    const txnRef = searchParams.get('txnRef');

    const [countdown, setCountdown] = useState(5);

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    router.push('/farm');
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [router]);

    const isSuccess = status === 'success';

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 text-center border border-gray-100 overflow-hidden relative">

                {/* Background Decor */}
                <div className={`absolute top-0 inset-x-0 h-2 ${isSuccess ? 'bg-green-500' : 'bg-red-500'}`}></div>

                {isSuccess ? (
                    <div className="space-y-6">
                        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-4xl mx-auto shadow-inner animate-[bounce_1s_infinite]">
                            ✓
                        </div>
                        <h1 className="text-3xl font-black text-gray-800">Thanh Toán Thành Công!</h1>
                        <p className="text-gray-500">
                            Cảm ơn bạn! Gói dịch vụ đã được kích hoạt. Mã giao dịch của bạn là: <br />
                            <strong className="text-gray-800 font-mono mt-2 block">{txnRef}</strong>
                        </p>
                        <div className="bg-green-50 p-4 rounded-xl border border-green-100 text-green-700 text-sm font-medium">
                            🚀 Hệ thống đang chuẩn bị tài nguyên cho bạn...
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-4xl mx-auto">
                            ✕
                        </div>
                        <h1 className="text-3xl font-black text-gray-800">Thanh Toán Thất Bại</h1>
                        <p className="text-gray-500">
                            Tiếc quá! Đã có lỗi xảy ra hoặc bạn đã hủy giao dịch. Vui lòng thử lại sau.
                        </p>
                        <div className="bg-red-50 p-4 rounded-xl border border-red-100 text-red-700 text-sm font-medium">
                            ⚠️ Số tiền của bạn (nếu đã trừ) sẽ được hoàn trả theo quy định của VNPay.
                        </div>
                    </div>
                )}

                <div className="pt-8 space-y-4">
                    <Link
                        href="/farm"
                        className="block w-full py-4 bg-gray-800 hover:bg-black text-white rounded-2xl font-bold transition-all shadow-lg"
                    >
                        Quay về Dashboard ({countdown}s)
                    </Link>
                    <Link
                        href="/farm/services"
                        className="block w-full py-3 text-gray-400 font-bold text-sm"
                    >
                        Quay về trang Dịch vụ
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default function PaymentResultPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Đang tải kết quả...</div>}>
            <PaymentResultContent />
        </Suspense>
    );
}
