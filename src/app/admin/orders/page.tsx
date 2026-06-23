"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { STATUS_OPTIONS, STATUS_LABELS, STATUS_COLORS, formatPrice } from "@/lib/constants";
import Pagination from "@/components/Pagination";
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

export default function AdminOrdersPage() {
  const { lang, dir } = useLanguage();
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
    fetchOrders();
  }, [user, router, fetchOrders]);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setUpdating(orderId);
    try {
      await fetch("/api/admin/orders", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id: orderId, status: newStatus }),
      });
      fetchOrders();
    } finally {
      setUpdating(null);
    }
  };

  if (!user || user.role !== "ADMIN") return null;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8" dir={dir}>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin" className="text-gray-400 hover:text-gray-600">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold">
          {lang === "en" ? "Orders" : "الطلبات"}
        </h1>
      </div>

      <Pagination items={orders} itemsPerPage={ITEMS_PER_PAGE} page={page} onPageChange={setPage} lang={lang}>
        {(paginatedOrders) => (
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
                      <td className="p-3 font-medium">{formatPrice(order.totalAmount, lang)}</td>
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
                            STATUS_COLORS[order.status] || "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {STATUS_OPTIONS.map((opt) => (
                            <option key={opt} value={opt}>
                              {lang === "en" ? STATUS_LABELS[opt]?.en : STATUS_LABELS[opt]?.ar}
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
        )}
      </Pagination>
    </div>
  );
}
