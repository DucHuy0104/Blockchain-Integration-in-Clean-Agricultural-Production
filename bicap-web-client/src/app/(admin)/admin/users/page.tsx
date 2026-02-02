"use client";
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';

export default function UserManagementPage() {
    const { getAccessToken } = useAuth();
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState("");

    // Modal State
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
        role: "admin",
        phone: "",
        address: ""
    });

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const token = await getAccessToken();
            const res = await axios.get(`http://localhost:5001/api/admin/users?search=${searchTerm}&role=${roleFilter}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(res.data.users);
        } catch (err) {
            console.error("Lỗi tải người dùng:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [roleFilter]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchUsers();
    };

    const handleUpdateUser = async (id: number, data: any) => {
        try {
            const token = await getAccessToken();
            await axios.put(`http://localhost:5001/api/admin/users/${id}`, data, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("Cập nhật thành công!");
            fetchUsers();
        } catch (err) {
            alert("Lỗi khi cập nhật!");
        }
    };

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = await getAccessToken();
            await axios.post(`http://localhost:5001/api/admin/users`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("Tạo người dùng thành công!");
            setShowCreateModal(false);
            setFormData({ fullName: "", email: "", password: "", role: "admin", phone: "", address: "" });
            fetchUsers();
        } catch (err: any) {
            alert("Lỗi khi tạo: " + (err.response?.data?.message || err.message));
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-black text-gray-800 dark:text-white">Quản Lý Người Dùng</h1>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-black text-sm tracking-widest shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition-all flex items-center gap-2"
                >
                    <span>➕</span> THÊM ADMIN MỚI
                </button>
            </div>

            {/* Filters & Search Bar */}
            <div className="flex flex-row items-center justify-between gap-6 bg-white dark:bg-gray-800 p-6 rounded-[1.5rem] shadow-sm border border-gray-100 dark:border-gray-700 overflow-x-auto scrollbar-hide">
                <div className="flex flex-row flex-nowrap gap-2 min-w-max">
                    {[
                        { id: "", label: "Tất cả" },
                        { id: "admin", label: "Admin" },
                        { id: "farm", label: "Farm" },
                        { id: "shipping", label: "Vận chuyển" },
                        { id: "retailer", label: "Đại lý" }
                    ].map((s) => (
                        <button
                            key={s.id}
                            onClick={() => setRoleFilter(s.id)}
                            className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap
                                ${roleFilter === s.id
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                        >
                            {s.label}
                        </button>
                    ))}
                </div>

                <form onSubmit={handleSearch} className="relative min-w-[300px] flex-shrink-0">
                    <input
                        type="text"
                        placeholder="Tìm người dùng (Tên, Email, SĐT)..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-4 pr-12 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                    />
                    <button type="submit" className="absolute right-3 top-2.5 text-gray-400 hover:text-blue-600">
                        🔍
                    </button>
                </form>
            </div>

            {/* User List */}
            <div className="bg-white dark:bg-gray-800 rounded-[1.5rem] shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700">
                                <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400 tracking-widest">Người dùng</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400 tracking-widest">Email / SĐT</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400 tracking-widest">Vai trò</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400 tracking-widest text-center">Trạng Thái</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400 tracking-widest text-right whitespace-nowrap">Thao Tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-20 text-center animate-pulse text-gray-400 font-bold">Đang tải danh sách người dùng...</td>
                                </tr>
                            ) : users.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-20 text-center text-gray-400 font-bold">Không có người dùng nào phù hợp.</td>
                                </tr>
                            ) : users.map((u) => (
                                <tr key={u.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-900/30 transition-colors group">
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center text-xl shadow-inner group-hover:scale-110 transition-transform font-bold text-blue-600">
                                                {u.fullName[0]}
                                            </div>
                                            <div>
                                                <div className="font-bold text-gray-800 dark:text-gray-100">{u.fullName}</div>
                                                <div className="text-[10px] text-gray-400 flex items-center gap-1 mt-0.5 uppercase">
                                                    ID: #{u.id}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="text-sm font-bold text-gray-700 dark:text-gray-200">{u.email}</div>
                                        <div className="text-[10px] text-gray-400">{u.phone || 'N/A'}</div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <select
                                            className="bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                            value={u.role}
                                            onChange={(e) => handleUpdateUser(u.id, { role: e.target.value })}
                                        >
                                            <option value="admin">Admin</option>
                                            <option value="farm">Farm</option>
                                            <option value="shipping">Shipping</option>
                                            <option value="driver">Driver</option>
                                            <option value="retailer">Retailer</option>
                                            <option value="guest">Guest</option>
                                        </select>
                                    </td>
                                    <td className="px-6 py-5 text-center whitespace-nowrap">
                                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${u.status === 'active' ? 'bg-green-100 text-green-600' :
                                            u.status === 'blocked' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'
                                            }`}>
                                            {u.status === 'active' ? 'Hoạt động' : u.status === 'blocked' ? 'Đã khóa' : 'Chờ duyệt'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <div className="flex justify-end gap-2 whitespace-nowrap">
                                            <button
                                                onClick={() => handleUpdateUser(u.id, { status: u.status === 'active' ? 'blocked' : 'active' })}
                                                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all shadow-sm whitespace-nowrap ${u.status === 'active'
                                                    ? 'bg-red-50 text-red-600 hover:bg-red-600 hover:text-white'
                                                    : 'bg-green-50 text-green-600 hover:bg-green-600 hover:text-white'}`}
                                            >
                                                {u.status === 'active' ? 'Khóa' : 'Kích hoạt'}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create User Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowCreateModal(false)}></div>
                    <div className="relative bg-white dark:bg-gray-800 w-full max-w-md rounded-[2rem] shadow-2xl p-8 animate-in fade-in zoom-in duration-300">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h2 className="text-2xl font-black text-gray-800 dark:text-white">Thêm Admin Mới</h2>
                                <p className="text-sm text-gray-400 mt-1">Tạo tài khoản quản trị viên mới</p>
                            </div>
                            <button onClick={() => setShowCreateModal(false)} className="text-2xl text-gray-300 hover:text-gray-500 transition-colors">✕</button>
                        </div>
                        <form onSubmit={handleCreateUser} className="space-y-4">
                            <div>
                                <label className="block text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2">Họ và tên</label>
                                <input
                                    required
                                    type="text"
                                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 dark:bg-gray-900 outline-none focus:ring-2 focus:ring-blue-500 text-sm font-bold transition-all"
                                    value={formData.fullName}
                                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2">Email</label>
                                    <input
                                        required
                                        type="email"
                                        className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 dark:bg-gray-900 outline-none focus:ring-2 focus:ring-blue-500 text-sm font-bold transition-all"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2">Mật khẩu</label>
                                    <input
                                        required
                                        type="password"
                                        className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 dark:bg-gray-900 outline-none focus:ring-2 focus:ring-blue-500 text-sm font-bold transition-all"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2">Số điện thoại</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 dark:bg-gray-900 outline-none focus:ring-2 focus:ring-blue-500 text-sm font-bold transition-all"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2">Vai trò</label>
                                    <select
                                        className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 dark:bg-gray-900 outline-none focus:ring-2 focus:ring-blue-500 text-sm font-bold transition-all"
                                        value={formData.role}
                                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    >
                                        <option value="admin">Admin</option>
                                        <option value="farm">Farm Owner</option>
                                        <option value="shipping">Ship Manager</option>
                                        <option value="driver">Ship Driver</option>
                                        <option value="retailer">Retailer</option>
                                    </select>
                                </div>
                            </div>
                            <button
                                type="submit"
                                className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-sm tracking-widest shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition-all mt-4"
                            >
                                XÁC NHẬN TẠO TÀI KHOẢN
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
