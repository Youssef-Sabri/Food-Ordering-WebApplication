"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import MenuCard from "@/components/MenuCard";
import ItemDetailModal from "@/components/ItemDetailModal";
import { Search, Sparkles } from "lucide-react";

interface Product {
  id: string;
  nameEn: string;
  nameAr: string;
  descriptionEn: string;
  descriptionAr: string;
  category: string;
  price: number;
  image: string;
}

const categories = ["All", "Burgers", "Pizza", "Drinks", "Desserts"];

export default function HomePage() {
  const { lang } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    const params = new URLSearchParams();
    if (activeCategory !== "All") params.set("category", activeCategory);
    if (search) params.set("search", search);

    fetch(`/api/products?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => setProducts(data.products));
  }, [activeCategory, search]);

  const filteredProducts = products.filter((p) => {
    if (activeCategory !== "All" && p.category !== activeCategory) return false;
    if (search) {
      const q = search.toLowerCase();
      return p.nameEn.toLowerCase().includes(q) || p.nameAr.includes(q);
    }
    return true;
  });



  return (
    <div dir={lang === "ar" ? "rtl" : "ltr"}>
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

        <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 flex-shrink-0 ${
                activeCategory === cat
                  ? "bg-orange-600 text-white shadow-lg shadow-orange-200 scale-105"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-orange-300 hover:text-orange-600 hover:bg-orange-50/50"
              }`}
            >
              {lang === "en"
                ? cat
                : cat === "All"
                ? "الكل"
                : cat === "Burgers"
                ? "برجر"
                : cat === "Pizza"
                ? "بيتزا"
                : cat === "Drinks"
                ? "مشروبات"
                : "حلويات"}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
          {filteredProducts.map((product) => (
            <MenuCard
              key={product.id}
              product={product}
              onViewDetails={setSelectedProduct}
            />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-20">
            <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search size={24} className="text-gray-300" />
            </div>
            <p className="text-gray-400 text-lg font-medium">
              {lang === "en" ? "No items found" : "لا توجد عناصر"}
            </p>
            <button
              onClick={() => { setSearch(""); setActiveCategory("All"); }}
              className="mt-3 text-orange-600 text-sm font-medium hover:underline"
            >
              {lang === "en" ? "Clear filters" : "مسح التصفية"}
            </button>
          </div>
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
