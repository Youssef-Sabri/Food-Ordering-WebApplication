"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { ArrowLeft } from "lucide-react";

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  product: { nameEn: string; nameAr: string };
}

interface Order {
  id: string;
  user: { id: string; name: string; email: string };
  address: string;
  paymentMethod: string;
  paymentStatus: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  items: OrderItem[];
}

const statusOptions = ["PENDING", "PREPARING", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED"];

const statusLabels: Record<string, { en: string; ar: string }> = {
  PENDING: { en: "Pending", ar: "معلق" },
  PREPARING: { en: "Preparing", ar: "يتم التحضير" },
  OUT_FOR_DELIVERY: { en: "Out for Delivery", ar: "في الطريق" },
  DELIVERED: { en: "Delivered", ar: "تم التوصيل" },
  CANCELLED: { en: "Cancelled", ar: "ملغي" },
};

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  PREPARING: "bg-blue-100 text-blue-800",
  OUT_FOR_DELIVERY: "bg-purple-100 text-purple-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
};

export default function AdminOrdersPage() {
  const { lang } = useLanguage();
  const { user, token } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [page, setPage] = useState(1);
  const [updating, setUpdating] = useState<string | null>(null);
  const ITEMS_PER_PAGE = 10;

  const fetchOrders = useCallback(async () => {
    if (!token) return;
    const res = await fetch("/api/admin/orders", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setOrders(data.orders);
    setPage(1);
  }, [token]);

  useEffect(() => {
    if (!user || user.role !== "ADMIN") {
      router.push("/");
      return;
    }
    const load = async () => {
      await fetchOrders();
    };
    load();
  }, [user, router, fetchOrders]);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setUpdating(orderId);
    await fetch("/api/admin/orders", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id: orderId, status: newStatus }),
    });
    fetchOrders();
    setUpdating(null);
  };

  if (!user || user.role !== "ADMIN") return null;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8" dir={lang === "ar" ? "rtl" : "ltr"}>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin" className="text-gray-400 hover:text-gray-600">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold">
          {lang === "en" ? "Orders" : "الطلبات"}
        </h1>
      </div>

      {(() => {
        const totalPages = Math.ceil(orders.length / ITEMS_PER_PAGE);
        const paginatedOrders = orders.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
        return (
          <>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="text-left p-3 font-medium text-gray-600">
                        {lang === "en" ? "Order ID" : "رقم الطلب"}
                      </th>
                      <th className="text-left p-3 font-medium text-gray-600">
                        {lang === "en" ? "Customer" : "العميل"}
                      </th>
                      <th className="text-left p-3 font-medium text-gray-600">
                        {lang === "en" ? "Items" : "العناصر"}
                      </th>
                      <th className="text-left p-3 font-medium text-gray-600">
                        {lang === "en" ? "Total" : "المجموع"}
                      </th>
                      <th className="text-left p-3 font-medium text-gray-600">
                        {lang === "en" ? "Payment" : "الدفع"}
                      </th>
                      <th className="text-left p-3 font-medium text-gray-600">
                        {lang === "en" ? "Status" : "الحالة"}
                      </th>
                      <th className="text-left p-3 font-medium text-gray-600">
                        {lang === "en" ? "Date" : "التاريخ"}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedOrders.map((order) => (
                      <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50">
                        <td className="p-3 font-mono text-xs">
                          #{order.id.slice(0, 8).toUpperCase()}
                        </td>
                        <td className="p-3">
                          <p className="font-medium">{order.user.name}</p>
                          <p className="text-xs text-gray-400">{order.user.email}</p>
                        </td>
                        <td className="p-3">
                          {order.items.map((item) => (
                            <span key={item.id} className="text-xs block text-gray-600">
                              {lang === "en" ? item.product.nameEn : item.product.nameAr} x{item.quantity}
                            </span>
                          ))}
                        </td>
                        <td className="p-3 font-medium">{order.totalAmount} EGP</td>
                        <td className="p-3">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            order.paymentStatus === "PAID"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}>
                            {order.paymentMethod === "COD"
                              ? lang === "en" ? "COD" : "الدفع عند الاستلام"
                              : lang === "en" ? "Online" : "أونلاين"}
                          </span>
                        </td>
                        <td className="p-3">
                          <select
                            value={order.status}
                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                            disabled={updating === order.id}
                            className={`text-xs px-2 py-1 rounded-full border-0 font-medium cursor-pointer ${
                              statusColors[order.status] || "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {statusOptions.map((opt) => (
                              <option key={opt} value={opt}>
                                {lang === "en" ? statusLabels[opt]?.en : statusLabels[opt]?.ar}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="p-3 text-xs text-gray-400">
                          {new Date(order.createdAt).toLocaleDateString()}
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
