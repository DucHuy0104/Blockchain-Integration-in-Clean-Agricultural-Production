'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import { auth } from '@/lib/firebase';
import Link from 'next/link';

interface Shipment {
    id: number;
    orderId: number;
    vehicleInfo: string;
    pickupTime: string;
    deliveryTime: string | null;
    status: string;
    order?: {
        id: number;
        product?: {
            name: string;
        };
    };
    driver?: {
        fullName: string;
        phone: string;
    };
}

interface Farm {
    id: number;
    name: string;
}

export default function ShippingReportPage() {
    const { user } = useAuth();
    const [farms, setFarms] = useState<Farm[]>([]);
    const [selectedFarmId, setSelectedFarmId] = useState<number | null>(null);
    const [shipments, setShipments] = useState<Shipment[]>([]);
    const [loading, setLoading] = useState(true);

    // 1. Fetch Farms
    useEffect(() => {
        if (!user) return;
        const fetchFarms = async () => {
            try {
                const token = await auth.currentUser?.getIdToken();
                const res = await axios.get('http://localhost:5001/api/farms/my-farms', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.data.farms?.length > 0) {
                    setFarms(res.data.farms);
                    setSelectedFarmId(res.data.farms[0].id);
                } else {
                    setLoading(false);
                }
            } catch (error) {
                console.error("Error fetching farms:", error);
                setLoading(false);
            }
        };
        fetchFarms();
    }, [user]);

    // 2. Fetch Shipments
    useEffect(() => {
        if (!selectedFarmId) return;

        const fetchShipments = async () => {
            setLoading(true);
            try {
                const token = await auth.currentUser?.getIdToken();
                const res = await axios.get(`http://localhost:5001/api/shipments/farm/${selectedFarmId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setShipments(res.data.shipments || []);
            } catch (error) {
                console.error("Error fetching shipments:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchShipments();
    }, [selectedFarmId]);

    const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);

    // ... (existing effects)

    const getStatusBadge = (status: string) => {
        const styles: Record<string, string> = {
            created: 'bg-gray-100 text-gray-800',
            assigned: 'bg-blue-100 text-blue-800',
            picked_up: 'bg-yellow-100 text-yellow-800',
            delivering: 'bg-indigo-100 text-indigo-800',
            delivered: 'bg-green-100 text-green-800',
            failed: 'bg-red-100 text-red-800'
        };
        const labels: Record<string, string> = {
            created: 'Mới tạo',
            assigned: 'Đã gán xe',
            picked_up: 'Đã lấy hàng',
            delivering: 'Đang giao',
            delivered: 'Đã giao',
            failed: 'Thất bại'
        };
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${styles[status] || 'bg-gray-100'}`}>
                {labels[status] || status}
            </span>
        );
    };

    return (
        <div className="max-w-7xl mx-auto p-4 sm:p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Báo Cáo Vận Chuyển</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Theo dõi lịch sử giao nhận hàng hóa của trang trại</p>
                </div>

                {/* Farm Selector */}
                {farms.length > 0 && (
                    <div className="relative">
                        <select
                            className="appearance-none bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 py-2 pl-4 pr-10 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 font-medium cursor-pointer"
                            value={selectedFarmId || ''}
                            onChange={(e) => setSelectedFarmId(Number(e.target.value))}
                        >
                            {farms.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                        </div>
                    </div>
                )}
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 uppercase tracking-wider font-medium border-b border-gray-200 dark:border-gray-700">
                            <tr>
                                <th className="px-6 py-4">Mã Vận Đơn</th>
                                <th className="px-6 py-4">Đơn Hàng</th>
                                <th className="px-6 py-4">Tài Xế / Xe</th>
                                <th className="px-6 py-4">Thời Gian</th>
                                <th className="px-6 py-4">Trạng Thái</th>
                                <th className="px-6 py-4 text-right">Chi Tiết</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">Đang tải dữ liệu...</td>
                                </tr>
                            ) : shipments.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                        <div className="flex flex-col items-center">
                                            <svg className="w-10 h-10 text-gray-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 10-4 0 2 2 0 004 0zm10 0a2 2 0 10-4 0 2 2 0 004 0z" /></svg>
                                            Chưa có vận đơn nào được tạo.
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                shipments.map((shipment) => (
                                    <tr key={shipment.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                                            #{shipment.id}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-gray-900 dark:text-white font-medium">#{shipment.orderId}</div>
                                            <div className="text-gray-500 text-xs">{shipment.order?.product?.name || 'Sản phẩm'}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {shipment.driver ? (
                                                <>
                                                    <div className="font-medium text-gray-900 dark:text-white">{shipment.driver.fullName}</div>
                                                    <div className="text-gray-500 text-xs">{shipment.vehicleInfo}</div>
                                                </>
                                            ) : (
                                                <span className="text-gray-400 italic">Chưa gán tài xế</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 space-y-1">
                                            <div className="flex items-center gap-1 text-xs text-gray-500">
                                                <span className="w-12">Lấy hàng:</span>
                                                <span className="text-gray-700 dark:text-gray-300">{new Date(shipment.pickupTime).toLocaleString('vi-VN')}</span>
                                            </div>
                                            {shipment.deliveryTime && (
                                                <div className="flex items-center gap-1 text-xs text-gray-500">
                                                    <span className="w-12">Giao:</span>
                                                    <span className="text-green-600 font-medium">{new Date(shipment.deliveryTime).toLocaleString('vi-VN')}</span>
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            {getStatusBadge(shipment.status)}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => setSelectedShipment(shipment)}
                                                className="text-gray-400 hover:text-green-600 transition-colors p-2 rounded-full hover:bg-green-50 dark:hover:bg-green-900/20"
                                                title="Xem chi tiết"
                                            >
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Detail Modal */}
            {selectedShipment && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-lg w-full overflow-hidden transform transition-all animate-[scaleIn_0.2s_ease-out]">
                        <div className="bg-green-600 text-white p-4 flex justify-between items-center">
                            <h3 className="text-lg font-bold">Chi Tiết Vận Đơn #{selectedShipment.id}</h3>
                            <button onClick={() => setSelectedShipment(null)} className="text-white/80 hover:text-white">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        <div className="p-6 space-y-6">

                            {/* Order Info */}
                            <div>
                                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Thông Tin Đơn Hàng</h4>
                                <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg">
                                    <div className="flex justify-between mb-1">
                                        <span className="text-gray-600 dark:text-gray-400">Mã đơn hàng:</span>
                                        <span className="font-semibold">#{selectedShipment.orderId}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600 dark:text-gray-400">Sản phẩm:</span>
                                        <span className="font-medium text-green-600">{selectedShipment.order?.product?.name || '---'}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Driver Status */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Tài Xế</h4>
                                    <div className="font-medium text-gray-900 dark:text-white text-lg">
                                        {selectedShipment.driver?.fullName || <span className="text-gray-400 italic">Chưa gán</span>}
                                    </div>
                                    <div className="text-sm text-gray-500">{selectedShipment.driver?.phone}</div>
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Phương Tiện</h4>
                                    <div className="font-medium text-gray-900 dark:text-white">
                                        {selectedShipment.vehicleInfo || '---'}
                                    </div>
                                </div>
                            </div>

                            {/* Timeline */}
                            <div>
                                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Tiến Độ Vận Chuyển</h4>
                                <div className="space-y-4 relative pl-4 border-l-2 border-gray-200 dark:border-gray-700 ml-2">
                                    {/* Pickup Node */}
                                    <div className="relative">
                                        <span className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-blue-500 ring-4 ring-white dark:ring-gray-800"></span>
                                        <div>
                                            <p className="text-sm font-semibold text-gray-900 dark:text-white">Lấy Hàng</p>
                                            <p className="text-xs text-gray-500">{new Date(selectedShipment.pickupTime).toLocaleString('vi-VN')}</p>
                                        </div>
                                    </div>

                                    {/* Delivery Node */}
                                    <div className="relative">
                                        <span className={`absolute -left-[21px] top-1 w-3 h-3 rounded-full ring-4 ring-white dark:ring-gray-800 ${selectedShipment.deliveryTime ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                                        <div>
                                            <p className={`text-sm font-semibold ${selectedShipment.deliveryTime ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}>
                                                {selectedShipment.status === 'delivered' ? 'Đã Giao Hàng' : 'Dự Kiến Giao'}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {selectedShipment.deliveryTime
                                                    ? new Date(selectedShipment.deliveryTime).toLocaleString('vi-VN')
                                                    : <span className="italic">Chưa hoàn tất</span>
                                                }
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Status Footer */}
                            <div className="pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
                                <span className="text-sm text-gray-500">Trạng thái hiện tại:</span>
                                <div className="scale-110">{getStatusBadge(selectedShipment.status)}</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
