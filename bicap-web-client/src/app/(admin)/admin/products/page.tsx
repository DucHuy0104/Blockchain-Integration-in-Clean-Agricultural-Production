"use client";
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';

export default function ProductManagementPage() {
    const { getAccessToken } = useAuth();
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const token = await getAccessToken();
            const res = await axios.get(`http://localhost:5001/api/admin/products?search=${searchTerm}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProducts(res.data.products);
        } catch (err) {
            console.error("Lỗi tải sản phẩm:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [searchTerm]);

    const handleUpdateStatus = async (id: number, status: string) => {
        try {
            const token = await getAccessToken();
            await axios.put(`http://localhost:5001/api/admin/products/${id}/status`, { status }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("Đã cập nhật trạng thái sản phẩm!");
            fetchProducts();
        } catch (err) {
            alert("Lỗi khi cập nhật!");
        }
    };

    return (
        <div className="space-y-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="relative w-96">
                    <input
                        type="text"
                        placeholder="Tìm sản phẩm..."
                        className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700">
                        <tr>
                            <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-gray-500">Sản phẩm</th>
                            <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-gray-500">Trang trại</th>
                            <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-gray-500">Giá / Số lượng</th>
                            <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-gray-500">Trạng thái</th>
                            <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-gray-500">Hành động</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                        {loading ? (
                            <tr><td colSpan={5} className="p-20 text-center text-gray-400 font-bold animate-pulse">Đang tải dữ liệu...</td></tr>
                        ) : products.length === 0 ? (
                            <tr><td colSpan={5} className="p-20 text-center text-gray-400">Không tìm thấy sản phẩm nào.</td></tr>
                        ) : products.map((p) => (
                            <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/40 transition-colors">
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center text-2xl">
                                            📦
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-800 dark:text-gray-200">{p.name}</p>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Mã: {p.batchCode}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <p className="text-sm font-bold text-green-600">{p.farm?.name}</p>
                                </td>
                                <td className="px-8 py-6">
                                    <p className="text-sm font-black text-gray-800 dark:text-gray-200">{p.price?.toLocaleString()}đ</p>
                                    <p className="text-xs text-gray-400">{p.quantity} kg còn lại</p>
                                </td>
                                <td className="px-8 py-6">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${p.status === 'available' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                                        }`}>
                                        {p.status}
                                    </span>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleUpdateStatus(p.id, p.status === 'available' ? 'hidden' : 'available')}
                                            className={`p-2 rounded-xl transition-all ${p.status === 'available' ? 'bg-orange-50 text-orange-500 hover:bg-orange-500 hover:text-white' : 'bg-green-50 text-green-500 hover:bg-green-500 hover:text-white'
                                                }`}
                                            title={p.status === 'available' ? 'Ẩn sản phẩm' : 'Hiển thị sản phẩm'}
                                        >
                                            {p.status === 'available' ? '👁️‍🗨️' : '👁️'}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
