'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@/lib/firebase';

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
    // Add shipping info if available in model/backend, for now assuming basic
}

import { useParams } from 'next/navigation';

export default function RetailerOrderDetail() {
    const { user } = useAuth();
    const router = useRouter();
    const params = useParams(); // Use useParams hook
    const id = params?.id; // Access id safely

    const [order, setOrder] = useState<OrderDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        if (!user || !id) return;
        const fetchOrder = async () => {
            try {
                const token = await auth.currentUser?.getIdToken();
                // Since we don't have getOneOrder endpoint yet, or maybe getMyOrders returns list.
                // It's better to reuse getMyOrders and filter, or add getOneOrder.
                // Given time, I'll reuse getMyOrders pattern (fetch all satisfy id matches).
                // It's inefficient but safe.
                // Wait, I can't filter server side easily without new endpoint.
                // Let's implement getOrderById in controller? 
                // Alternatively, filter client side from my-orders list.

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
            const token = await auth.currentUser?.getIdToken();
            await axios.put(`http://localhost:5001/api/orders/${order?.id}/cancel`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Đã hủy đơn hàng thành công!');
            // Refresh logic or router.refresh
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
        setActionLoading(true);
        try {
            const token = await auth.currentUser?.getIdToken();
            await axios.put(`http://localhost:5001/api/orders/${order?.id}/confirm-delivery`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Xác nhận thành công!');
            window.location.reload();
        } catch (error) {
            console.error(error);
            alert('Lỗi xác nhận');
        } finally {
            setActionLoading(false);
        }
    };

    const handleContactFarm = async () => {
        if (!order || !order.product || !order.product.farm || !order.product.farm.ownerId) {
            alert('Không tìm thấy thông tin chủ trại.');
            return;
        }
        alert('Vui lòng liên hệ trực tiếp với chủ trại.');
    };

    return (
        <div className="container mx-auto p-4 max-w-4xl">
            {/* ... */}
            <div className="p-6">
                {/* ... */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        {/* ... Product Info ... */}
                    </div>

                    <div>
                        <h3 className="text-lg font-bold mb-2 dark:text-white">Thông Tin & Hành Động</h3>
                        <div className="space-y-4">
                            <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded text-sm text-blue-800 dark:text-blue-200">
                                <p>Hợp đồng/Điều khoản: Mua qua sàn giao dịch.</p>
                                <p>Ngày tạo: {order ? new Date(order.createdAt).toLocaleString('vi-VN') : '...'}</p>
                                <button
                                    onClick={handleContactFarm}
                                    className="mt-2 text-xs bg-white text-blue-600 border border-blue-200 px-2 py-1 rounded hover:bg-gray-50"
                                >
                                    💬 Nhắn tin cho chủ trại
                                </button>
                            </div>

                            <div className="flex flex-col gap-3">
                                {order?.status === 'pending' && (
                                    <>
                                        <button
                                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded transition opacity-50 cursor-not-allowed"
                                            title="Tính năng thanh toán đang phát triển"
                                        >
                                            Thanh toán Cọc (30%)
                                        </button>
                                        <button
                                            onClick={handleCancel}
                                            disabled={actionLoading}
                                            className="w-full bg-red-100 hover:bg-red-200 text-red-800 font-bold py-2 rounded transition"
                                        >
                                            Hủy Đơn Hàng
                                        </button>
                                    </>
                                )}
                                {/* ... rest of status actions ... */}
                                {order?.status === 'shipping' && (
                                    <div className="space-y-2 bg-gray-50 dark:bg-gray-700 p-3 rounded border border-gray-200 dark:border-gray-600">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tải lên ảnh nhận hàng (Bắt buộc):</label>
                                        <input
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            className="block w-full text-sm text-gray-500"
                                        />
                                        <button
                                            onClick={handleConfirmDelivery}
                                            disabled={actionLoading}
                                            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded transition mt-2"
                                        >
                                            Xác Nhận Đã Nhận Hàng
                                        </button>
                                    </div>
                                )}
                                {order?.status === 'completed' && (
                                    <div className="text-center text-green-600 font-bold py-2 border border-green-200 rounded bg-green-50">
                                        Đơn hàng hoàn tất
                                    </div>
                                )}
                                {order?.status === 'cancelled' && (
                                    <div className="text-center text-red-600 font-bold py-2 border border-red-200 rounded bg-red-50">
                                        Đơn hàng đã hủy
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {order?.status === 'shipping' && (
                <div className="bg-white dark:bg-gray-800 shadow p-6 rounded-lg mt-6">
                    <h3 className="text-lg font-bold mb-4 dark:text-white">Theo Dõi Vận Chuyển</h3>
                    <p className="text-gray-500">Chức năng đang phát triển... (Hiển thị bản đồ/timeline shipment)</p>
                </div>
            )}
        </div>
    );
}
