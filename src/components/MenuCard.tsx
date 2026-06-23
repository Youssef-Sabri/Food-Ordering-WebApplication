"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { Product } from "@/lib/types";
import { CATEGORY_LABELS, formatPrice } from "@/lib/constants";

interface MenuCardProps {
  product: Product;
  onViewDetails: (product: Product) => void;
}

export default function MenuCard({ product, onViewDetails }: MenuCardProps) {
  const { lang, dir } = useLanguage();

  return (
    <button
      onClick={() => onViewDetails(product)}
      className="group bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg hover:border-orange-200/50 transition-all duration-300 text-left w-full"
      dir={dir}
    >
      <div className="relative h-40 bg-gray-100 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.image}
          alt={lang === "en" ? product.nameEn : product.nameAr}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
        <span className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm text-[10px] font-semibold text-gray-700 px-2 py-0.5 rounded-full">
          {lang === "en" ? CATEGORY_LABELS[product.category]?.en : CATEGORY_LABELS[product.category]?.ar}
        </span>
      </div>
      <div className="p-3.5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-sm text-gray-900 leading-snug line-clamp-1">
            {lang === "en" ? product.nameEn : product.nameAr}
          </h3>
        </div>
        <p className="text-xs text-gray-400 mt-1 line-clamp-2 leading-relaxed">
          {lang === "en" ? product.descriptionEn : product.descriptionAr}
        </p>
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
          <span className="text-orange-600 font-bold text-sm">{formatPrice(product.price, lang)}</span>
          <span className="text-[11px] font-medium text-orange-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {lang === "en" ? "+ Quick Add" : "+ إضافة سريعة"}
          </span>
        </div>
      </div>
    </button>
  );
}
