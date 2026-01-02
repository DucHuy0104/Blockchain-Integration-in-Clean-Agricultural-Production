'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import { auth } from '@/lib/firebase';
// Note: Ideally use a chart lib like 'chart.js' or 'recharts'. 
// For simplicity and speed without install new deps, I will use simple CSS bars/cards.

interface EnvData {
    temperature: number;
    humidity: number;
    ph: number;
    timestamp: string;
}

export default function FarmMonitoringPage() {
    const { user } = useAuth();
    const [currentData, setCurrentData] = useState<EnvData | null>(null);
    const [history, setHistory] = useState<EnvData[]>([]);
    const [loading, setLoading] = useState(true);

    // Auto refresh every 5 seconds
    useEffect(() => {
        if (!user) return;
        
        const fetchData = async () => {
            try {
                const token = await auth.currentUser?.getIdToken();
                // Using hardcoded farmId 6 for demo, in real app select farm first
                // Or fetch user's first farm
                // For now, let's just fetch for farm '6' or any ID since backend mocks it anyway
                const resCurrent = await axios.get('http://localhost:5001/api/monitoring/current/6', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setCurrentData(resCurrent.data.data);

                const resHistory = await axios.get('http://localhost:5001/api/monitoring/history/6', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setHistory(resHistory.data.history);
                setLoading(false);
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 5000); // 5s refresh

        return () => clearInterval(interval);
    }, [user]);

    if (loading) return <div className="p-8">Loading Environment Data...</div>;

    const getStatusColor = (val: number, type: 'temp' | 'hum' | 'ph') => {
        if (type === 'temp') return val > 35 ? 'text-red-600' : 'text-green-600';
        if (type === 'hum') return val < 50 ? 'text-yellow-600' : 'text-blue-600';
        return 'text-purple-600';
    };

    return (
        <div className="max-w-6xl mx-auto p-4">
             <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Giám Sát Môi Trường (Real-time)</h1>

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
                 <div className="h-64 flex items-end space-x-2 border-b border-l border-gray-300 p-2">
                     {/* Draw simple bars for Temperature just for demo visual */}
                     {history.map((point, index) => (
                         <div key={index} 
                            className="bg-red-400 hover:bg-red-500 w-full rounded-t"
                            style={{ height: `${(point.temperature / 50) * 100}%` }}
                            title={`${new Date(point.timestamp).getHours()}h: ${point.temperature}°C`}
                         ></div>
                     ))}
                 </div>
                 <div className="flex justify-between text-xs text-gray-500 mt-2">
                     <span>24 giờ trước</span>
                     <span>Hiện tại</span>
                 </div>
                 <p className="text-center text-sm text-gray-500 mt-2 font-italic">* Biểu đồ nhiệt độ mô phỏng</p>
             </div>
        </div>
    );
}
