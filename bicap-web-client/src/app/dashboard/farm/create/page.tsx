"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../../context/AuthContext";

export default function CreateFarmPage() {
    const { getToken } = useAuth();
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        description: '',
        certification: ''
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const token = await getToken();

        try {
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/farms`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            router.push('/dashboard/farm');
        } catch (error) {
            console.error(error);
            alert("Lỗi khi tạo trang trại!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded shadow border border-gray-200">
            <h1 className="text-2xl font-bold mb-6 text-gray-900">Đăng Ký Nông Trại Mới</h1>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block mb-1 font-medium text-gray-700">Tên Nông Trại</label>
                    <input
                        required
                        type="text"
                        className="w-full border border-gray-300 bg-white text-gray-900 p-2 rounded focus:ring-green-500 focus:outline-none"
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                    />
                </div>
                <div>
                    <label className="block mb-1 font-medium text-gray-700">Địa chỉ</label>
                    <input
                        required
                        type="text"
                        className="w-full border border-gray-300 bg-white text-gray-900 p-2 rounded focus:ring-green-500 focus:outline-none"
                        value={formData.address}
                        onChange={e => setFormData({ ...formData, address: e.target.value })}
                    />
                </div>
                <div>
                    <label className="block mb-1 font-medium text-gray-700">Mô tả</label>
                    <textarea
                        className="w-full border border-gray-300 bg-white text-gray-900 p-2 rounded focus:ring-green-500 focus:outline-none"
                        value={formData.description}
                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                    />
                </div>
                <div>
                    <label className="block mb-1 font-medium text-gray-700">Chứng nhận (VietGAP, GlobalGAP...)</label>
                    <input
                        required
                        type="text"
                        className="w-full border border-gray-300 bg-white text-gray-900 p-2 rounded focus:ring-green-500 focus:outline-none"
                        value={formData.certification}
                        onChange={e => setFormData({ ...formData, certification: e.target.value })}
                    />
                </div>

                <div className="pt-4">
                    <button
                        disabled={loading}
                        type="submit"
                        className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:bg-gray-400"
                    >
                        {loading ? 'Đang xử lý...' : 'Tạo Nông Trại'}
                    </button>
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="ml-4 text-gray-600 hover:text-gray-800"
                    >
                        Hủy
                    </button>
                </div>
            </form>
        </div>
    );
}
