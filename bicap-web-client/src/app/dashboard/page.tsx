"use client";

import { useAuth } from "../../context/AuthContext";

export default function DashboardHome() {
    const { user, role } = useAuth();

    return (
        <div>
            <h1 className="text-3xl font-bold mb-4">Xin chào, {user?.displayName || user?.email}</h1>
            <p className="text-gray-600">
                Chào mừng bạn đến với hệ thống quản lý nông sản BICAP.
                <br />
                Vai trò hiện tại của bạn là: <span className="font-bold uppercase text-green-600">{role || 'Chưa xác định'}</span>
            </p>

            <div className="mt-8 p-6 bg-white rounded shadow text-center">
                <p>Vui lòng chọn chức năng từ menu bên trái.</p>
            </div>
        </div>
    )
}
