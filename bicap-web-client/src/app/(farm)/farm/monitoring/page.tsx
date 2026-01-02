'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import { auth } from '@/lib/firebase';

interface EnvData {
    temperature: number;
    humidity: number;
    ph: number;
    timestamp: string;
}

interface Farm {
    id: number;
    name: string;
}

export default function FarmMonitoringPage() {
    const { user } = useAuth();
    const [currentData, setCurrentData] = useState<EnvData | null>(null);
    const [history, setHistory] = useState<EnvData[]>([]);
    const [loading, setLoading] = useState(true);

    // Farm Selection
    const [farms, setFarms] = useState<Farm[]>([]);
    const [selectedFarmId, setSelectedFarmId] = useState<number | null>(null);

    // 1. Fetch Farms first
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
                    setLoading(false); // No farms
                }
            } catch (error) {
                console.error("Error fetching farms:", error);
                setLoading(false);
            }
        };
        fetchFarms();
    }, [user]);

    // 2. Fetch Data when farm selected
    useEffect(() => {
        if (!selectedFarmId) return;

        const fetchData = async () => {
            try {
                const token = await auth.currentUser?.getIdToken();
                const resCurrent = await axios.get(`http://localhost:5001/api/monitoring/current/${selectedFarmId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setCurrentData(resCurrent.data.data);

                const resHistory = await axios.get(`http://localhost:5001/api/monitoring/history/${selectedFarmId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setHistory(resHistory.data.history);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 5000); // 5s refresh

        return () => clearInterval(interval);
    }, [selectedFarmId]);

    if (loading && farms.length === 0) return <div className="p-8">Đang tải dữ liệu...</div>;

    const getStatusColor = (val: number, type: 'temp' | 'hum' | 'ph') => {
        if (type === 'temp') return val > 35 ? 'text-red-600' : 'text-green-600';
        if (type === 'hum') return val < 50 ? 'text-yellow-600' : 'text-blue-600';
        return 'text-purple-600';
    };

    return (
        <div className="max-w-6xl mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Giám Sát Môi Trường (Real-time)</h1>
            </div>

            {/* Farm Selector */}
            {farms.length > 0 ? (
                <div className="mb-6">
                    <label className="mr-2 font-semibold">Chọn trang trại:</label>
                    <select
                        className="border p-2 rounded bg-white dark:bg-gray-700 dark:text-white"
                        value={selectedFarmId || ''}
                        onChange={(e) => setSelectedFarmId(Number(e.target.value))}
                    >
                        {farms.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                    </select>
                </div>
            ) : (
                <div className="p-4 bg-yellow-50 text-yellow-800 rounded mb-6">
                    Bạn chưa có trang trại nào. Vui lòng tạo trang trại trước.
                </div>
            )}

            {selectedFarmId && (
                <>
                    {/* Current Status Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        {/* Temperature */}
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border-l-4 border-red-500">
                            <h3 className="text-gray-500 font-medium">Nhiệt Độ</h3>
                            <div className={`text-4xl font-bold mt-2 ${getStatusColor(currentData?.temperature || 0, 'temp')}`}>
                                {currentData?.temperature}°C
                            </div>
                            <p className="text-sm text-gray-400 mt-1">Cập nhật: {new Date().toLocaleTimeString()}</p>
                        </div>

                        {/* Humidity */}
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border-l-4 border-blue-500">
                            <h3 className="text-gray-500 font-medium">Độ Ẩm</h3>
                            <div className={`text-4xl font-bold mt-2 ${getStatusColor(currentData?.humidity || 0, 'hum')}`}>
                                {currentData?.humidity}%
                            </div>
                            <p className="text-sm text-gray-400 mt-1">Trạng thái: Ổn định</p>
                        </div>

                        {/* pH */}
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border-l-4 border-purple-500">
                            <h3 className="text-gray-500 font-medium">Độ pH Đất</h3>
                            <div className={`text-4xl font-bold mt-2 ${getStatusColor(currentData?.ph || 0, 'ph')}`}>
                                {currentData?.ph}
                            </div>
                            <p className="text-sm text-gray-400 mt-1">Mức độ: Trung tính</p>
                        </div>
                    </div>

                    {/* History Chart (Mock Visual) */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                        <h2 className="text-xl font-bold mb-4">Biểu Đồ Theo Dõi (24h)</h2>
                        <div className="h-64 flex items-end space-x-2 border-b border-l border-gray-300 p-2 overflow-x-auto">
                            {/* Draw simple bars for Temperature just for demo visual */}
                            {history.length > 0 ? history.map((point, index) => (
                                <div key={index}
                                    className="bg-red-400 hover:bg-red-500 w-full min-w-[10px] rounded-t transition-all"
                                    style={{ height: `${(point.temperature / 50) * 100}%` }}
                                    title={`${new Date(point.timestamp).getHours()}h: ${point.temperature}°C`}
                                ></div>
                            )) : <p className="text-gray-400 m-auto">Chưa có dữ liệu lịch sử</p>}
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 mt-2">
                            <span>24 giờ trước</span>
                            <span>Hiện tại</span>
                        </div>
                        <p className="text-center text-sm text-gray-500 mt-2 font-italic">* Biểu đồ nhiệt độ mô phỏng</p>
                    </div>
                </>
            )}
        </div>
    );
}
