"use client";

import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, removeItem, updateQuantity, subtotal, totalItems } = useCart();
  const { lang } = useLanguage();
  const { user } = useAuth();
  const router = useRouter();

  const handleCheckout = () => {
    onClose();
    if (!user) {
      router.push("/login");
      return;
    }
    router.push("/checkout");
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
      />
      <div
        className={`fixed top-0 ${lang === "ar" ? "left-0" : "right-0"} h-full w-full max-w-sm bg-white z-50 shadow-2xl transform transition-transform duration-300 ${isOpen ? "translate-x-0" : lang === "ar" ? "-translate-x-full" : "translate-x-full"}`}
        dir={lang === "ar" ? "rtl" : "ltr"}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <ShoppingBag size={18} className="text-orange-600" />
              <h2 className="text-base font-semibold">
                {lang === "en" ? "Your Cart" : "سلة التسوق"}
              </h2>
              {totalItems > 0 && (
                <span className="bg-orange-100 text-orange-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                  {totalItems}
                </span>
              )}
            </div>
            <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
              <X size={18} />
            </button>
          </div>

          {items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 gap-3">
              <ShoppingBag size={40} className="text-gray-200" />
              <p className="text-sm">{lang === "en" ? "Your cart is empty" : "سلة التسوق فارغة"}</p>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 bg-gray-50/80 p-3 rounded-xl border border-gray-100/50"
                  >
                    <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.image}
                        alt={lang === "en" ? item.nameEn : item.nameAr}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium truncate text-gray-900">
                        {lang === "en" ? item.nameEn : item.nameAr}
                      </h3>
                      <p className="text-sm font-semibold text-orange-600 mt-0.5">
                        {item.price} EGP
                      </p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-0.5 bg-white border border-gray-200 hover:bg-gray-100 rounded transition-colors"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="text-sm font-medium w-5 text-center tabular-nums">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-0.5 bg-white border border-gray-200 hover:bg-gray-100 rounded transition-colors"
                        >
                          <Plus size={12} />
                        </button>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-0.5 hover:bg-red-50 rounded ml-auto text-gray-300 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 p-4 space-y-3 bg-gray-50/50">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">{lang === "en" ? "Subtotal" : "المجموع الفرعي"}</span>
                  <span className="font-bold text-gray-900">{subtotal.toFixed(2)} EGP</span>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>{lang === "en" ? "Delivery fee" : "رسوم التوصيل"}</span>
                  <span className="text-green-600 font-medium">{lang === "en" ? "Free" : "مجاني"}</span>
                </div>
                <button
                  onClick={handleCheckout}
                  className="w-full bg-orange-600 text-white py-3 rounded-xl font-semibold text-sm hover:bg-orange-700 transition-colors shadow-lg shadow-orange-200 flex items-center justify-center gap-2"
                >
                  {lang === "en" ? "Checkout" : "الدفع"}
                  <ArrowRight size={16} />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
