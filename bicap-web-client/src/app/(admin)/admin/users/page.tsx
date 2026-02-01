"use client";
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';

export default function UserManagementPage() {
    const { getAccessToken } = useAuth();
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const token = await getAccessToken();
            const res = await axios.get(`http://localhost:5001/api/admin/users?search=${searchTerm}`, {
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
    }, [searchTerm]);

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

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center bg-white dark:bg-gray-800 p-6 rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="relative w-96">
                    <input
                        type="text"
                        placeholder="Tìm người dùng (Tên, Email, SĐT)..."
                        className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
                </div>
                <button className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-blue-500/30 hover:scale-105 transition-all flex items-center gap-2">
                    <span>➕</span> Thêm Admin mới
                </button>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700">
                        <tr>
                            <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-gray-500">ID / Tên</th>
                            <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-gray-500">Email / SĐT</th>
                            <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-gray-500">Vai trò</th>
                            <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-gray-500">Trạng thái</th>
                            <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-gray-500">Hành động</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                        {loading ? (
                            <tr><td colSpan={5} className="p-20 text-center text-gray-400 font-bold animate-pulse">Đang truy vấn dữ liệu...</td></tr>
                        ) : users.length === 0 ? (
                            <tr><td colSpan={5} className="p-20 text-center text-gray-400">Không tìm thấy người dùng nào.</td></tr>
                        ) : users.map((u) => (
                            <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/40 transition-colors group">
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                                            {u.fullName[0]}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-800 dark:text-gray-200">{u.fullName}</p>
                                            <p className="text-[10px] font-black text-gray-400 tracking-tighter uppercase">ID: #{u.id}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <p className="text-sm font-medium">{u.email}</p>
                                    <p className="text-xs text-gray-400">{u.phone}</p>
                                </td>
                                <td className="px-8 py-6">
                                    <select
                                        className="bg-gray-100 dark:bg-gray-700 px-3 py-1.5 rounded-lg text-xs font-bold focus:ring-2 focus:ring-blue-500 outline-none"
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
                                <td className="px-8 py-6">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${u.status === 'active' ? 'bg-green-100 text-green-600' :
                                            u.status === 'blocked' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'
                                        }`}>
                                        {u.status}
                                    </span>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleUpdateUser(u.id, { status: u.status === 'active' ? 'blocked' : 'active' })}
                                            className={`p-2 rounded-xl transition-all ${u.status === 'active' ? 'bg-red-50 text-red-500 hover:bg-red-500 hover:text-white' : 'bg-green-50 text-green-500 hover:bg-green-500 hover:text-white'
                                                }`}
                                            title={u.status === 'active' ? 'Khóa tài khoản' : 'Kích hoạt tài khoản'}
                                        >
                                            {u.status === 'active' ? '🔒' : '🔓'}
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
