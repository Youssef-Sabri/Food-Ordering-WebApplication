"use client";

import { useState, useEffect, useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import MenuCard from "@/components/MenuCard";
import ItemDetailModal from "@/components/ItemDetailModal";
import EmptyState from "@/components/EmptyState";
import { Product, Category } from "@/lib/types";
import { Search, Sparkles, ChevronDown } from "lucide-react";

export default function HomePage() {
  const { lang, dir } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const categoryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (categoryRef.current && !categoryRef.current.contains(e.target as Node)) {
        setCategoryOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data.categories));
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    if (activeCategory !== "All") params.set("category", activeCategory);
    if (search) params.set("search", search);

    fetch(`/api/products?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => setProducts(data.products));
  }, [activeCategory, search]);

  return (
    <div dir={dir}>
      <section className="relative bg-gradient-to-br from-orange-50 via-amber-50 to-white overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute top-10 left-10 w-72 h-72 bg-orange-400 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-amber-400 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 py-16 md:py-28">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 bg-orange-100 text-orange-700 text-xs font-semibold px-3 py-1 rounded-full mb-5">
              <Sparkles size={12} />
              {lang === "en" ? "Now delivering in your area" : "نوصل الآن في منطقتك"}
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-[1.1] tracking-tight">
              {lang === "en" ? (
                <>
                  Delicious Food,
                  <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-500">Delivered Fresh</span>
                </>
              ) : (
                <>
                  طعام لذيذ،
                  <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-500">يوصلك طازجًا</span>
                </>
              )}
            </h1>
            <p className="mt-4 text-lg md:text-xl text-gray-500 leading-relaxed max-w-lg">
              {lang === "en"
                ? "Order from our wide selection of meals and enjoy restaurant-quality food at home."
                : "اطلب من مجموعتنا الواسعة من الوجبات واستمتع بطعام بجودة المطاعم في منزلك."}
            </p>

            <div className="relative mt-8 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={lang === "en" ? "Search for food..." : "ابحث عن طعام..."}
                className="w-full pl-12 pr-4 py-3.5 bg-white border border-orange-200/50 rounded-xl shadow-lg shadow-orange-100/30 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-base"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 pb-20">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              {lang === "en" ? "Our Menu" : "قائمة الطعام"}
            </h2>
            <p className="text-gray-400 mt-1.5">
              {lang === "en"
                ? "Choose from our selection of freshly prepared dishes"
                : "اختر من بين أطباقنا المعدة طازجًا"}
            </p>
          </div>
        </div>

        <div className="mb-8 relative w-full md:w-64" ref={categoryRef}>
          <button
            onClick={() => setCategoryOpen(!categoryOpen)}
            className="w-full flex items-center justify-between px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:border-orange-300 transition-colors shadow-sm"
          >
            <span>{activeCategory === "All" ? (lang === "en" ? "All Categories" : "جميع الفئات") : (lang === "en" ? categories.find((c) => c.nameEn === activeCategory)?.nameEn : categories.find((c) => c.nameEn === activeCategory)?.nameAr)}</span>
            <ChevronDown size={14} className={`text-gray-400 transition-transform duration-200 ${categoryOpen ? "rotate-180" : ""}`} />
          </button>
          {categoryOpen && (
            <div className="absolute left-0 top-full mt-1.5 w-full bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-20 animate-fadeIn overflow-hidden">
              <button
                onClick={() => { setActiveCategory("All"); setCategoryOpen(false); }}
                className={`w-full text-left px-4 py-2 text-sm font-medium flex items-center gap-2 transition-colors ${
                  activeCategory === "All" ? "bg-orange-50 text-orange-700" : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                {lang === "en" ? "All Categories" : "جميع الفئات"}
                {activeCategory === "All" && (
                  <svg className="w-3.5 h-3.5 text-orange-600 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.nameEn}
                  onClick={() => { setActiveCategory(cat.nameEn); setCategoryOpen(false); }}
                  className={`w-full text-left px-4 py-2 text-sm font-medium flex items-center gap-2 transition-colors ${
                    activeCategory === cat.nameEn ? "bg-orange-50 text-orange-700" : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {lang === "en" ? cat.nameEn : cat.nameAr}
                  {activeCategory === cat.nameEn && (
                    <svg className="w-3.5 h-3.5 text-orange-600 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
          {products.map((product) => (
            <MenuCard
              key={product.id}
              product={product}
              onViewDetails={setSelectedProduct}
            />
          ))}
        </div>

        {products.length === 0 && (
          <EmptyState
            icon={Search}
            message={lang === "en" ? "No items found" : "لا توجد عناصر"}
            action={{ label: lang === "en" ? "Clear filters" : "مسح التصفية", onClick: () => { setSearch(""); setActiveCategory("All"); } }}
          />
        )}
      </section>

      {selectedProduct && (
        <ItemDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}
