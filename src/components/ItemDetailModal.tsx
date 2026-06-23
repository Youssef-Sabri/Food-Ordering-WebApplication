"use client";

import { X, Plus, Minus, ShoppingCart, Star } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCart } from "@/contexts/CartContext";
import { Product } from "@/lib/types";
import { CATEGORY_LABELS, formatPrice } from "@/lib/constants";

interface ItemDetailModalProps {
  product: Product;
  onClose: () => void;
}

export default function ItemDetailModal({ product, onClose }: ItemDetailModalProps) {
  const { lang, dir } = useLanguage();
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        nameEn: product.nameEn,
        nameAr: product.nameAr,
        price: product.price,
        image: product.image,
      });
    }
    setAdded(true);
    setTimeout(() => { onClose(); }, 400);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-fadeIn" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden animate-scaleIn"
          dir={dir}
        >
          <div className="relative">
            <div className="h-52 bg-gray-100 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={product.image}
                alt={lang === "en" ? product.nameEn : product.nameAr}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
            <button
              onClick={onClose}
              className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors shadow-sm"
            >
              <X size={16} />
            </button>
            <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-xs font-semibold text-gray-700 px-3 py-1 rounded-full">
              {lang === "en" ? CATEGORY_LABELS[product.category]?.en : CATEGORY_LABELS[product.category]?.ar}
            </span>
          </div>

          <div className="p-5 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {lang === "en" ? product.nameEn : product.nameAr}
                </h2>
                <div className="flex items-center gap-1 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={12} className="fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-xl font-bold text-orange-600">{formatPrice(product.price, lang)}</p>
              </div>
            </div>

            <p className="text-gray-500 text-sm leading-relaxed">
              {lang === "en" ? product.descriptionEn : product.descriptionAr}
            </p>

            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  <Minus size={16} />
                </button>
                <span className="font-bold text-lg w-8 text-center tabular-nums">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>

              <button
                onClick={handleAdd}
                disabled={added}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 ${
                  added
                    ? "bg-green-500 text-white scale-95"
                    : "bg-orange-600 text-white hover:bg-orange-700 hover:shadow-lg hover:shadow-orange-200"
                }`}
              >
                <ShoppingCart size={16} className={added ? "animate-bounce" : ""} />
                {added
                  ? (lang === "en" ? "Added!" : "تمت الإضافة!")
                  : `${lang === "en" ? "Add to Cart" : "أضف إلى السلة"}`}
              </button>
            </div>
          </div>
        </div>
      </div>


    </>
  );
}
