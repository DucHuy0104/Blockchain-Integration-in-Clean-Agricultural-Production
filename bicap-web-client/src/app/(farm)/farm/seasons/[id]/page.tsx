'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import { auth } from '@/lib/firebase';
import { useRouter, useParams } from 'next/navigation';
// import { QRCodeCanvas } from 'qrcode.react'; // Removed as we link directly

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
}

interface SeasonTask {
    id: number;
    title: string;
    isCompleted: boolean;
    priority: string;
}

export default function SeasonDetailPage() {
    // Wrapper to handle client-side params if needed, but here we can just use the content component
    return <SeasonDetailContent />;
}

function SeasonDetailContent() {
    const { id } = useParams();
    const { user, getAccessToken } = useAuth();
    const router = useRouter();

    const [season, setSeason] = useState<Season | null>(null);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    // Add Process State
    const [processType, setProcessType] = useState('watering');
    const [processDesc, setProcessDesc] = useState('');
    const [adding, setAdding] = useState(false);

    // Season Task State
    const [tasks, setTasks] = useState<SeasonTask[]>([]);
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [taskPriority, setTaskPriority] = useState('normal');

    // Export State
    const [exporting, setExporting] = useState(false);
    const [qrData, setQrData] = useState<string | null>(null);

    useEffect(() => {
        if (id) fetchSeasonDetail();
    }, [id]);

    const fetchSeasonDetail = async () => {
        try {
            const res = await axios.get(`http://localhost:5001/api/seasons/${id}`);
            setSeason(res.data);

            // Also fetch tasks for this season
            const token = await getAccessToken();
            const taskRes = await axios.get(`http://localhost:5001/api/tasks?seasonId=${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTasks(taskRes.data.tasks);

        } catch (error) {
            console.error("Error fetching season:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddTask = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = await getAccessToken();
            const res = await axios.post('http://localhost:5001/api/tasks', {
                title: newTaskTitle,
                seasonId: id,
                farmId: (season as any)?.farmId || 1, // Safe fallback
                priority: taskPriority
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTasks([res.data.task, ...tasks]);
            setNewTaskTitle('');
        } catch (error) {
            alert('Lỗi thêm công việc');
        }
    };

    const handleToggleTask = async (taskId: number) => {
        // Optimistic
        setTasks(prev => prev.map(t => t.id === taskId ? { ...t, isCompleted: !t.isCompleted } : t));

        try {
            const token = await getAccessToken();
            await axios.put(`http://localhost:5001/api/tasks/${taskId}/toggle`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
        } catch (error) {
            alert('Lỗi cập nhật');
            setTasks(prev => prev.map(t => t.id === taskId ? { ...t, isCompleted: !t.isCompleted } : t));
        }
    };

    const handleAddProcess = async (e: React.FormEvent) => {
        e.preventDefault();
        setAdding(true);
        try {
            const token = await getAccessToken();
            // if (!token) throw new Error("Login required");

            await axios.post(`http://localhost:5001/api/seasons/${id}/process`, {
                type: processType,
                description: processDesc,
                imageUrl: '' // TODO: Handle file upload later
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setShowModal(false);
            setProcessDesc('');
            fetchSeasonDetail(); // Refresh
        } catch (error) {
            console.error(error);
            alert('Lỗi thêm nhật ký');
        } finally {
            setAdding(false);
        }
    };

    const handleExport = async () => {
        if (!confirm('Bạn có chắc muốn kết thúc vụ mùa và xuất mã QR không? Hành động này sẽ khóa vụ mùa.')) return;
        setExporting(true);
        try {
            const token = await getAccessToken();
            const res = await axios.post(`http://localhost:5001/api/seasons/${id}/export`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setQrData(res.data.qrCodeData);
            fetchSeasonDetail(); // Refresh to see status change
            // Auto open traceability page in new tab if possible, or just update UI
            // window.open(`/traceability/${id}`, '_blank');
        } catch (error) {
            console.error(error);
            alert('Lỗi xuất vụ mùa');
        } finally {
            setExporting(false);
        }
    };

    if (loading) return <div className="p-8">Đang tải chi tiết vụ mùa...</div>;
    if (!season) return <div className="p-8">Không tìm thấy vụ mùa.</div>;

    // Calculate QR Value safely on client
    const qrValue = typeof window !== 'undefined'
        ? `${window.location.origin}/traceability/${season.id}`
        : `http://localhost:3000/traceability/${season.id}`;

    return (
        <div className="max-w-4xl mx-auto p-4">
            {/* Header */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-8 border border-gray-100 dark:border-gray-700">
                <div className="flex flex-col md:flex-row justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-3">
                            {season.name}
                            <span className={`text-sm px-3 py-1 rounded-full ${season.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                {season.status === 'active' ? 'Đang diễn ra' : 'Đã kết thúc'}
                            </span>
                        </h1>
                        <p className="text-gray-500 mt-2">
                            Ngày bắt đầu: {new Date(season.startDate).toLocaleDateString()}
                            {season.endDate && ` | Ngày kết thúc: ${new Date(season.endDate).toLocaleDateString()}`}
                        </p>
                        {season.txHash && (
                            <div className="flex items-center gap-2 mt-2 text-xs text-blue-600 bg-blue-50 p-2 rounded max-w-full">
                                <span className="font-semibold whitespace-nowrap">Khởi tạo Blockchain:</span>
                                <span className="font-mono truncate" title={season.txHash}>
                                    {season.txHash}
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="mt-4 md:mt-0 flex gap-3">
                        {season.status === 'active' && (
                            <>
                                <button
                                    onClick={() => setShowModal(true)}
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow"
                                >
                                    + Ghi Nhật Ký
                                </button>
                                <button
                                    onClick={handleExport}
                                    disabled={exporting}
                                    className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded shadow disabled:opacity-50"
                                >
                                    {exporting ? 'Đang xuất...' : 'Kết Thúc & Xuất QR'}
                                </button>
                            </>
                        )}
                        {/* If Exported/Completed, show QR Link */}
                        {(season.status === 'completed' || qrData) && (
                            <div className="flex gap-2 items-center">
                                <a
                                    href={`/traceability/${season.id}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-green-600 hover:bg-green-700 text-white text-sm font-medium py-1.5 px-3 rounded shadow flex items-center gap-2 whitespace-nowrap"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4h-4v-2h-2v4h6v-2h4m6-6h2m-6 0h-2v4h-4v-2h-2v4h6v-2h4m0-10V4m-6 11V4m-6 11v-4m6 4v-4"></path></svg>
                                    Truy Xuất & QR
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Task Management Section (NEW) */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-8 border border-gray-100 dark:border-gray-700">
                <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white flex items-center gap-2">
                    📋 Danh sách công việc dự kiến
                </h3>

                {/* Add Task Form */}
                {season.status === 'active' && (
                    <form onSubmit={handleAddTask} className="flex gap-2 mb-6">
                        <select
                            value={taskPriority}
                            onChange={(e) => setTaskPriority(e.target.value)}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
                        >
                            <option value="high">🔴 Gấp</option>
                            <option value="normal">🔵 Bình thường</option>
                            <option value="low">🟢 Thấp</option>
                        </select>
                        <input
                            type="text"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            placeholder="Nhập tên công việc cần làm..."
                            required
                            value={newTaskTitle}
                            onChange={(e) => setNewTaskTitle(e.target.value)}
                        />
                        <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Thêm</button>
                    </form>
                )}

                {/* Task List */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Incomplete */}
                    <div className="bg-orange-50 p-4 rounded-lg">
                        <h4 className="font-bold text-orange-800 mb-3 border-b border-orange-200 pb-2">Chưa hoàn thành</h4>
                        <ul className="space-y-2">
                            {tasks.filter(t => !t.isCompleted).map(task => (
                                <li key={task.id} className="flex items-center justify-between bg-white p-2 rounded shadow-sm">
                                    <div className="flex items-center gap-2">
                                        <input type="checkbox" checked={false} onChange={() => handleToggleTask(task.id)} className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 cursor-pointer" />
                                        <span className={task.priority === 'high' ? 'font-bold text-red-600' : ''}>{task.title}</span>
                                    </div>
                                    <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-600">{task.priority}</span>
                                </li>
                            ))}
                            {tasks.filter(t => !t.isCompleted).length === 0 && <p className="text-sm text-gray-500 italic">Không có công việc nào.</p>}
                        </ul>
                    </div>

                    {/* Completed */}
                    <div className="bg-green-50 p-4 rounded-lg">
                        <h4 className="font-bold text-green-800 mb-3 border-b border-green-200 pb-2">Đã hoàn thành</h4>
                        <ul className="space-y-2">
                            {tasks.filter(t => t.isCompleted).map(task => (
                                <li key={task.id} className="flex items-center gap-2 bg-white p-2 rounded shadow-sm opacity-70">
                                    <input type="checkbox" checked={true} onChange={() => handleToggleTask(task.id)} className="w-5 h-5 text-green-600 rounded focus:ring-green-500 cursor-pointer" />
                                    <span className="line-through text-gray-500">{task.title}</span>
                                </li>
                            ))}
                            {tasks.filter(t => t.isCompleted).length === 0 && <p className="text-sm text-gray-500 italic">Chưa có công việc nào xong.</p>}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Timeline */}
            <div className="relative border-l-4 border-gray-200 dark:border-gray-700 ml-4 space-y-8 pl-8 pb-8">
                {season.processes.length === 0 ? (
                    <p className="text-gray-500 italic">Chưa có hoạt động nào được ghi lại.</p>
                ) : (
                    season.processes.map((proc) => (
                        <div key={proc.id} className="relative group">
                            {/* Dot */}
                            <div className="absolute -left-[43px] top-1 bg-green-500 h-6 w-6 rounded-full border-4 border-white dark:border-gray-900 shadow-sm z-10"></div>

                            <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow border border-gray-100 dark:border-gray-700 transition hover:bg-gray-50 dark:hover:bg-gray-750">
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2">
                                    <h3 className="text-lg font-bold text-gray-800 dark:text-white capitalize">
                                        {proc.type === 'watering' ? '💧 Tưới Nước' :
                                            proc.type === 'fertilizing' ? '🌱 Bón Phân' :
                                                proc.type === 'harvesting' ? '🌾 Thu Hoạch' :
                                                    proc.type === 'pesticide' ? '🛡️ Phun Thuốc' : proc.type}
                                    </h3>
                                    <span className="text-sm text-gray-500">
                                        {new Date(proc.createdAt).toLocaleString()}
                                    </span>
                                </div>
                                <p className="text-gray-600 dark:text-gray-300 mb-3">{proc.description}</p>

                                {proc.txHash && (
                                    <div className="text-xs text-green-600 bg-green-50 inline-block px-2 py-1 rounded border border-green-100 font-mono break-all">
                                        Blockchain Tx: {proc.txHash}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Modal Add Process */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6">
                        <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Ghi Nhật Ký Hoạt Động</h2>
                        <form onSubmit={handleAddProcess} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Hoạt động</label>
                                <select
                                    className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                                    value={processType}
                                    onChange={(e) => setProcessType(e.target.value)}
                                >
                                    <option value="watering">Tưới Nước</option>
                                    <option value="fertilizing">Bón Phân</option>
                                    <option value="pesticide">Phun Thuốc</option>
                                    <option value="harvesting">Thu Hoạch</option>
                                    <option value="other">Khác</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Mô tả chi tiết</label>
                                <textarea
                                    className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                                    rows={3}
                                    required
                                    value={processDesc}
                                    onChange={(e) => setProcessDesc(e.target.value)}
                                    placeholder="Ví dụ: Sử dụng phân NPK, liều lượng 50kg..."
                                />
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    disabled={adding}
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                                >
                                    {adding ? 'Đang lưu...' : 'Hoàn thành công việc'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Show QR - REMOVED */}
            {/*
            {showQrModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-xs p-4 text-center">
                        <h2 className="text-lg font-bold mb-3 text-gray-800 dark:text-white">Mã QR Truy Xuất</h2>
                        <div className="flex justify-center mb-3 bg-white p-3 rounded border">
                            <QRCodeCanvas value={qrValue} size={180} />
                        </div>
                        <p className="text-xs text-gray-500 mb-4 break-all px-2">{qrValue}</p>

                        <div className="flex flex-col gap-2">
                            <a
                                href={qrValue}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded shadow block w-full"
                            >
                                Xem Trang Truy Xuất &rarr;
                            </a>
                            <button
                                onClick={() => setShowQrModal(false)}
                                className="bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm font-medium py-2 px-4 rounded block w-full"
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}
            */}
        </div>
    );
}

