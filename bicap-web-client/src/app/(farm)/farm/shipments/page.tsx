'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import { auth } from '@/lib/firebase';

interface Shipment {
    id: number;
    status: string;
    vehicleInfo: string;
    pickupTime: string;
    deliveryTime: string;
    order: {
        id: number;
        product: {
            name: string;
        };
    };
    driver: {
        fullName: string;
        phone: string;
    } | null;
    manager: {
        fullName: string;
    };
}

interface Farm {
    id: number;
    name: string;
}

export default function FarmShipmentManager() {
    const { user } = useAuth();
    const [shipments, setShipments] = useState<Shipment[]>([]);
    const [farms, setFarms] = useState<Farm[]>([]);
    const [selectedFarmId, setSelectedFarmId] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) fetchFarms();
    }, [user]);

    useEffect(() => {
        if (selectedFarmId) fetchShipments(selectedFarmId);
    }, [selectedFarmId]);

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
            console.error(error);
            setLoading(false);
        }
    };

    const fetchShipments = async (farmId: number) => {
        setLoading(true);
        try {
            const token = await auth.currentUser?.getIdToken();
            const res = await axios.get(`http://localhost:5001/api/shipments/farm/${farmId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setShipments(res.data.shipments);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Quản Lý Vận Chuyển</h1>

            {farms.length > 1 && (
                <div className="mb-4">
                    <label className="mr-2 font-semibold">Chọn trang trại:</label>
                    <select
                        className="border p-2 rounded"
                        value={selectedFarmId || ''}
                        onChange={(e) => setSelectedFarmId(Number(e.target.value))}
                    >
                        {farms.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                    </select>
                </div>
            )}

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-900">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã Vận Đơn</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Đơn Hàng</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tài Xế</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Xe Vận Chuyển</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng Thái</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thời Gian</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {shipments.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">Chưa có vận đơn nào.</td>
                            </tr>
                        ) : (
                            shipments.map(shipment => (
                                <tr key={shipment.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-blue-600">#{shipment.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                        Đơn #{shipment.order.id} - {shipment.order.product.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {shipment.driver ? (
                                            <>
                                                <div className="text-sm font-medium text-gray-900 dark:text-white">{shipment.driver.fullName}</div>
                                                <div className="text-sm text-gray-500">{shipment.driver.phone}</div>
                                            </>
                                        ) : (
                                            <span className="text-sm text-gray-400 italic">Chưa gán</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{shipment.vehicleInfo || 'N/A'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                            ${shipment.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                                shipment.status === 'delivering' ? 'bg-blue-100 text-blue-800' :
                                                    'bg-yellow-100 text-yellow-800'}`}>
                                            {shipment.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {shipment.pickupTime && <div>Lấy: {new Date(shipment.pickupTime).toLocaleDateString()}</div>}
                                        {shipment.deliveryTime && <div>Giao: {new Date(shipment.deliveryTime).toLocaleDateString()}</div>}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
