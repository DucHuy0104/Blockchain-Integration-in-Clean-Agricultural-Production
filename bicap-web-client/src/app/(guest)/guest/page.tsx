"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function GuestDashboard() {
  const [lotCode, setLotCode] = useState("");
  const router = useRouter();

  const handleTrace = () => {
    if (!lotCode.trim()) return alert("Vui lòng nhập mã lô hàng!");
    router.push(`/traceability/${lotCode}`);
  };

  const newsItems = [
    {
      id: 1,
      title: "Hội thảo Nông nghiệp 4.0 tại Đà Lạt",
      date: "05/02/2026",
      tag: "Sự kiện",
      icon: "🎤",
      color: "blue"
    },
    {
      id: 2,
      title: "Cập nhật tiêu chuẩn VietGAP mới nhất 2026",
      date: "01/02/2026",
      tag: "Thông báo",
      icon: "📜",
      color: "green"
    },
    {
      id: 3,
      title: "Ra mắt tính năng Truy xuất nguồn gốc bằng Video",
      date: "28/01/2026",
      tag: "Cập nhật",
      icon: "📹",
      color: "purple"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 font-sans">

      {/* BANNER - Ultra Enhanced */}
      <div className="bg-gradient-to-br from-[#1B5E20] via-[#388E3C] to-[#66BB6A] text-white py-24 text-center shadow-2xl relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-white/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="inline-block mb-6 px-6 py-2 bg-white/20 backdrop-blur-md rounded-full border border-white/30 shadow-lg animate-fadeInDown">
            <span className="text-sm font-bold flex items-center gap-2">
              <span className="animate-bounce">🌿</span>
              BICAP Platform • Hệ Thống Nông Nghiệp Minh Bạch
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight drop-shadow-lg animate-fadeInUp">
            Kiến Tạo Niềm Tin <br /> <span className="text-green-300">Từ Nông Trại</span>
          </h1>
          <p className="text-green-50 max-w-2xl mx-auto text-lg md:text-xl font-medium leading-relaxed animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
            Kết nối trực tiếp người dùng với quy trình canh tác sạch,
            đảm bảo an toàn thực phẩm thông qua công nghệ Blockchain hiện đại.
          </p>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="container mx-auto px-4 py-16 -mt-16 relative z-10">
        <div className="grid lg:grid-cols-3 gap-8">

          {/* LATEST NEWS & NOTIFICATIONS (MỚI) */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100 h-full flex flex-col hover:shadow-2xl transition-all">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-black text-gray-800 flex items-center gap-2">
                  <span className="text-3xl">🔔</span>
                  Thông báo
                </h3>
                <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-xs font-bold animate-pulse">
                  Mới nhất
                </span>
              </div>

              <div className="space-y-6 flex-1">
                {newsItems.map((news) => (
                  <div key={news.id} className="group cursor-pointer hover:bg-gray-50 p-4 rounded-2xl transition-all border border-transparent hover:border-gray-100">
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 bg-${news.color}-100 rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform`}>
                        {news.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <span className={`text-[10px] font-bold uppercase tracking-widest text-${news.color}-600`}>
                            {news.tag}
                          </span>
                          <span className="text-[10px] text-gray-400 font-bold">{news.date}</span>
                        </div>
                        <h4 className="text-sm font-bold text-gray-800 line-clamp-2 leading-snug group-hover:text-green-700 transition-colors">
                          {news.title}
                        </h4>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button className="mt-8 w-full py-4 border-2 border-dashed border-gray-300 rounded-2xl text-gray-500 font-bold hover:border-green-500 hover:text-green-600 transition-all flex items-center justify-center gap-2">
                <span>Xem tất cả bản tin</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          </div>

          {/* MAIN ACTIONS (TRUY XUẤT & CHỢ) */}
          <div className="lg:col-span-2 space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* CARD: CHỢ NÔNG SẢN */}
              <Link href="/market" className="group h-full">
                <div className="bg-white p-8 rounded-[2.5rem] shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 h-full flex flex-col relative overflow-hidden">
                  <div className="absolute -right-8 -bottom-8 text-9xl opacity-5 group-hover:scale-110 group-hover:-rotate-12 transition-transform">🛒</div>
                  <div className="bg-gradient-to-br from-[#7CB342] to-[#388E3C] w-20 h-20 rounded-2xl flex items-center justify-center text-4xl mb-6 shadow-lg group-hover:rotate-6 transition-transform">
                    🛒
                  </div>
                  <h3 className="text-2xl font-black text-gray-800 mb-4 group-hover:text-[#388E3C] transition-colors">Chợ Nông Sản</h3>
                  <p className="text-gray-600 mb-8 leading-relaxed font-medium">
                    Khám phá hàng ngàn sản phẩm đạt chuẩn VietGAP từ các nông trại uy tín.
                    Lọc sản phẩm theo địa điểm, loại hình và chứng nhận.
                  </p>
                  <div className="mt-auto flex items-center justify-between">
                    <span className="text-[#388E3C] font-black flex items-center gap-2">
                      Truy cập ngay
                      <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </span>
                    <div className="flex -space-x-3">
                      <div className="w-10 h-10 rounded-full border-2 border-white bg-green-100 flex items-center justify-center text-xs shadow-sm">🥦</div>
                      <div className="w-10 h-10 rounded-full border-2 border-white bg-red-100 flex items-center justify-center text-xs shadow-sm">🍎</div>
                      <div className="w-10 h-10 rounded-full border-2 border-white bg-blue-100 flex items-center justify-center text-xs shadow-sm">+50</div>
                    </div>
                  </div>
                </div>
              </Link>

              {/* CARD: KIẾN THỨC */}
              <Link href="/guest/education" className="group h-full">
                <div className="bg-white p-8 rounded-[2.5rem] shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 h-full flex flex-col relative overflow-hidden">
                  <div className="absolute -right-8 -bottom-8 text-9xl opacity-5 group-hover:scale-110 group-hover:-rotate-12 transition-transform">📖</div>
                  <div className="bg-gradient-to-br from-[#00C853] to-[#7CB342] w-20 h-20 rounded-2xl flex items-center justify-center text-4xl mb-6 shadow-lg group-hover:rotate-6 transition-transform">
                    📖
                  </div>
                  <h3 className="text-2xl font-black text-gray-800 mb-4 group-hover:text-[#388E3C] transition-colors">Thư Viện Nhà Nông</h3>
                  <p className="text-gray-600 mb-8 leading-relaxed font-medium">
                    Học tập các kỹ thuật canh tác bền vững, kiến thức về an toàn thực phẩm
                    và các ứng dụng công nghệ trong nông nghiệp thực tế.
                  </p>
                  <div className="mt-auto">
                    <span className="text-[#388E3C] font-black flex items-center gap-2">
                      Khám phá thư viện
                      <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </span>
                  </div>
                </div>
              </Link>
            </div>

            {/* BLOCKCHAIN TRACEABILITY (CHÍNH GIỮA) */}
            <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl border-4 border-green-50 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-green-50 rounded-full -mr-32 -mt-32 opacity-50"></div>
              <div className="relative z-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                  <div className="md:w-1/2">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-2xl shadow-inner">
                        🔍
                      </div>
                      <h3 className="text-3xl font-black text-gray-800">Truy Xuất Nguồn Gốc</h3>
                    </div>
                    <p className="text-gray-500 font-medium leading-relaxed">
                      Nhập mã vận đơn hoặc mã lô hàng để xem toàn bộ hành trình của sản phẩm
                      được bảo chứng bởi công nghệ Blockchain.
                    </p>
                  </div>
                  <div className="md:w-1/2 space-y-4">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Nhập mã (VD: SHIPMENT_1)..."
                        className="w-full bg-gray-50 border-2 border-gray-100 p-5 rounded-2xl focus:ring-4 focus:ring-green-100 focus:bg-white focus:border-green-500 outline-none transition-all font-bold text-lg pr-16"
                        value={lotCode}
                        onChange={(e) => setLotCode(e.target.value)}
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2">
                        <span className="text-2xl">🔗</span>
                      </div>
                    </div>
                    <button
                      onClick={handleTrace}
                      className="w-full bg-gradient-to-r from-[#1B5E20] to-[#388E3C] text-white font-black py-5 rounded-2xl hover:shadow-2xl hover:shadow-green-200 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
                    >
                      <span className="text-xl">🚀</span>
                      TRUY XUẤT NGAY
                    </button>
                    <p className="text-center text-xs text-gray-400 font-bold tracking-widest uppercase">
                      DỮ LIỆU ĐƯỢC BẢO CHỨNG BỞI VECHAIN BLOCKCHAIN
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* EDUCATIONAL VIDEO SECTION (THÊM MỚI) */}
      <div className="bg-gray-900 py-24 text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-30"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-6">Trải Nghiệm Trực Quan</h2>
            <p className="text-xl text-gray-400 font-medium">
              Không chỉ là dữ liệu, chúng tôi mang đến cái nhìn chân thực nhất về nông nghiệp bền vững qua các video tư liệu.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="group cursor-pointer">
                <div className="aspect-video bg-gray-800 rounded-3xl mb-6 relative overflow-hidden shadow-2xl">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center group-hover:scale-125 transition-transform duration-500 group-hover:bg-green-500">
                      <svg className="w-8 h-8 text-white fill-current" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                  <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-lg text-xs font-bold">
                    04:2{i}
                  </div>
                </div>
                <h4 className="text-xl font-bold mb-2 group-hover:text-green-400 transition-colors">
                  Quy trình chăm sóc rau hữu cơ tại {i === 1 ? 'Đà Lạt' : i === 2 ? 'Sa Pa' : 'Hà Nội'}
                </h4>
                <p className="text-gray-500 text-sm font-medium italic">Sản xuất bởi BICAP Media</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out forwards;
        }
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeInDown {
          animation: fadeInDown 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
