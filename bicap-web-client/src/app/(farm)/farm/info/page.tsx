"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';

interface Farm {
    id: number;
    name: string;
    address: string;
    description: string;
    certification: string;
    location_coords: string;
    status: 'pending' | 'active' | 'rejected';
    adminNote?: string;
}

export default function FarmInfoPage() {
    const { user, getAccessToken } = useAuth();
    const [farms, setFarms] = useState<Farm[]>([]);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState<'list' | 'form'>('list');
    const [editingFarm, setEditingFarm] = useState<Farm | null>(null);

    const [formData, setFormData] = useState({
        name: '',
        address: '',
        description: '',
        certification: '',
        location_coords: ''
    });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (user) fetchFarms();
    }, [user]);

    const fetchFarms = async () => {
        try {
            setLoading(true);
            const token = await getAccessToken();
            const res = await axios.get('http://localhost:5001/api/farms/my-farms', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setFarms(res.data.farms || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddNew = () => {
        setEditingFarm(null);
        setFormData({ name: '', address: '', description: '', certification: '', location_coords: '' });
        setView('form');
    };

    const handleEdit = (farm: Farm) => {
        setEditingFarm(farm);
        setFormData({
            name: farm.name || '',
            address: farm.address || '',
            description: farm.description || '',
            certification: farm.certification || '',
            location_coords: farm.location_coords || ''
        });
        setView('form');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const token = await getAccessToken();
            if (editingFarm) {
                await axios.put(`http://localhost:5001/api/farms/${editingFarm.id}`, formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                alert('Cập nhật thành công! Trạng thái sẽ được Admin duyệt lại.');
            } else {
                await axios.post('http://localhost:5001/api/farms', formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                alert('Đăng ký thành công! Vui lòng chờ Admin phê duyệt.');
            }
            await fetchFarms();
            setView('list');
        } catch (err: any) {
            alert(err.response?.data?.message || 'Lỗi xử lý');
        } finally {
            setSaving(false);
        }
    };

    if (loading && farms.length === 0) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black text-gray-800 dark:text-white">Thông Tin Trang Trại</h1>
                    <p className="text-sm text-gray-400 mt-1">Quản lý và đăng ký các cơ sở sản xuất của bạn</p>
                </div>
                {view === 'list' ? (
                    <button
                        onClick={handleAddNew}
                        className="bg-green-600 text-white px-6 py-3 rounded-2xl font-black text-sm tracking-widest shadow-lg shadow-green-500/30 hover:bg-green-700 transition-all flex items-center gap-2"
                    >
                        <span>➕</span> THÊM TRANG TRẠI
                    </button>
                ) : (
                    <button
                        onClick={() => setView('list')}
                        className="bg-gray-100 text-gray-500 px-6 py-3 rounded-2xl font-black text-sm tracking-widest hover:bg-gray-200 transition-all"
                    >
                        QUAY LẠI
                    </button>
                )}
            </div>

            {view === 'list' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                    {farms.length === 0 ? (
                        <div className="col-span-full bg-white dark:bg-gray-800 p-12 rounded-[2rem] border border-dashed border-gray-200 text-center">
                            <div className="text-5xl mb-4">🚜</div>
                            <h3 className="text-xl font-bold text-gray-700">Chưa có trang trại nào</h3>
                            <button onClick={handleAddNew} className="mt-4 text-green-600 font-black text-sm uppercase tracking-widest hover:underline">
                                Đăng ký ngay trang trại đầu tiên
                            </button>
                        </div>
                    ) : (
                        farms.map((farm) => (
                            <div key={farm.id} className="bg-white dark:bg-gray-800 rounded-[2rem] p-8 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all group">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="w-12 h-12 bg-green-50 dark:bg-green-900/20 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                                        🏘️
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${farm.status === 'active' ? 'bg-green-100 text-green-600' :
                                        farm.status === 'pending' ? 'bg-orange-100 text-orange-600' : 'bg-red-100 text-red-600'
                                        }`}>
                                        {farm.status === 'active' ? 'Đang hoạt động' : farm.status === 'pending' ? 'Chờ duyệt' : 'Từ chối'}
                                    </span>
                                </div>
                                <h3 className="text-xl font-black text-gray-800 dark:text-white mb-2">{farm.name}</h3>
                                <p className="text-sm text-gray-400 mb-6 flex items-center gap-1">
                                    📍 {farm.address}
                                </p>

                                {farm.status === 'rejected' && farm.adminNote && (
                                    <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/10 border-l-4 border-red-400 rounded-xl">
                                        <p className="text-[10px] font-black text-red-400 uppercase tracking-widest mb-1">Cần chỉnh sửa</p>
                                        <p className="text-xs text-red-700 dark:text-red-300 font-bold">{farm.adminNote}</p>
                                    </div>
                                )}

                                <div className="flex justify-between items-center pt-6 border-t border-gray-50 dark:border-gray-700">
                                    <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">{farm.certification || 'Chưa cập nhật chứng nhận'}</span>
                                    <button
                                        onClick={() => handleEdit(farm)}
                                        className="bg-blue-50 text-blue-600 px-4 py-2 rounded-xl text-xs font-black shadow-sm hover:bg-blue-600 hover:text-white transition-all"
                                    >
                                        CHỈNH SỬA
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            ) : (
                <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-xl p-10 border border-gray-100 dark:border-gray-700 max-w-2xl mx-auto">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 gap-6">
                            <div>
                                <label className="block text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2 ml-1">Tên Trang Trại</label>
                                <input
                                    required
                                    type="text"
                                    className="w-full px-5 py-4 rounded-2xl border border-gray-100 dark:border-gray-700 dark:bg-gray-900 outline-none focus:ring-2 focus:ring-green-500 font-bold transition-all"
                                    value={formData.name}
                                    placeholder="Vd: Trang trại Xanh Organic"
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2 ml-1">Địa chỉ sản xuất</label>
                                <input
                                    required
                                    type="text"
                                    className="w-full px-5 py-4 rounded-2xl border border-gray-100 dark:border-gray-700 dark:bg-gray-900 outline-none focus:ring-2 focus:ring-green-500 font-bold transition-all"
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2 ml-1">Chứng nhận</label>
                                    <input
                                        type="text"
                                        className="w-full px-5 py-4 rounded-2xl border border-gray-100 dark:border-gray-700 dark:bg-gray-900 outline-none focus:ring-2 focus:ring-green-500 font-bold transition-all"
                                        placeholder="Vd: VietGAP"
                                        value={formData.certification}
                                        onChange={(e) => setFormData({ ...formData, certification: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2 ml-1">Tọa độ GPS</label>
                                    <input
                                        type="text"
                                        className="w-full px-5 py-4 rounded-2xl border border-gray-100 dark:border-gray-700 dark:bg-gray-900 outline-none focus:ring-2 focus:ring-green-500 font-bold transition-all"
                                        placeholder="10.123, 106.123"
                                        value={formData.location_coords}
                                        onChange={(e) => setFormData({ ...formData, location_coords: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2 ml-1">Mô tả quy trình</label>
                                <textarea
                                    className="w-full px-5 py-4 h-32 rounded-2xl border border-gray-100 dark:border-gray-700 dark:bg-gray-900 outline-none focus:ring-2 focus:ring-green-500 transition-all"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={saving}
                            className="w-full py-4 bg-green-600 text-white rounded-2xl font-black text-sm tracking-widest shadow-lg shadow-green-500/30 hover:bg-green-700 transition-all disabled:opacity-50"
                        >
                            {saving ? 'ĐANG XỬ LÝ...' : (editingFarm ? 'CẬP NHẬT THÔNG TIN' : 'ĐĂNG KÝ TRANG TRẠI')}
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}
