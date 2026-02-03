'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { auth, storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

interface OrderDetail {
    id: number;
    productId: number;
    product: {
        name: string;
        price: number;
        farm: {
            name: string;
            address: string;
            ownerId: number;
        };
    };
    quantity: number;
    totalPrice: number;
    depositAmount: number;
    status: string;
    createdAt: string;
    contractTerms?: string;
}

export default function RetailerOrderDetail() {
    const { user, getAccessToken } = useAuth();
    const router = useRouter();
    const params = useParams();
    const id = params?.id;

    const [order, setOrder] = useState<OrderDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [deliveryImage, setDeliveryImage] = useState<string | null>(null);
    const [deliveryFile, setDeliveryFile] = useState<File | null>(null);

    // Message Modal State
    const [showMsgModal, setShowMsgModal] = useState(false);
    const [msgContent, setMsgContent] = useState('');

    useEffect(() => {
        if (!user || !id) return;
        const fetchOrder = async () => {
            try {
                const token = await getAccessToken();
                const res = await axios.get('http://localhost:5001/api/orders/my-orders', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const found = res.data.orders.find((o: any) => o.id === Number(id));
                setOrder(found || null);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [user, id]);

    const handleCancel = async () => {
        if (!confirm('Bạn có chắc chắn muốn hủy đơn hàng này?')) return;
        setActionLoading(true);
        try {
            const token = await getAccessToken();
            await axios.put(`http://localhost:5001/api/orders/${order?.id}/cancel`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Đã hủy đơn hàng thành công!');
            window.location.reload();
        } catch (error) {
            console.error(error);
            alert('Lỗi hủy đơn hàng');
        } finally {
            setActionLoading(false);
        }
    };

    const handleConfirmDelivery = async () => {
        if (!confirm('Xác nhận đã nhận đủ hàng?')) return;
        if (!deliveryFile && !deliveryImage) {
            alert('Vui lòng tải lên ảnh bằng chứng nhận hàng.');
            return;
        }

        setActionLoading(true);
        try {
            const token = await getAccessToken();

            console.log("🚀 --- CONFIRMING DELIVERY (DIRECT BACKEND UPLOAD) ---");
            const formData = new FormData();

            // Ưu tiên gửi file gốc nếu có (người dùng vừa chọn)
            if (deliveryFile) {
                formData.append('deliveryImage', deliveryFile);
            } else if (deliveryImage) {
                // Trường hợp hiếm: ảnh đã có URL (ví dụ từ trước), gửi URL string
                formData.append('deliveryImage', deliveryImage);
            }

            await axios.put(`http://localhost:5001/api/orders/${order?.id}/confirm-delivery`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            alert('Xác nhận thành công!');
            window.location.reload();
        } catch (error) {
            console.error(error);
            alert('Lỗi xác nhận hoặc tải ảnh minh chứng');
        } finally {
            setActionLoading(false);
        }
    };

    const handlePayDeposit = async () => {
        if (!confirm('Xác nhận thanh toán tiền cọc?')) return;
        try {
            const token = await getAccessToken();
            await axios.put(`http://localhost:5001/api/orders/${order?.id}/pay-deposit`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Thanh toán tiền cọc thành công!');
            window.location.reload();
        } catch (error) {
            console.error(error);
            alert('Lỗi thanh toán tiền cọc');
        }
    };

    const handlePayRemaining = async () => {
        if (!confirm('Xác nhận thanh toán phần còn lại để hoàn tất đơn hàng?')) return;
        try {
            const token = await getAccessToken();
            await axios.put(`http://localhost:5001/api/orders/${order?.id}/pay-remaining`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Thanh toán hoàn tất! Đơn hàng đã đóng.');
            window.location.reload();
        } catch (error) {
            console.error(error);
            alert('Lỗi thanh toán');
        }
    };

    const handleOpenMessageModal = () => {
        setMsgContent('');
        setShowMsgModal(true);
    };

    const handleSubmitMessage = async () => {
        if (!msgContent.trim()) {
            alert('Vui lòng nhập nội dung tin nhắn');
            return;
        }
        setActionLoading(true);
        try {
            const token = await getAccessToken();
            await axios.post('http://localhost:5001/api/notifications/send', {
                receiverId: order?.product.farm.ownerId,
                title: `Tin nhắn từ Nhà bán lẻ (ĐH #${order?.id})`,
                message: msgContent,
                type: 'message'
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Đã gửi tin nhắn thành công!');
            setShowMsgModal(false);
        } catch (error) {
            console.error(error);
            alert('Lỗi gửi tin nhắn');
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) return <div className="p-8 text-center">Đang tải chi tiết đơn hàng...</div>;
    if (!order) return <div className="p-8 text-center text-red-500">Không tìm thấy đơn hàng.</div>;

    const steps = [
        { status: 'deposited', label: 'Đã đặt cọc' },
        { status: 'confirmed', label: 'Chủ trại xác nhận' },
        { status: 'shipping', label: 'Đang vận chuyển' },
        { status: 'delivered', label: 'Đã nhận hàng' },
        { status: 'completed', label: 'Hoàn tất thanh toán' },
    ];

    const getStatusBadge = (status: string) => {
        const map: Record<string, string> = {
            pending: 'bg-yellow-100 text-yellow-800',
            deposited: 'bg-blue-100 text-blue-800',
            confirmed: 'bg-indigo-100 text-indigo-800',
            shipping: 'bg-purple-100 text-purple-800',
            completed: 'bg-green-100 text-green-800',
            cancelled: 'bg-red-100 text-red-800'
        };
        const labelMap: Record<string, string> = {
            pending: 'Chờ xử lý',
            deposited: 'Đã cọc',
            confirmed: 'Đã xác nhận',
            shipping: 'Đang giao',
            delivered: 'Chờ thanh toán',
            completed: 'Hoàn thành',
            cancelled: 'Đã hủy'
        };
        return (
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${map[status] || 'bg-gray-100'}`}>
                {labelMap[status] || status}
            </span>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-12">
            <div className="container mx-auto max-w-5xl px-4 py-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <Link href="/retailer/orders" className="text-gray-500 hover:text-gray-700 flex items-center mb-2">
                            ← Quay lại danh sách
                        </Link>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Đơn hàng #{order.id}
                        </h1>
                        <p className="text-gray-500 text-sm mt-1">
                            Ngày tạo: {new Date(order.createdAt).toLocaleString('vi-VN')}
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        {getStatusBadge(order.status)}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Details */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Product Card */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                            <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex gap-6">
                                <div className="w-24 h-24 bg-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center text-4xl">
                                    📦
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                                        {order.product.name}
                                    </h2>
                                    <p className="text-green-600 font-semibold mb-2">
                                        {order.product.price.toLocaleString()} đ / kg
                                    </p>
                                    <div className="text-sm text-gray-500">
                                        <p>🏠 Trang trại: <span className="font-medium text-gray-700 dark:text-gray-300">{order.product.farm.name}</span></p>
                                        <p>📍 Địa chỉ: {order.product.farm.address}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 bg-gray-50 dark:bg-gray-800/50">
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Chi tiết thanh toán</h3>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Số lượng mua:</span>
                                        <span className="font-medium">{order.quantity} kg</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Điều khoản:</span>
                                        <span className="font-medium">{order.contractTerms || 'Mua qua sàn'}</span>
                                    </div>
                                    <div className="h-px bg-gray-200 dark:bg-gray-700 my-2"></div>
                                    <div className="flex justify-between text-base font-bold text-gray-900 dark:text-white">
                                        <span>Tổng tiền:</span>
                                        <span>{Number(order.totalPrice).toLocaleString()} đ</span>
                                    </div>
                                    <div className="flex justify-between text-blue-600">
                                        <span>Tiền cọc (30%):</span>
                                        <span>{(Number(order.totalPrice) * 0.3).toLocaleString()} đ</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Area */}
                        {(order.status === 'pending' || order.status === 'shipping') && (
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                                <h3 className="text-lg font-bold mb-4 dark:text-white">
                                    {order.status === 'pending' ? 'Thanh toán & Xác nhận' : 'Xác nhận nhận hàng'}
                                </h3>

                                {order.status === 'pending' && (
                                    <div className="flex flex-col gap-3">
                                        <p className="text-sm text-gray-600 mb-2">
                                            Vui lòng thanh toán tiền cọc để trang trại tiến hành xác nhận đơn hàng.
                                        </p>
                                        <div className="flex gap-3">
                                            <button
                                                onClick={handlePayDeposit}
                                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition shadow-sm"
                                            >
                                                Thanh toán Cọc ({(order.totalPrice * 0.3).toLocaleString()} đ)
                                            </button>
                                            <button
                                                onClick={handleCancel}
                                                className="px-6 border border-red-200 text-red-600 hover:bg-red-50 font-bold py-3 rounded-lg transition"
                                            >
                                                Hủy đơn
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {order.status === 'shipping' && (
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Tải lên ảnh nhận hàng (Bắt buộc):
                                            </label>
                                            <div className="flex items-center gap-4">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => {
                                                        const files = e.target.files;
                                                        if (files && files.length > 0) {
                                                            const file = files[0];
                                                            setDeliveryFile(file);
                                                            const url = URL.createObjectURL(file);
                                                            setDeliveryImage(url);
                                                        }
                                                    }}
                                                    className="block w-full text-sm text-gray-500
                                                    file:mr-4 file:py-2 file:px-4
                                                    file:rounded-full file:border-0
                                                    file:text-sm file:font-semibold
                                                    file:bg-blue-50 file:text-blue-700
                                                    hover:file:bg-blue-100"
                                                />
                                            </div>
                                            {deliveryImage && (
                                                <div className="mt-3">
                                                    <img src={deliveryImage} alt="Proof" className="h-32 rounded border border-gray-200" />
                                                </div>
                                            )}
                                        </div>
                                        <button
                                            onClick={handleConfirmDelivery}
                                            disabled={actionLoading}
                                            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition shadow-sm"
                                        >
                                            Xác nhận đã nhận đủ hàng
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>


                    {order.status === 'delivered' && (
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                            <h3 className="text-lg font-bold mb-4 dark:text-white">Thanh Toán Phần Còn Lại</h3>
                            <div className="space-y-4">
                                <div className="bg-yellow-50 text-yellow-800 p-4 rounded-lg flex items-start gap-3">
                                    <span className="text-xl">⚠️</span>
                                    <div>
                                        <p className="font-bold">Đơn hàng đã được giao nhận thành công.</p>
                                        <p className="text-sm">Vui lòng thanh toán số tiền còn lại để hoàn tất hợp đồng.</p>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                    <span className="text-gray-600">Tổng giá trị:</span>
                                    <span className="font-semibold">{Number(order.totalPrice).toLocaleString()} đ</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                    <span className="text-gray-600">Đã cọc:</span>
                                    <span className="font-semibold text-green-600">
                                        -{(Number(order.totalPrice) * 0.3).toLocaleString()} đ
                                    </span>
                                </div>
                                <div className="flex justify-between items-center py-2 text-lg">
                                    <span className="font-bold text-gray-800 dark:text-gray-200">Cần thanh toán:</span>
                                    <span className="font-bold text-red-600">
                                        {(Number(order.totalPrice) * 0.7).toLocaleString()} đ
                                    </span>
                                </div>

                                <button
                                    onClick={handlePayRemaining}
                                    disabled={actionLoading}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition shadow-lg shadow-blue-200 dark:shadow-none"
                                >
                                    Thanh toán ngay
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column: Timeline & Support */}
                <div className="lg:col-span-1 space-y-6">

                    {/* Shipment Info Card */}
                    {(order.status === 'shipping' || order.status === 'delivered') && (
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                            <h3 className="text-lg font-bold mb-4 dark:text-white">Thông tin vận chuyển</h3>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                        🚛
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Phương tiện</p>
                                        <p className="font-medium text-gray-900 dark:text-white">Xe tải lạnh (BKS: {(order as any).shipment?.vehicleInfo || 'Đang cập nhật'})</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                        👤
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Tài xế</p>
                                        <p className="font-medium text-gray-900 dark:text-white">{(order as any).shipment?.driver?.fullName || 'Chưa gán'}</p>
                                        <p className="text-xs text-gray-500">{(order as any).shipment?.driver?.phone}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Timeline Card */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                        <h3 className="text-lg font-bold mb-6 dark:text-white">Theo dõi đơn hàng</h3>
                        <div className="relative pl-2">
                            {/* Vertical Line */}
                            <div className="absolute left-[9px] top-2 bottom-4 w-0.5 bg-gray-200 dark:bg-gray-700"></div>

                            <div className="space-y-8 relative">
                                {steps.map((step, idx) => {
                                    const isCompleted =
                                        order.status === step.status ||
                                        (order.status === 'confirmed' && idx < 2) ||
                                        (order.status === 'shipping' && idx < 3) ||
                                        (order.status === 'completed');

                                    // Special logic for active pulsing dot
                                    const isCurrent = order.status === step.status;

                                    return (
                                        <div key={idx} className="flex items-start gap-4">
                                            <div className={`
                                                    relative z-10 w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5
                                                    ${isCompleted
                                                    ? 'bg-green-500 border-green-500'
                                                    : 'bg-white border-gray-300 dark:bg-gray-800 dark:border-gray-600'}
                                                `}>
                                                {isCompleted && (
                                                    <svg className="w-full h-full text-white p-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                                    </svg>
                                                )}
                                            </div>
                                            <div>
                                                <p className={`text-sm font-semibold ${isCompleted ? 'text-gray-900 dark:text-white' : 'text-gray-500'}`}>
                                                    {step.label}
                                                </p>
                                                {isCompleted && (
                                                    <p className="text-xs text-gray-500 mt-0.5">
                                                        {new Date(order.createdAt).toLocaleDateString()}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Contact Card */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                        <h3 className="font-bold text-gray-900 dark:text-white mb-2">Hỗ trợ</h3>
                        <p className="text-sm text-gray-500 mb-4">
                            Bạn cần trao đổi thêm với chủ trại về đơn hàng này?
                        </p>
                        <button
                            onClick={handleOpenMessageModal}
                            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-200 font-medium py-2 rounded-lg transition text-sm flex items-center justify-center gap-2"
                        >
                            <span>💬</span> Nhắn tin cho chủ trại
                        </button>
                    </div>

                </div>
            </div>


            {/* Message Modal */}
            {
                showMsgModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all scale-100">
                            <div className="bg-green-600 p-4 flex justify-between items-center">
                                <h3 className="text-white font-bold text-lg flex items-center gap-2">
                                    💬 Gửi tin nhắn
                                </h3>
                                <button
                                    onClick={() => setShowMsgModal(false)}
                                    className="text-white/80 hover:text-white transition-colors"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <div className="p-6">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Nội dung tin nhắn gửi tới chủ trại:
                                </label>
                                <textarea
                                    value={msgContent}
                                    onChange={(e) => setMsgContent(e.target.value)}
                                    rows={5}
                                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white resize-none"
                                    placeholder="Nhập câu hỏi hoặc yêu cầu của bạn..."
                                ></textarea>
                                <div className="mt-6 flex gap-3">
                                    <button
                                        onClick={() => setShowMsgModal(false)}
                                        className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-medium transition"
                                    >
                                        Hủy bỏ
                                    </button>
                                    <button
                                        onClick={handleSubmitMessage}
                                        disabled={actionLoading}
                                        className="flex-1 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 font-bold shadow-lg shadow-green-200 dark:shadow-none transition flex justify-center items-center gap-2 disabled:bg-gray-400"
                                    >
                                        {actionLoading ? (
                                            <>
                                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Đang gửi...
                                            </>
                                        ) : (
                                            <>
                                                Gửi tin nhắn
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
}
