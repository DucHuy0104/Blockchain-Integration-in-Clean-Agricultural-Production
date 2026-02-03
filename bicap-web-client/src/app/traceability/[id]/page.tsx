'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'next/navigation';
import { QRCodeCanvas } from 'qrcode.react';

interface Process {
    id: number;
    type: string;
    description: string;
    imageUrl: string | null;
    txHash: string | null;
    createdAt: string;
}

interface Season {
    id: number;
    name: string;
    startDate: string;
    endDate: string | null;
    status: string;
    txHash: string | null;
    processes: Process[];
    farm: {
        name: string;
        address: string;
        certification: string;
    };
}

export default function TraceabilityPage() {
    const { id } = useParams();
    const [season, setSeason] = useState<Season | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (id) {
            // Validate ID - must be a number, not "XXX" or other placeholder
            const seasonId = typeof id === 'string' ? id : String(id);
            if (seasonId === 'XXX' || seasonId === 'null' || seasonId === 'undefined' || isNaN(Number(seasonId))) {
                setError('ID vụ mùa không hợp lệ. Vui lòng quét mã QR hoặc nhập ID chính xác.');
                setLoading(false);
                return;
            }

            axios.get(`http://localhost:5001/api/seasons/${seasonId}`)
                .then(res => setSeason(res.data))
                .catch(err => {
                    console.error(err);
                    if (err.response?.status === 404) {
                        setError(`Không tìm thấy thông tin vụ mùa với ID "${seasonId}". Vui lòng kiểm tra lại ID hoặc chạy script seed để tạo dữ liệu mẫu.`);
                    } else if (err.response?.status === 400) {
                        setError('ID vụ mùa không hợp lệ. ID phải là số nguyên.');
                    } else {
                        setError('Không tìm thấy thông tin vụ mùa hoặc lỗi kết nối.');
                    }
                })
                .finally(() => setLoading(false));
        } else {
            setError('Vui lòng cung cấp ID vụ mùa.');
            setLoading(false);
        }
    }, [id]);

    if (loading) return <div className="p-8 text-center">Đang truy xuất nguồn gốc...</div>;
    if (error) return <div className="p-8 text-center text-red-600">{error}</div>;
    if (!season) return null;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10 px-4">
            <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="bg-green-600 p-8 text-center text-white">
                    <h1 className="text-3xl font-bold mb-2">TRUY XUẤT NGUỒN GỐC</h1>
                    <p className="text-green-100">Bảo chứng bởi công nghệ Blockchain</p>
                </div>

                <div className="p-8">
                    {/* Farm Info */}
                    <div className="mb-8 border-b border-gray-100 dark:border-gray-700 pb-8">
                        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">🏠 Thông Tin Nhà Sản Xuất</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-500">Trang trại</p>
                                <p className="font-semibold text-gray-800 dark:text-gray-200">{season.farm?.name}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Địa chỉ</p>
                                <p className="font-semibold text-gray-800 dark:text-gray-200">{season.farm?.address}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Chứng nhận</p>
                                <p className="font-semibold text-green-600">{season.farm?.certification || 'Chưa cập nhật'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Season Info */}
                    <div className="mb-8">
                        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">🌱 Thông Tin Vụ Mùa</h2>
                        <div className="bg-green-50 dark:bg-gray-700 p-4 rounded-lg">
                            <h3 className="text-lg font-bold text-green-800 dark:text-green-200">{season.name}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                                Thời gian: {new Date(season.startDate).toLocaleDateString()}
                                {season.endDate ? ` - ${new Date(season.endDate).toLocaleDateString()}` : ' (Đang diễn ra)'}
                            </p>
                            {season.txHash && (
                                <div className="mt-3 text-xs font-mono text-gray-500 bg-white dark:bg-gray-800 p-2 rounded border border-gray-200 dark:border-gray-600 break-all">
                                    Blockchain Hash: {season.txHash}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Timeline */}
                    <div className="mb-8">
                        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6">📜 Nhật Ký Canh Tác</h2>
                        <div className="relative border-l-2 border-green-200 dark:border-gray-600 ml-3 space-y-8 pl-6 pb-2">
                            {season.processes.map((proc) => (
                                <div key={proc.id} className="relative">
                                    <div className="absolute -left-[31px] top-1 bg-green-500 h-4 w-4 rounded-full border-2 border-white dark:border-gray-800 shadow-sm"></div>

                                    <div>
                                        <div className="flex justify-between items-start">
                                            <h4 className="font-bold text-gray-800 dark:text-white capitalize text-lg">
                                                {proc.type === 'watering' ? 'Tưới Nước' :
                                                    proc.type === 'fertilizing' ? 'Bón Phân' :
                                                        proc.type === 'harvesting' ? 'Thu Hoạch' :
                                                            proc.type === 'pesticide' ? 'Phun Thuốc' : proc.type}
                                            </h4>
                                            <span className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                                                {new Date(proc.createdAt).toLocaleString()}
                                            </span>
                                        </div>
                                        <p className="text-gray-600 dark:text-gray-300 mt-2">{proc.description}</p>

                                        {proc.txHash && (
                                            <div className="mt-2 flex items-center gap-1 text-xs text-green-600 font-medium">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                                Đã xác thực trên Blockchain
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* QR Code Section */}
                    {typeof window !== 'undefined' && (
                        <div className="border-t border-gray-100 dark:border-gray-700 pt-8 flex flex-col items-center">
                            <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4">📱 Quét để chia sẻ hoặc xác thực</h2>
                            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 mb-2">
                                <QRCodeCanvas value={window.location.href} size={150} />
                            </div>
                            <p className="text-xs text-gray-400">QR Code dẫn đến trang này</p>
                        </div>
                    )}
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 p-4 text-center text-sm text-gray-500">
                    <p>© 2025 BICAP - Hệ thống Nông nghiệp Sạch</p>
                </div>
            </div>
        </div>
    );
}
