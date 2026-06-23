"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAdminGuard } from "@/lib/hooks";
import ErrorBanner from "@/components/ErrorBanner";
import Pagination from "@/components/Pagination";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Category } from "@/lib/types";
import ConfirmModal from "@/components/ConfirmModal";
import { Plus, ArrowLeft, Edit2, Trash2 } from "lucide-react";

const ITEMS_PER_PAGE = 10;

export default function AdminCategoriesPage() {
  const { lang, dir } = useLanguage();
  const { token } = useAuth();
  const isNotAdmin = useAdminGuard();
  const [categories, setCategories] = useState<Category[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState({ nameEn: "", nameAr: "" });
  const [error, setError] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    const res = await fetch("/api/categories");
    const data = await res.json();
    setCategories(data.categories);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (isNotAdmin) return;
    fetchCategories();
  }, [isNotAdmin, fetchCategories]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const url = "/api/admin/categories";
    const method = editing ? "PUT" : "POST";
    const body = editing ? { id: editing.id, ...form } : form;

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || (lang === "en" ? "Operation failed" : "فشلت العملية"));
      return;
    }

    resetForm();
    fetchCategories();
  };

  const resetForm = () => {
    setShowForm(false);
    setEditing(null);
    setForm({ nameEn: "", nameAr: "" });
  };

  const handleEdit = (cat: Category) => {
    setForm({ nameEn: cat.nameEn, nameAr: cat.nameAr });
    setEditing(cat);
    setShowForm(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    await fetch("/api/admin/categories", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id: deleteId }),
    });
    setDeleteId(null);
    fetchCategories();
  };

  if (isNotAdmin) return null;

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8" dir={dir}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link href="/admin" className="text-gray-400 hover:text-gray-600">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-bold">{lang === "en" ? "Categories" : "الفئات"}</h1>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="flex items-center gap-1 bg-orange-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-orange-700 transition-colors"
        >
          <Plus size={16} />
          {lang === "en" ? "Add Category" : "إضافة فئة"}
        </button>
      </div>

      <ErrorBanner message={error} />

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">
            {editing ? (lang === "en" ? "Edit Category" : "تعديل الفئة") : (lang === "en" ? "New Category" : "فئة جديدة")}
          </h2>
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              placeholder={lang === "en" ? "Name (EN)" : "الاسم (إنج)"}
              value={form.nameEn}
              onChange={(e) => setForm({ ...form, nameEn: e.target.value })}
              required
              className="px-3 py-2 border border-gray-200 rounded-lg"
            />
            <input
              type="text"
              placeholder={lang === "en" ? "Name (AR)" : "الاسم (عربي)"}
              value={form.nameAr}
              onChange={(e) => setForm({ ...form, nameAr: e.target.value })}
              required
              className="px-3 py-2 border border-gray-200 rounded-lg"
            />
          </div>
          <div className="flex gap-2">
            <button type="submit" className="bg-orange-600 text-white px-6 py-2 rounded-lg text-sm hover:bg-orange-700 transition-colors">
              {editing ? (lang === "en" ? "Update" : "تحديث") : (lang === "en" ? "Create" : "إنشاء")}
            </button>
            <button type="button" onClick={resetForm} className="bg-gray-100 text-gray-600 px-6 py-2 rounded-lg text-sm hover:bg-gray-200 transition-colors">
              {lang === "en" ? "Cancel" : "إلغاء"}
            </button>
          </div>
        </form>
      )}

      <Pagination items={categories} itemsPerPage={ITEMS_PER_PAGE} page={page} onPageChange={setPage} lang={lang}>
        {(paginatedCategories) => (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="text-left p-3 font-medium text-gray-600">{lang === "en" ? "Name (EN)" : "الاسم (إنج)"}</th>
                    <th className="text-left p-3 font-medium text-gray-600">{lang === "en" ? "Name (AR)" : "الاسم (عربي)"}</th>
                    <th className="text-right p-3 font-medium text-gray-600">{lang === "en" ? "Actions" : "إجراءات"}</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedCategories.map((cat) => (
                    <tr key={cat.id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="p-3">{cat.nameEn}</td>
                      <td className="p-3">{cat.nameAr}</td>
                      <td className="p-3 text-right">
                        <button onClick={() => handleEdit(cat)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded mr-1">
                          <Edit2 size={14} />
                        </button>
                        <button                           onClick={() => setDeleteId(cat.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded">
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </Pagination>

      <ConfirmModal
        isOpen={deleteId !== null}
        title={lang === "en" ? "Delete Category" : "حذف الفئة"}
        message={lang === "en" ? "Are you sure you want to delete this category? Products in this category will not be deleted." : "هل أنت متأكد من حذف هذه الفئة؟ لن يتم حذف المنتجات في هذه الفئة."}
        confirmLabel={lang === "en" ? "Delete" : "حذف"}
        cancelLabel={lang === "en" ? "Cancel" : "إلغاء"}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
