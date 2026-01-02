'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

interface Product {
    id: number;
    name: string;
    price: number;
    quantity: number;
    farm: {
        name: string;
        address: string;
        certification: string;
    };
    season: {
        name: string;
    } | null;
    batchCode: string;
}

export default function MarketplacePage() {
    const { user } = useAuth();
    const router = useRouter();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    // Buy Modal State
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [buyQuantity, setBuyQuantity] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [buying, setBuying] = useState(false);

    useEffect(() => {
        axios.get('http://localhost:5001/api/products')
            .then(res => setProducts(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    const handleBuyClick = (product: Product) => {
        if (!user) {
            if (confirm('Bạn cần đăng nhập để mua hàng. Đến trang đăng nhập?')) {
                router.push('/login');
            }
            return;
        }
        setSelectedProduct(product);
        setBuyQuantity(1);
        setShowModal(true);
    };

    const submitOrder = async () => {
        if (!selectedProduct) return;
        setBuying(true);
        try {
            const token = await auth.currentUser?.getIdToken();
            await axios.post('http://localhost:5001/api/orders', {
                productId: selectedProduct.id,
                quantity: buyQuantity
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            alert('Đặt hàng thành công! Chủ trại sẽ liên hệ với bạn.');
            setShowModal(false);
            // Reload products to update quantity
            const res = await axios.get('http://localhost:5001/api/products');
            setProducts(res.data);

        } catch (error: any) {
            console.error(error);
            alert(error.response?.data?.message || 'Có lỗi xảy ra khi đặt hàng');
        } finally {
            setBuying(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            {/* Header */}
            <nav className="bg-green-600 text-white px-4 py-2 sticky top-0 z-50 shadow-md">
                <div className="w-full flex justify-between items-center gap-2">
                    <Link href="/" className="text-lg font-bold whitespace-nowrap hidden lg:block">BICAP Market</Link>
                    <div className="flex items-center gap-1 justify-end w-full lg:w-auto">
                        <NavLink href="/" label="Trang chủ" icon="🏠" />
                        <NavLink href="/market" label="Sàn Nông Sản" icon="🏪" highlight />
                        {user ? (
                            <NavLink href="/farm" label="Vào Dashboard" icon="🚜" />
                        ) : (
                            <NavLink href="/login" label="Đăng Nhập" icon="👤" />
                        )}
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="bg-green-700 text-white py-12 px-4 text-center">
                <h1 className="text-4xl font-bold mb-4">Nông Sản Sạch - Truy Xuất Nguồn Gốc Blockchain</h1>
                <p className="text-green-100 max-w-2xl mx-auto">
                    Kết nối trực tiếp từ Nông trại đến Bàn ăn. Minh bạch, An toàn và Tin cậy.
                </p>
            </div>

            {/* Product List */}
            <div className="container mx-auto p-4 py-8">
                {loading ? (
                    <div className="text-center py-10">Đang tải sản phẩm...</div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {products.map(product => (
                            <div key={product.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-2xl transition hover:-translate-y-1">
                                <div className="h-48 bg-gray-200 flex items-center justify-center">
                                    <span className="text-4xl">🌾</span>
                                </div>
                                <div className="p-5">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-lg font-bold text-gray-800 dark:text-white truncate" title={product.name}>{product.name}</h3>
                                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">{product.farm.certification}</span>
                                    </div>
                                    <p className="text-gray-500 text-sm mb-4 truncate">{product.farm.name} - {product.farm.address}</p>

                                    <div className="flex justify-between items-center mb-4">
                                        <div>
                                            <p className="text-xs text-gray-400">Giá bán</p>
                                            <p className="text-lg font-bold text-green-600">{product.price.toLocaleString('vi-VN')} đ/kg</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-gray-400">Còn lại</p>
                                            <p className="font-semibold text-gray-800 dark:text-gray-200">{product.quantity} kg</p>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => handleBuyClick(product)}
                                        disabled={product.quantity === 0}
                                        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded transition disabled:bg-gray-400"
                                    >
                                        {product.quantity === 0 ? 'Hết hàng' : 'Mua Ngay'}
                                    </button>

                                    {product.season && (
                                        <div className="mt-3 text-center">
                                            <Link href={`/traceability/${(product as any).seasonId || '#'}`} className="text-xs text-blue-500 hover:underline flex items-center justify-center gap-1">
                                                🔍 Truy xuất nguồn gốc
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Buy Modal */}
            {showModal && selectedProduct && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-sm p-6">
                        <h2 className="text-xl font-bold mb-4">Đặt Mua: {selectedProduct.name}</h2>

                        <div className="mb-4">
                            <label className="block text-sm text-gray-600">Số lượng (kg):</label>
                            <input
                                type="number"
                                min="1"
                                max={selectedProduct.quantity}
                                value={buyQuantity}
                                onChange={(e) => setBuyQuantity(Number(e.target.value))}
                                className="w-full border rounded p-2 mt-1"
                            />
                            <p className="text-xs text-gray-400 mt-1">Tối đa: {selectedProduct.quantity} kg</p>
                        </div>

                        <div className="mb-6 flex justify-between font-bold text-lg">
                            <span>Tổng tiền:</span>
                            <span className="text-green-600">{(selectedProduct.price * buyQuantity).toLocaleString('vi-VN')} đ</span>
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={() => setShowModal(false)}
                                className="flex-1 bg-gray-200 text-gray-800 font-bold py-2 rounded hover:bg-gray-300"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={submitOrder}
                                disabled={buying || buyQuantity <= 0 || buyQuantity > selectedProduct.quantity}
                                className="flex-1 bg-green-600 text-white font-bold py-2 rounded hover:bg-green-700 disabled:opacity-50"
                            >
                                {buying ? 'Đang xử lý...' : 'Xác Nhận Mua'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function NavLink({ href, label, icon, highlight }: { href: string, label: string, icon?: string, highlight?: boolean }) {
    return (
        <Link href={href} className={`flex flex-col items-center hover:bg-green-700 px-2 py-1.5 rounded transition-colors group ${highlight ? 'text-yellow-300' : 'text-white'}`}>
            <span className={`text-xs font-bold uppercase tracking-wide whitespace-nowrap ${highlight ? 'text-yellow-300' : 'text-white'}`}>
                {icon && <span className="mr-1">{icon}</span>}
                {label}
            </span>
        </Link>
    );
}
