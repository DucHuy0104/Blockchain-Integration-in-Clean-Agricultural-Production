"use client";
import React from "react";
import { useParams, useRouter } from "next/navigation";
import { MOCK_ARTICLES } from "../page";

export default function ArticleDetail() {
  const { id } = useParams();
  const router = useRouter();
  const article = MOCK_ARTICLES.find(a => a.id === Number(id));

  if (!article) return <div className="p-20 text-center font-bold">⚠️ Bài viết không tồn tại.</div>;

  return (
    <div className="max-w-4xl mx-auto p-8 md:p-16 bg-white shadow-2xl mt-10 mb-20 rounded-[40px] border border-gray-50">
      <button 
        onClick={() => router.back()}
        className="mb-10 text-green-600 font-bold flex items-center gap-2 hover:translate-x-[-5px] transition-transform"
      >
        ← Quay lại danh sách
      </button>
      
      <div className="mb-12">
        <span className="bg-green-100 text-green-700 text-sm font-black px-4 py-2 rounded-full uppercase tracking-tighter">
          {article.category}
        </span>
        <h1 className="text-5xl font-black text-gray-900 mt-6 leading-tight">
          {article.title}
        </h1>
        <div className="h-2 w-24 bg-green-500 mt-8 rounded-full"></div>
      </div>
      
      {/* whitespace-pre-line giúp giữ các khoảng xuống dòng bạn viết ở trên */}
      <div className="text-gray-700 text-xl leading-loose whitespace-pre-line space-y-6">
        {article.content}
      </div>

      <div className="mt-20 p-8 bg-gray-50 rounded-3xl text-center border-dashed border-2 border-gray-200">
        <p className="text-gray-500 italic font-medium">
          Cảm ơn bạn đã theo dõi bài viết. Hãy áp dụng những kiến thức này vào trang trại của mình để cùng BICAP phát triển nông nghiệp Việt Nam!
        </p>
      </div>
    </div>
  );
}