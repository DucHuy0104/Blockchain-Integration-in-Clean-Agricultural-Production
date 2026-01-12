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
            
            {/* HEADER BANNER - Enhanced */}
            <div className="bg-gradient-to-r from-[#388E3C] via-[#7CB342] to-[#00C853] text-white py-16 px-4 shadow-2xl mb-8 relative overflow-hidden">
                {/* Animated Background */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-float"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full mix-blend-overlay filter blur-2xl animate-float" style={{ animationDelay: '1s' }}></div>
                </div>
                
                {/* Back Button */}
                <Link href="/guest" className="absolute top-6 left-6 flex items-center gap-2 text-white/90 hover:text-white transition-all font-semibold z-10 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full hover:bg-white/20">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    <span>Quay lại</span>
                </Link>

                <div className="container mx-auto text-center relative z-10">
                    <div className="inline-block mb-4 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
                        <span className="text-sm font-semibold">🏪 Chợ Nông Sản</span>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-extrabold mb-4 drop-shadow-2xl animate-fadeInUp">Chợ Nông Sản Sạch BICAP</h1>
                    <p className="text-green-50 mb-10 text-lg md:text-xl max-w-2xl mx-auto animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
                        Kết nối trực tiếp từ Nông trại đến Bàn ăn. Minh bạch - An toàn - Chất lượng.
                    </p>
                    
                    <div className="max-w-2xl mx-auto relative animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
                        <div className="relative">
                            <input 
                                type="text" 
                                placeholder="Tìm kiếm nông sản, tên trang trại..."
                                className="w-full py-4 pl-6 pr-14 rounded-full text-gray-800 shadow-2xl focus:outline-none focus:ring-4 focus:ring-white/50 transition-all text-lg bg-white border-2 border-transparent focus:border-white/30" 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <button className="absolute right-2 top-2 bg-gradient-to-r from-[#388E3C] to-[#7CB342] hover:from-[#2E7D32] hover:to-[#388E3C] text-white p-3 rounded-full transition-all shadow-lg hover:scale-110 transform">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* NỘI DUNG CHÍNH */}
            <div className="container mx-auto px-4">
                
                {/* BỘ LỌC - Enhanced */}
                <div className="flex gap-3 overflow-x-auto pb-4 mb-8 justify-center scrollbar-hide">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-6 py-3 rounded-full font-bold transition-all duration-300 whitespace-nowrap border-2 transform hover:scale-105
                                ${selectedCategory === cat 
                                    ? "bg-gradient-to-r from-[#388E3C] to-[#7CB342] text-white border-transparent shadow-lg shadow-green-200" 
                                    : "bg-white text-gray-600 hover:bg-gray-50 border-gray-200 hover:border-[#7CB342] hover:text-[#388E3C]"}`}
                        >
                            <span className="flex items-center gap-2">
                                {cat === 'Rau củ' && '🥬'}
                                {cat === 'Trái cây' && '🍎'}
                                {cat === 'Củ quả' && '🥔'}
                                {cat === 'Tất cả' && '🌾'}
                                {cat}
                            </span>
                        </button>
                    ))}
                </div>

                {/* DANH SÁCH SẢN PHẨM */}
                {loading ? (
                    <div className="text-center py-20">
                        <div className="inline-block animate-pulse">
                            <div className="text-6xl mb-4">🌾</div>
                            <p className="text-gray-500 text-xl">Đang tải sản phẩm từ nông trại...</p>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {filteredProducts.length > 0 ? (
                            filteredProducts.map((product, index) => {
                                const isVegetable = product.name.toLowerCase().includes('rau') || 
                                                   product.name.toLowerCase().includes('cải') || 
                                                   product.name.toLowerCase().includes('cà');
                                const isFruit = product.name.toLowerCase().includes('dưa') || 
                                              product.name.toLowerCase().includes('dâu') || 
                                              product.name.toLowerCase().includes('cam');
                                const gradientClass = isVegetable 
                                    ? 'gradient-vegetable' 
                                    : isFruit 
                                    ? 'gradient-fruit' 
                                    : 'gradient-herb';
                                
                                return (
                                    <div 
                                        key={product.id} 
                                        className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 group flex flex-col card-hover animate-fadeInUp"
                                        style={{ animationDelay: `${index * 0.1}s` }}
                                    >
                                        {/* Product Image/Icon with Gradient Background */}
                                        <div className={`h-48 ${gradientClass} flex items-center justify-center text-7xl group-hover:scale-110 transition-transform duration-300 relative overflow-hidden`}>
                                            <div className="absolute inset-0 bg-black/5 group-hover:bg-black/10 transition-colors"></div>
                                            <div className="relative z-10 transform group-hover:rotate-6 transition-transform duration-300">
                                                {getProductIcon(product.name)}
                                            </div>
                                            
                                            {/* Certification Badge */}
                                            <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm text-[#388E3C] text-xs font-bold px-3 py-1.5 rounded-full shadow-lg border border-green-200 flex items-center gap-1">
                                                <span className="text-green-600">✓</span>
                                                {product.farm.certification || 'VietGAP'}
                                            </div>
                                            
                                            {/* New Badge (if needed) */}
                                            {index < 3 && (
                                                <div className="absolute top-3 left-3 bg-[#FFB300] text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg animate-pulse">
                                                    Mới
                                                </div>
                                            )}
                                        </div>
                                        
                                        <div className="p-5 flex-1 flex flex-col">
                                            {/* Farm Name */}
                                            <div className="text-xs text-gray-500 mb-2 flex items-center gap-1.5">
                                                <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                                </svg>
                                                <span className="font-medium">{product.farm.name}</span>
                                            </div>
                                            
                                            {/* Product Name */}
                                            <h3 className="text-lg font-bold text-gray-800 mb-3 line-clamp-2 group-hover:text-[#388E3C] transition-colors" title={product.name}>
                                                {product.name}
                                            </h3>
                                            
                                            {/* Price and Action */}
                                            <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center">
                                                <div>
                                                    <p className="text-[#388E3C] font-extrabold text-xl mb-1">
                                                        {product.price.toLocaleString('vi-VN')}đ
                                                    </p>
                                                    <p className="text-xs text-gray-500 flex items-center gap-1">
                                                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                                        </svg>
                                                        Còn: {product.quantity} kg
                                                    </p>
                                                </div>
                                                
                                                <button 
                                                    onClick={() => handleBuyClick(product)}
                                                    disabled={product.quantity <= 0}
                                                    className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 shadow-md btn-glow relative overflow-hidden
                                                        ${product.quantity > 0 
                                                            ? "bg-gradient-to-r from-[#388E3C] to-[#7CB342] hover:from-[#2E7D32] hover:to-[#388E3C] text-white transform hover:scale-105" 
                                                            : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
                                                >
                                                    <span className="relative z-10 flex items-center gap-1">
                                                        {product.quantity > 0 ? (
                                                            <>
                                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                                                </svg>
                                                                Mua Ngay
                                                            </>
                                                        ) : (
                                                            'Hết hàng'
                                                        )}
                                                    </span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="col-span-full text-center py-20 animate-fadeInUp">
                                <div className="text-8xl mb-6 animate-float">🥬</div>
                                <h3 className="text-2xl font-bold text-gray-600 mb-2">Không tìm thấy sản phẩm nào!</h3>
                                <p className="text-gray-500">Thử tìm kiếm với từ khóa khác hoặc chọn danh mục khác</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* MODAL MUA HÀNG - Enhanced */}
            {showModal && selectedProduct && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 transform transition-all scale-100 animate-scaleIn relative overflow-hidden">
                        {/* Decorative gradient background */}
                        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-br from-[#7CB342] to-[#388E3C] opacity-10"></div>
                        
                        {/* Close Button */}
                        <button 
                            onClick={() => setShowModal(false)} 
                            className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-full"
                        >
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        <div className="relative z-10">
                            {/* Header */}
                            <div className="text-center mb-6">
                                <div className="inline-block p-4 bg-gradient-to-br from-[#7CB342] to-[#388E3C] rounded-2xl mb-4 shadow-lg">
                                    <div className="text-6xl">{getProductIcon(selectedProduct.name)}</div>
                                </div>
                                <h2 className="text-2xl font-extrabold text-gray-800 mb-2">Đặt Mua Nông Sản</h2>
                                <h3 className="font-bold text-lg text-[#388E3C] mb-1">{selectedProduct.name}</h3>
                                <p className="text-gray-500 text-sm flex items-center justify-center gap-1">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                    </svg>
                                    {selectedProduct.farm.name}
                                </p>
                            </div>

                            <div className="mb-6 space-y-4">
                                {/* Quantity Input */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                                        <svg className="w-4 h-4 text-[#388E3C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                        </svg>
                                        Số lượng (kg):
                                    </label>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => setBuyQuantity(Math.max(1, buyQuantity - 1))}
                                            disabled={buyQuantity <= 1}
                                            className="w-10 h-10 rounded-lg border-2 border-gray-300 hover:border-[#388E3C] hover:bg-[#388E3C] hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center font-bold"
                                        >
                                            −
                                        </button>
                                        <input
                                            type="number"
                                            min="1"
                                            max={selectedProduct.quantity}
                                            value={buyQuantity}
                                            onChange={(e) => setBuyQuantity(Math.max(1, Math.min(selectedProduct.quantity, Number(e.target.value))))}
                                            className="flex-1 p-3 text-center border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#388E3C] focus:border-[#388E3C] font-bold text-lg"
                                        />
                                        <button
                                            onClick={() => setBuyQuantity(Math.min(selectedProduct.quantity, buyQuantity + 1))}
                                            disabled={buyQuantity >= selectedProduct.quantity}
                                            className="w-10 h-10 rounded-lg border-2 border-gray-300 hover:border-[#388E3C] hover:bg-[#388E3C] hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center font-bold"
                                        >
                                            +
                                        </button>
                                    </div>
                                    <p className="text-xs text-right text-gray-500 mt-2 flex items-center justify-end gap-1">
                                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Trong kho còn: <span className="font-bold text-[#388E3C]">{selectedProduct.quantity} kg</span>
                                    </p>
                                </div>

                                {/* Total Price */}
                                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border-2 border-green-200">
                                    <div className="flex justify-between items-center">
                                        <span className="font-semibold text-gray-700 flex items-center gap-2">
                                            <svg className="w-5 h-5 text-[#388E3C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            Tổng thanh toán:
                                        </span>
                                        <span className="text-2xl font-extrabold text-[#388E3C]">
                                            {(selectedProduct.price * buyQuantity).toLocaleString('vi-VN')} đ
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 bg-gray-100 text-gray-700 font-bold py-3.5 rounded-xl hover:bg-gray-200 transition-all border-2 border-transparent hover:border-gray-300"
                                >
                                    Hủy bỏ
                                </button>
                                <button
                                    onClick={submitOrder}
                                    disabled={buying || buyQuantity <= 0 || buyQuantity > selectedProduct.quantity}
                                    className="flex-1 bg-gradient-to-r from-[#388E3C] to-[#7CB342] text-white font-bold py-3.5 rounded-xl hover:from-[#2E7D32] hover:to-[#388E3C] transition-all disabled:opacity-50 shadow-lg shadow-green-200 btn-glow relative overflow-hidden"
                                >
                                    <span className="relative z-10 flex items-center justify-center gap-2">
                                        {buying ? (
                                            <>
                                                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Đang xử lý...
                                            </>
                                        ) : (
                                            <>
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                Xác Nhận Mua
                                            </>
                                        )}
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}