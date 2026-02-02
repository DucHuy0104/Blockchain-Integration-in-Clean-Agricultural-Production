"use client";
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';

export default function ProductManagementPage() {
    const { getAccessToken } = useAuth();
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<any>(null);
    const [editForm, setEditForm] = useState({
        name: "",
        category: "",
        description: "",
        price: 0,
        quantity: 0,
        status: ""
    });

    const statusMap: { [key: string]: { label: string, color: string } } = {
        'cultivating': { label: 'Đang trồng', color: 'bg-blue-100 text-blue-600' },
        'harvested': { label: 'Đã thu hoạch', color: 'bg-orange-100 text-orange-600' },
        'processing': { label: 'Đang sơ chế', color: 'bg-purple-100 text-purple-600' },
        'distributed': { label: 'Đã phân phối', color: 'bg-indigo-100 text-indigo-600' },
        'available': { label: 'Đang bán', color: 'bg-green-100 text-green-600' },
        'hidden': { label: 'Đã ẩn', color: 'bg-gray-100 text-gray-600' },
        'rejected': { label: 'Bị từ chối', color: 'bg-red-100 text-red-600' }
    };

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const token = await getAccessToken();
            const res = await axios.get(`http://localhost:5001/api/admin/products?search=${searchTerm}&status=${statusFilter}`, {
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
    }, [statusFilter]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchProducts();
    };

    const handleUpdateProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = await getAccessToken();
            await axios.put(`http://localhost:5001/api/admin/products/${selectedProduct.id}`, editForm, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("Cập nhật sản phẩm thành công!");
            setShowEditModal(false);
            fetchProducts();
        } catch (err) {
            alert("Lỗi khi cập nhật!");
        }
    };

    const openEditModal = (product: any) => {
        setSelectedProduct(product);
        setEditForm({
            name: product.name,
            category: product.category || "",
            description: product.description || "",
            price: product.price,
            quantity: product.quantity,
            status: product.status
        });
        setShowEditModal(true);
    };



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
        <div className="space-y-6">
            <h1 className="text-3xl font-black text-gray-800 dark:text-white mb-8">Quản Lý Sản Phẩm</h1>

            {/* Filters & Search Bar */}
            <div className="flex flex-row items-center justify-between gap-6 bg-white dark:bg-gray-800 p-6 rounded-[1.5rem] shadow-sm border border-gray-100 dark:border-gray-700 overflow-x-auto scrollbar-hide">
                <div className="flex flex-row flex-nowrap gap-2 min-w-max">
                    {[
                        { id: "", label: "Tất cả" },
                        { id: "available", label: "Đang bán" },
                        { id: "harvested", label: "Đã thu hoạch" },
                        { id: "hidden", label: "Đã ẩn" },
                        { id: "rejected", label: "Từ chối" }
                    ].map((s) => (
                        <button
                            key={s.id}
                            onClick={() => setStatusFilter(s.id)}
                            className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap
                                ${statusFilter === s.id
                                    ? 'bg-green-600 text-white shadow-lg'
                                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                        >
                            {s.label}
                        </button>
                    ))}
                </div>

                <form onSubmit={handleSearch} className="relative min-w-[300px] flex-shrink-0">
                    <input
                        type="text"
                        placeholder="Tìm kiếm sản phẩm..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-4 pr-12 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                    />
                    <button type="submit" className="absolute right-3 top-2.5 text-gray-400 hover:text-blue-600">
                        🔍
                    </button>
                </form>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-[1.5rem] shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700">
                                <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400 tracking-widest">Sản Phẩm</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400 tracking-widest">Trang Trại</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400 tracking-widest">Giá / Số lượng</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400 tracking-widest text-center">Trạng Thái</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400 tracking-widest text-right whitespace-nowrap">Thao Tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-20 text-center animate-pulse text-gray-400 font-bold">Đang tải danh sách sản phẩm...</td>
                                </tr>
                            ) : products.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-20 text-center text-gray-400 font-bold">Không có sản phẩm nào phù hợp.</td>
                                </tr>
                            ) : products.map((p) => (
                                <tr key={p.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-900/30 transition-colors group">
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-orange-50 dark:bg-orange-900/20 rounded-xl flex items-center justify-center text-xl shadow-inner group-hover:scale-110 transition-transform">
                                                📦
                                            </div>
                                            <div>
                                                <div className="font-bold text-gray-800 dark:text-gray-100">{p.name}</div>
                                                <div className="text-[10px] text-gray-400 flex items-center gap-1 mt-0.5 uppercase">
                                                    Mã: {p.batchCode}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="text-sm font-bold text-green-600">{p.farm?.name}</div>
                                        <div className="text-[10px] text-gray-400">{p.category || 'N/A'}</div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="text-sm font-black text-gray-800 dark:text-gray-200">{p.price?.toLocaleString()}đ</div>
                                        <div className="text-[10px] text-gray-400">{p.quantity} kg</div>
                                    </td>
                                    <td className="px-6 py-5 text-center whitespace-nowrap">
                                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${statusMap[p.status]?.color || 'bg-gray-100 text-gray-600'}`}>
                                            {statusMap[p.status]?.label || p.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <div className="flex justify-end gap-2 whitespace-nowrap">
                                            <button
                                                onClick={() => openEditModal(p)}
                                                className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all shadow-sm text-[10px] font-bold whitespace-nowrap"
                                            >
                                                Chỉnh sửa
                                            </button>
                                            <button
                                                onClick={() => handleUpdateStatus(p.id, p.status === 'available' ? 'hidden' : 'available')}
                                                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all shadow-sm whitespace-nowrap ${p.status === 'available'
                                                    ? 'bg-orange-50 text-orange-600 hover:bg-orange-600 hover:text-white'
                                                    : 'bg-green-50 text-green-600 hover:bg-green-600 hover:text-white'}`}
                                            >
                                                {p.status === 'available' ? 'Ẩn sản phẩm' : 'Hiện sản phẩm'}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {showEditModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowEditModal(false)}></div>
                    <div className="relative bg-white dark:bg-gray-800 w-full max-w-lg rounded-[2rem] shadow-2xl p-8 animate-in fade-in zoom-in duration-300">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h2 className="text-2xl font-black text-gray-800 dark:text-white">Chỉnh Sửa Sản Phẩm</h2>
                                <p className="text-sm text-gray-400 mt-1">Sản phẩm: <strong>{selectedProduct?.name}</strong></p>
                            </div>
                            <button onClick={() => setShowEditModal(false)} className="text-2xl text-gray-300 hover:text-gray-500 transition-colors">✕</button>
                        </div>
                        <form onSubmit={handleUpdateProduct} className="space-y-4">
                            <div>
                                <label className="block text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2">Tên sản phẩm</label>
                                <input
                                    required
                                    type="text"
                                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 dark:bg-gray-900 outline-none focus:ring-2 focus:ring-blue-500 text-sm font-bold transition-all"
                                    value={editForm.name}
                                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2">Danh mục</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 dark:bg-gray-900 outline-none focus:ring-2 focus:ring-blue-500 text-sm font-bold transition-all"
                                        value={editForm.category}
                                        onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                                        placeholder="VD: Rau củ..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2">Trạng thái</label>
                                    <select
                                        className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 dark:bg-gray-900 outline-none focus:ring-2 focus:ring-blue-500 text-sm font-bold transition-all"
                                        value={editForm.status}
                                        onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                                    >
                                        {Object.keys(statusMap).map(key => (
                                            <option key={key} value={key}>{statusMap[key].label}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2">Giá (VNĐ)</label>
                                    <input
                                        required
                                        type="number"
                                        className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 dark:bg-gray-900 outline-none focus:ring-2 focus:ring-blue-500 text-sm font-bold transition-all"
                                        value={editForm.price}
                                        onChange={(e) => setEditForm({ ...editForm, price: parseInt(e.target.value) })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2">Số lượng (kg)</label>
                                    <input
                                        required
                                        type="number"
                                        className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 dark:bg-gray-900 outline-none focus:ring-2 focus:ring-blue-500 text-sm font-bold transition-all"
                                        value={editForm.quantity}
                                        onChange={(e) => setEditForm({ ...editForm, quantity: parseInt(e.target.value) })}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2">Mô tả sản phẩm</label>
                                <textarea
                                    className="w-full px-4 py-3 h-32 rounded-2xl border border-gray-200 dark:border-gray-700 dark:bg-gray-900 outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-all"
                                    value={editForm.description}
                                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-sm tracking-widest shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition-all mt-4"
                            >
                                CẬP NHẬT SẢN PHẨM
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
