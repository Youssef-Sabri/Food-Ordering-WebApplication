"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAdminGuard } from "@/lib/hooks";
import { formatPrice } from "@/lib/constants";
import { ShoppingBag, DollarSign, Package, LayoutDashboard, ClipboardList, Tags } from "lucide-react";

interface Overview {
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
}

export default function AdminPage() {
  const { lang, dir } = useLanguage();
  const { token } = useAuth();
  const isNotAdmin = useAdminGuard();
  const [overview, setOverview] = useState<Overview | null>(null);

  useEffect(() => {
    if (isNotAdmin || !token) return;

    fetch("/api/admin/overview", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setOverview)
      .catch(console.error);
  }, [isNotAdmin, token]);

  if (isNotAdmin) return null;

  const cards = [
    {
      label: lang === "en" ? "Total Orders" : "إجمالي الطلبات",
      value: overview?.totalOrders ?? 0,
      icon: ShoppingBag,
      color: "bg-blue-500",
    },
    {
      label: lang === "en" ? "Total Revenue" : "إجمالي الإيرادات",
      value: formatPrice(overview?.totalRevenue ?? 0, lang),
      icon: DollarSign,
      color: "bg-green-500",
    },
    {
      label: lang === "en" ? "Active Products" : "المنتجات النشطة",
      value: overview?.totalProducts ?? 0,
      icon: Package,
      color: "bg-purple-500",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8" dir={dir}>
      <div className="flex items-center gap-2 mb-8">
        <LayoutDashboard size={24} className="text-orange-600" />
        <h1 className="text-2xl font-bold">
          {lang === "en" ? "Admin Dashboard" : "لوحة التحكم"}
        </h1>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
            >
              <div className="flex items-center gap-3">
                <div className={`${card.color} p-3 rounded-lg`}>
                  <Icon size={24} className="text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">{card.label}</p>
                  <p className="text-2xl font-bold">{card.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Link
          href="/admin/products"
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-3 mb-3">
            <Package size={24} className="text-orange-600" />
            <h2 className="text-lg font-semibold">
              {lang === "en" ? "Products" : "المنتجات"}
            </h2>
          </div>
          <p className="text-sm text-gray-500">
            {lang === "en" ? "Manage menu items" : "إدارة عناصر القائمة"}
          </p>
        </Link>

        <Link
          href="/admin/orders"
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-3 mb-3">
            <ClipboardList size={24} className="text-orange-600" />
            <h2 className="text-lg font-semibold">
              {lang === "en" ? "Orders" : "الطلبات"}
            </h2>
          </div>
          <p className="text-sm text-gray-500">
            {lang === "en" ? "View and manage orders" : "عرض وإدارة الطلبات"}
          </p>
        </Link>

        <Link
          href="/admin/categories"
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-3 mb-3">
            <Tags size={24} className="text-orange-600" />
            <h2 className="text-lg font-semibold">
              {lang === "en" ? "Categories" : "الفئات"}
            </h2>
          </div>
          <p className="text-sm text-gray-500">
            {lang === "en" ? "Manage menu categories" : "إدارة فئات القائمة"}
          </p>
        </Link>
      </div>
    </div>
  );
}
