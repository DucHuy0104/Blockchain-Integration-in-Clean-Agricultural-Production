"use client";
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';

export default function BlockchainManagementPage() {
    const { getAccessToken } = useAuth();
    const [status, setStatus] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [deploying, setDeploying] = useState(false);

    const fetchStatus = async () => {
        try {
            setLoading(true);
            const token = await getAccessToken();
            const res = await axios.get('http://localhost:5001/api/admin/blockchain/status', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setStatus(res.data);
        } catch (err) {
            console.error("Lỗi tải trạng thái blockchain:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStatus();
    }, []);

    const handleDeploy = async () => {
        if (!confirm("Bạn có chắc chắn muốn triển khai lại Smart Contract? Hành động này sẽ tạo contract mới trên mạng VeChain.")) return;
        try {
            setDeploying(true);
            const token = await getAccessToken();
            const res = await axios.post('http://localhost:5001/api/admin/blockchain/deploy', {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("Đã gửi yêu cầu triển khai: " + res.data.tx);
        } catch (err) {
            alert("Lỗi khi triển khai!");
        } finally {
            setDeploying(false);
        }
    };

    return (
        <div className="space-y-8 max-w-5xl">
            {/* Connection Status */}
            <div className="bg-white dark:bg-gray-800 p-10 rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-gray-700 flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <div className={`w-20 h-20 rounded-3xl flex items-center justify-center text-4xl shadow-inner ${status?.status === 'connected' ? 'bg-green-50 text-green-500' : 'bg-red-50 text-red-500'
                        }`}>
                        {status?.status === 'connected' ? '⚡' : '❌'}
                    </div>
                    <div>
                        <h3 className="text-2xl font-black text-gray-800 dark:text-white">Blockchain Status</h3>
                        <p className="text-gray-500 font-bold uppercase tracking-widest text-xs flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${status?.status === 'connected' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
                            {status?.status === 'connected' ? 'Connected to Network' : 'Disconnected'}
                        </p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Current Network</p>
                    <p className="text-lg font-black text-blue-600">{status?.network || 'VeChain Thor'}</p>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Smart Contract Details */}
                <div className="bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-gray-700">
                    <h3 className="text-xl font-black text-gray-800 dark:text-white mb-6 flex items-center gap-2">
                        <span>📜</span> Smart Contract
                    </h3>
                    <div className="space-y-6">
                        <div>
                            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Contract Address</p>
                            <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700 font-mono text-sm break-all">
                                {status?.contract || '0x000000000...placeholder'}
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-2xl">
                                <p className="text-[10px] font-black text-blue-400 uppercase mb-1">Total Tx</p>
                                <p className="text-xl font-black text-blue-700">1,245</p>
                            </div>
                            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-2xl">
                                <p className="text-[10px] font-black text-purple-400 uppercase mb-1">Contract Version</p>
                                <p className="text-xl font-black text-purple-700">v2.1.0</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Management Actions */}
                <div className="bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-gray-700">
                    <h3 className="text-xl font-black text-gray-800 dark:text-white mb-6 flex items-center gap-2">
                        <span>⚙️</span> Management Actions
                    </h3>
                    <div className="space-y-4">
                        <button
                            disabled={deploying}
                            onClick={handleDeploy}
                            className={`w-full py-4 rounded-2xl font-black text-sm transition-all shadow-lg flex items-center justify-center gap-3 ${deploying ? 'bg-gray-200 text-gray-400' : 'bg-gray-900 text-white hover:bg-black shadow-gray-200'
                                }`}
                        >
                            <span>🚀</span> {deploying ? 'DEPLOYING...' : 'RE-DEPLOY CONTRACT'}
                        </button>
                        <button className="w-full py-4 rounded-2xl font-black text-sm bg-white border-2 border-gray-100 text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-all flex items-center justify-center gap-3">
                            <span>🔍</span> VERIFY CONTRACT
                        </button>
                        <button className="w-full py-4 rounded-2xl font-black text-sm bg-white border-2 border-gray-100 text-gray-600 hover:border-orange-500 hover:text-orange-600 transition-all flex items-center justify-center gap-3">
                            <span>📝</span> EXPORT ABI
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
