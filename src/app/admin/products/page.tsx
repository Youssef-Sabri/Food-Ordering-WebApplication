"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Plus, Edit2, Trash2, ArrowLeft } from "lucide-react";

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

export default function AdminProductsPage() {
  const { lang } = useLanguage();
  const { user, token } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const ITEMS_PER_PAGE = 10;
  const [form, setForm] = useState({
    nameEn: "", nameAr: "", descriptionEn: "", descriptionAr: "",
    category: "Burgers", price: 0, image: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const fetchProducts = useCallback(async () => {
    const res = await fetch("/api/products");
    const data = await res.json();
    setProducts(data.products);
    setPage(1);
  }, []);

  useEffect(() => {
    if (!user || user.role !== "ADMIN") {
      router.push("/");
      return;
    }
    const load = async () => {
      await fetchProducts();
    };
    load();
  }, [user, router, fetchProducts]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    let imageUrl = form.image;

    if (imageFile) {
      const uploadData = new FormData();
      uploadData.append("file", imageFile);
      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: uploadData,
      });
      if (uploadRes.ok) {
        const { url } = await uploadRes.json();
        imageUrl = url;
      }
    }

    const url = editing
      ? `/api/admin/products/${editing.id}`
      : "/api/admin/products";
    const method = editing ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ ...form, image: imageUrl }),
    });

    setUploading(false);

    if (res.ok) {
      setShowForm(false);
      setEditing(null);
      setImageFile(null);
      setImagePreview(null);
      setForm({ nameEn: "", nameAr: "", descriptionEn: "", descriptionAr: "", category: "Burgers", price: 0, image: "" });
      fetchProducts();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(lang === "en" ? "Are you sure?" : "هل أنت متأكد؟")) return;
    await fetch(`/api/admin/products/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchProducts();
  };

  const handleEdit = (product: Product) => {
    setEditing(product);
    setForm({
      nameEn: product.nameEn,
      nameAr: product.nameAr,
      descriptionEn: product.descriptionEn,
      descriptionAr: product.descriptionAr,
      category: product.category,
      price: product.price,
      image: product.image,
    });
    setImagePreview(product.image);
    setImageFile(null);
    setShowForm(true);
  };

  if (!user || user.role !== "ADMIN") return null;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8" dir={lang === "ar" ? "rtl" : "ltr"}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link href="/admin" className="text-gray-400 hover:text-gray-600">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-bold">
            {lang === "en" ? "Products" : "المنتجات"}
          </h1>
        </div>
        <button
          onClick={() => {
            setEditing(null);
            setImageFile(null);
            setImagePreview(null);
            setForm({ nameEn: "", nameAr: "", descriptionEn: "", descriptionAr: "", category: "Burgers", price: 0, image: "" });
            setShowForm(!showForm);
          }}
          className="flex items-center gap-1 bg-orange-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-orange-700 transition-colors"
        >
          <Plus size={16} />
          {lang === "en" ? "Add Product" : "إضافة منتج"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">
            {editing
              ? (lang === "en" ? "Edit Product" : "تعديل المنتج")
              : (lang === "en" ? "New Product" : "منتج جديد")}
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <input
              placeholder="Name (EN)"
              value={form.nameEn}
              onChange={(e) => setForm({ ...form, nameEn: e.target.value })}
              required
              className="px-3 py-2 border border-gray-200 rounded-lg"
            />
            <input
              placeholder="Name (AR)"
              value={form.nameAr}
              onChange={(e) => setForm({ ...form, nameAr: e.target.value })}
              required
              className="px-3 py-2 border border-gray-200 rounded-lg"
            />
            <textarea
              placeholder="Description (EN)"
              value={form.descriptionEn}
              onChange={(e) => setForm({ ...form, descriptionEn: e.target.value })}
              required
              className="px-3 py-2 border border-gray-200 rounded-lg"
              rows={2}
            />
            <textarea
              placeholder="Description (AR)"
              value={form.descriptionAr}
              onChange={(e) => setForm({ ...form, descriptionAr: e.target.value })}
              required
              className="px-3 py-2 border border-gray-200 rounded-lg"
              rows={2}
            />
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="px-3 py-2 border border-gray-200 rounded-lg"
            >
              <option value="Burgers">Burgers</option>
              <option value="Pizza">Pizza</option>
              <option value="Drinks">Drinks</option>
              <option value="Desserts">Desserts</option>
            </select>
            <input
              type="number"
              step="0.01"
              placeholder="Price (EGP)"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) })}
              required
              className="px-3 py-2 border border-gray-200 rounded-lg"
            />
            <div className="md:col-span-2">
              <label className="block text-sm text-gray-500 mb-1">
                {lang === "en" ? "Product Image" : "صورة المنتج"}
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  setImageFile(file);
                  if (file) {
                    setImagePreview(URL.createObjectURL(file));
                  }
                }}
                className="w-full text-sm text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
              />
              {imagePreview && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="mt-2 w-32 h-32 object-cover rounded-lg border border-gray-200"
                />
              )}
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button
              type="submit"
              disabled={uploading}
              className="bg-orange-600 text-white px-6 py-2 rounded-lg text-sm hover:bg-orange-700 transition-colors disabled:opacity-50"
            >
              {uploading
                ? (lang === "en" ? "Uploading..." : "جاري الرفع...")
                : editing
                  ? (lang === "en" ? "Update" : "تحديث")
                  : (lang === "en" ? "Create" : "إنشاء")}
            </button>
            <button
              type="button"
              onClick={() => { setShowForm(false); setEditing(null); setImageFile(null); setImagePreview(null); }}
              className="bg-gray-100 text-gray-600 px-6 py-2 rounded-lg text-sm hover:bg-gray-200 transition-colors"
            >
              {lang === "en" ? "Cancel" : "إلغاء"}
            </button>
          </div>
        </form>
      )}

      {(() => {
        const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);
        const paginatedProducts = products.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
        return (
          <>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="text-left p-3 font-medium text-gray-600">{lang === "en" ? "Name (EN)" : "الاسم (إنج)"}</th>
                      <th className="text-left p-3 font-medium text-gray-600">{lang === "en" ? "Name (AR)" : "الاسم (عربي)"}</th>
                      <th className="text-left p-3 font-medium text-gray-600">{lang === "en" ? "Category" : "الفئة"}</th>
                      <th className="text-left p-3 font-medium text-gray-600">{lang === "en" ? "Price" : "السعر"}</th>
                      <th className="text-right p-3 font-medium text-gray-600">{lang === "en" ? "Actions" : "إجراءات"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedProducts.map((product) => (
                      <tr key={product.id} className="border-b border-gray-50 hover:bg-gray-50">
                        <td className="p-3">{product.nameEn}</td>
                        <td className="p-3">{product.nameAr}</td>
                        <td className="p-3">
                          <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                            {product.category}
                          </span>
                        </td>
                        <td className="p-3 font-medium">{product.price} EGP</td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => handleEdit(product)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded mr-1"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-6">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  {lang === "en" ? "Prev" : "السابق"}
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`px-3 py-1.5 text-sm rounded-lg border ${
                      p === page
                        ? "bg-orange-600 text-white border-orange-600"
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  {lang === "en" ? "Next" : "التالي"}
                </button>
              </div>
            )}
          </>
        );
      })()}
    </div>
  );
}
