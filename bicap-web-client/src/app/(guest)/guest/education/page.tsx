"use client";
import React from "react";
import Link from "next/link";

export const MOCK_ARTICLES = [
  { 
    id: 1, 
    title: "Kỹ thuật Canh tác Nông nghiệp Bền vững 4.0", 
    category: "Nông nghiệp",
    summary: "Tìm hiểu cách tối ưu năng suất thông qua hệ thống tưới tiêu và quản lý đất đai hiện đại.",
    content: `Nông nghiệp bền vững không chỉ là việc trồng trọt mà là một hệ sinh thái khép kín. 
    
    1. Quản lý đất đai: Việc sử dụng phân bón hữu cơ kết hợp với luân canh cây trồng giúp duy trì độ phì nhiêu của đất, tránh tình trạng bạc màu sau mỗi vụ thu hoạch. 
    2. Hệ thống tưới tiêu Israel: Áp dụng công nghệ tưới nhỏ giọt giúp tiết kiệm 70% lượng nước nhưng vẫn đảm bảo cây trồng nhận đủ độ ẩm cần thiết tại bộ rễ. 
    3. Kiểm soát dịch hại: Thay vì dùng thuốc hóa học, chúng ta chuyển sang dùng thiên địch và các loại thuốc sinh học tự chế từ thảo mộc để đảm bảo sản phẩm đạt tiêu chuẩn an toàn tuyệt đối. 
    4. Tầm nhìn dài hạn: Canh tác bền vững giúp bảo vệ nguồn nước ngầm và đa dạng sinh học cho các thế hệ tương lai.`
  },
  { 
    id: 2, 
    title: "Ứng dụng Blockchain trong Chuỗi cung ứng Thực phẩm", 
    category: "Công nghệ",
    summary: "Giải pháp minh bạch hóa nguồn gốc nông sản từ trang trại đến bàn ăn bằng sổ cái phi tập trung.",
    content: `Blockchain là 'chìa khóa vàng' để xây dựng niềm tin giữa nông dân và người tiêu dùng. 

    - Tính minh bạch: Mỗi sản phẩm khi ra đời sẽ được gán một ID duy nhất trên hệ thống Blockchain. Mọi dữ liệu về ngày gieo hạt, loại phân bón sử dụng, ngày thu hoạch đều được ghi lại.
    - Không thể sửa đổi: Một khi dữ liệu đã được đưa vào sổ cái Blockchain, không ai có thể can thiệp hay làm giả thông tin. Điều này loại bỏ hoàn toàn tình trạng 'treo đầu dê bán thịt chó'.
    - Truy xuất nguồn gốc tức thời: Chỉ với một thao tác quét mã QR, người tiêu dùng có thể biết chính xác miếng thịt hay bó rau mình đang cầm trên tay đến từ trang trại nào, do ai trồng và vận chuyển như thế nào.
    - Lợi ích kinh tế: Việc minh bạch hóa giúp nông sản dễ dàng tiếp cận các thị trường khó tính như Châu Âu, Nhật Bản với giá thành cao hơn.`
  },
  { 
    id: 3, 
    title: "Tiêu chuẩn VietGAP và Quy trình Kiểm định An toàn", 
    category: "An toàn",
    summary: "Chi tiết các quy định về vệ sinh, an toàn và quy trình để một trang trại đạt chuẩn quốc gia.",
    content: `Để đạt được chứng chỉ VietGAP, người sản xuất phải tuân thủ nghiêm ngặt 4 tiêu chí chính:

    1. Tiêu chuẩn về kỹ thuật sản xuất: Từ việc chọn đất, nguồn nước cho đến con giống đều phải được kiểm định sạch, không ô nhiễm.
    2. An toàn thực phẩm: Không được phép có dư lượng thuốc bảo vệ thực vật hay kim loại nặng vượt mức cho phép. Các hồ sơ sử dụng thuốc phải được ghi chép hàng ngày.
    3. Môi trường làm việc: Đảm bảo sức khỏe cho người lao động, có khu vực vệ sinh, thay đồ riêng biệt và bảo hộ lao động đầy đủ.
    4. Truy tìm nguồn gốc sản phẩm: Quy trình này cho phép xác định chính xác các vấn đề xảy ra trong toàn bộ khâu sản xuất, chế biến và phân phối. Việc áp dụng VietGAP giúp giảm chi phí sản xuất và tăng tính cạnh tranh cho nông sản Việt.`
  }
];

export default function EducationPage() {
  return (
    <div className="p-10 max-w-7xl mx-auto bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-extrabold text-green-800 mb-10 text-center">📚 Thư Viện Nhà Nông</h1>
      
      <div className="grid md:grid-cols-3 gap-8">
        {MOCK_ARTICLES.map((item) => (
          <div key={item.id} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-xl transition-all duration-300">
            <div>
              <span className="text-green-500 font-bold text-xs tracking-widest mb-4 block">{item.category}</span>
              <h3 className="text-2xl font-bold text-gray-800 mb-4 leading-snug">{item.title}</h3>
              <p className="text-gray-500 mb-8 leading-relaxed text-sm">{item.summary}</p>
            </div>
            <Link href={`/guest/education/${item.id}`}>
              <button className="w-full bg-green-600 text-white font-bold py-3 rounded-xl hover:bg-green-700 transition">
                Đọc Chi Tiết
              </button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}