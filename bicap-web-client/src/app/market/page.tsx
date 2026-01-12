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

// Hàm lấy icon tự động
const getProductIcon = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('cà chua')) return '🍅';
    if (n.includes('dưa')) return '🍈';
    if (n.includes('gạo') || n.includes('lúa')) return '🍚';
    if (n.includes('rau') || n.includes('xà lách') || n.includes('cải')) return '🥬';
    if (n.includes('dâu')) return '🍓';
    if (n.includes('khoai')) return '🥔';
    if (n.includes('bắp') || n.includes('ngô')) return '🌽';
    if (n.includes('nấm')) return '🍄';
    if (n.includes('cà rốt')) return '🥕';
    return '🌾';
};

export default function MarketplacePage() {
    const { user } = useAuth();
    const router = useRouter();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Tất cả');

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

    const filteredProducts = products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              p.farm.name.toLowerCase().includes(searchTerm.toLowerCase());
        
        let matchesCategory = true;
        if (selectedCategory === 'Rau củ') matchesCategory = p.name.toLowerCase().includes('rau') || p.name.toLowerCase().includes('cải') || p.name.toLowerCase().includes('cà');
        if (selectedCategory === 'Trái cây') matchesCategory = p.name.toLowerCase().includes('dưa') || p.name.toLowerCase().includes('dâu') || p.name.toLowerCase().includes('cam');
        if (selectedCategory === 'Củ quả') matchesCategory = p.name.toLowerCase().includes('khoai') || p.name.toLowerCase().includes('sắn');

        return matchesSearch && matchesCategory;
    });

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
            const res = await axios.get('http://localhost:5001/api/products');
            setProducts(res.data);

        } catch (error: any) {
            console.error(error);
            alert(error.response?.data?.message || 'Có lỗi xảy ra khi đặt hàng');
        } finally {
            setBuying(false);
        }
    };

    const categories = ["Tất cả", "Rau củ", "Trái cây", "Củ quả"];

    return (
        <div className="min-h-screen bg-gray-50 font-sans pb-20">
            
            {/* HEADER BANNER */}
            <div className="bg-green-700 text-white py-12 px-4 shadow-lg mb-8 relative">
                
                {/* --- NÚT QUAY LẠI --- */}
                <Link href="/guest" className="absolute top-6 left-6 flex items-center text-green-100 hover:text-white transition font-bold z-10">
                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Quay lại
                </Link>
                {/* ------------------- */}

                <div className="container mx-auto text-center">
                    <h1 className="text-4xl font-extrabold mb-3">Chợ Nông Sản Sạch BICAP</h1>
                    <p className="text-green-100 mb-8 text-lg">Kết nối trực tiếp từ Nông trại đến Bàn ăn. Minh bạch - An toàn.</p>
                    
                    <div className="max-w-2xl mx-auto relative">
                        {/* --- Ô INPUT ĐÃ CÓ bg-white --- */}
                        <input 
                            type="text" 
                            placeholder="Tìm kiếm nông sản, tên trang trại..."
                            className="w-full py-4 pl-6 pr-12 rounded-full text-gray-800 shadow-2xl focus:outline-none focus:ring-4 focus:ring-green-400 transition-all text-lg bg-white" 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button className="absolute right-2 top-2 bg-green-600 hover:bg-green-800 text-white p-2.5 rounded-full transition shadow-md">
                            🔍
                        </button>
                    </div>
                </div>
            </div>

            {/* NỘI DUNG CHÍNH */}
            <div className="container mx-auto px-4">
                
                {/* BỘ LỌC */}
                <div className="flex gap-3 overflow-x-auto pb-4 mb-8 justify-center">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-6 py-2 rounded-full font-bold transition whitespace-nowrap border
                                ${selectedCategory === cat 
                                    ? "bg-green-600 text-white border-green-600 shadow-md" 
                                    : "bg-white text-gray-600 hover:bg-gray-100 border-gray-200"}`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* DANH SÁCH SẢN PHẨM */}
                {loading ? (
                    <div className="text-center py-20 text-gray-500 text-xl">Đang tải sản phẩm từ nông trại...</div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {filteredProducts.length > 0 ? (
                            filteredProducts.map((product) => (
                                <div key={product.id} className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition duration-300 overflow-hidden border border-gray-100 group flex flex-col">
                                    <div className="h-48 bg-gray-50 flex items-center justify-center text-7xl group-hover:scale-110 transition-transform relative">
                                        {getProductIcon(product.name)}
                                        <div className="absolute top-3 right-3 bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded shadow-sm">
                                            {product.farm.certification || 'VietGAP'}
                                        </div>
                                    </div>
                                    
                                    <div className="p-5 flex-1 flex flex-col">
                                        <div className="text-xs text-gray-400 mb-1 flex items-center gap-1">
                                            🏠 {product.farm.name}
                                        </div>
                                        
                                        <h3 className="text-lg font-bold text-gray-800 mb-1 line-clamp-1" title={product.name}>
                                            {product.name}
                                        </h3>
                                        
                                        <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center">
                                            <div>
                                                <p className="text-green-600 font-extrabold text-xl">
                                                    {product.price.toLocaleString()}đ
                                                </p>
                                                <p className="text-xs text-gray-400">
                                                    Còn: {product.quantity} kg
                                                </p>
                                            </div>
                                            
                                            <button 
                                                onClick={() => handleBuyClick(product)}
                                                disabled={product.quantity <= 0}
                                                className={`px-4 py-2 rounded-lg font-bold text-sm transition shadow-md
                                                    ${product.quantity > 0 
                                                        ? "bg-gray-900 hover:bg-green-600 text-white" 
                                                        : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
                                            >
                                                {product.quantity > 0 ? 'Mua Ngay' : 'Hết hàng'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full text-center py-20">
                                <div className="text-6xl mb-4">🥬</div>
                                <h3 className="text-xl font-bold text-gray-600">Không tìm thấy sản phẩm nào!</h3>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* MODAL MUA HÀNG */}
            {showModal && selectedProduct && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 transform transition-all scale-100">
                        <div className="flex justify-between items-center mb-4 border-b pb-2">
                            <h2 className="text-xl font-bold text-gray-800">Đặt Mua Nông Sản</h2>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-red-500 text-2xl">&times;</button>
                        </div>

                        <div className="mb-6 text-center">
                            <div className="text-5xl mb-2">{getProductIcon(selectedProduct.name)}</div>
                            <h3 className="font-bold text-lg text-green-700">{selectedProduct.name}</h3>
                            <p className="text-gray-500 text-sm">{selectedProduct.farm.name}</p>
                        </div>

                        <div className="mb-6 space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Số lượng (kg):</label>
                                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                                    <input
                                        type="number"
                                        min="1"
                                        max={selectedProduct.quantity}
                                        value={buyQuantity}
                                        onChange={(e) => setBuyQuantity(Number(e.target.value))}
                                        className="w-full p-3 text-center focus:outline-none font-bold text-lg"
                                    />
                                </div>
                                <p className="text-xs text-right text-gray-400 mt-1">Trong kho còn: {selectedProduct.quantity} kg</p>
                            </div>

                            <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-200">
                                <span className="font-medium text-gray-600">Tổng thanh toán:</span>
                                <span className="text-xl font-bold text-green-600">
                                    {(selectedProduct.price * buyQuantity).toLocaleString('vi-VN')} đ
                                </span>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowModal(false)}
                                className="flex-1 bg-gray-100 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-200 transition"
                            >
                                Hủy bỏ
                            </button>
                            <button
                                onClick={submitOrder}
                                disabled={buying || buyQuantity <= 0 || buyQuantity > selectedProduct.quantity}
                                className="flex-1 bg-green-600 text-white font-bold py-3 rounded-xl hover:bg-green-700 transition disabled:opacity-50 shadow-lg shadow-green-200"
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