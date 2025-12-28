"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../../context/AuthContext";

interface Farm {
    id: number;
    name: string;
    address: string;
    certification: string;
}

export default function FarmDashboard() {
    const { getToken } = useAuth();
    const [farms, setFarms] = useState<Farm[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFarms = async () => {
            const token = await getToken();
            if (!token) return;

            try {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/farms/my-farms`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setFarms(res.data.farms || []);
            } catch (err) {
                console.error("Failed to fetch farms", err);
            } finally {
                setLoading(false);
            }
        };
        fetchFarms();
    }, [getToken]);

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Quản Lý Nông Trại</h1>
                <a href="/dashboard/farm/create" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                    + Thêm Trại Mới
                </a>
            </div>

            {loading ? <p>Đang tải...</p> : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {farms.length === 0 && <p className="text-gray-500">Bạn chưa có nông trại nào.</p>}

                    {farms.map((farm) => (
                        <div key={farm.id} className="bg-white p-6 rounded shadow border-l-4 border-l-green-500">
                            <h3 className="text-xl font-bold mb-2 text-gray-900">{farm.name}</h3>
                            <p className="text-gray-600 mb-1">📍 {farm.address}</p>
                            <p className="text-blue-600 text-sm">🏅 {farm.certification || 'Chưa có chứng nhận'}</p>

                            <div className="mt-4 flex space-x-2">
                                <button className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded">Chi tiết</button>
                                <button className="text-sm bg-green-50 hover:bg-green-100 text-green-700 px-3 py-1 rounded">Xem Mùa Vụ</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
