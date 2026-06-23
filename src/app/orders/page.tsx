"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Clock, ChevronRight } from "lucide-react";

interface Order {
  id: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  items: { id: string; quantity: number; product: { nameEn: string; nameAr: string } }[];
}

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

export default function OrdersPage() {
  const { lang } = useLanguage();
  const { user, token } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }
    if (!token) return;

    fetch("/api/orders", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setOrders(data.orders))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user, token, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8" dir={lang === "ar" ? "rtl" : "ltr"}>
      <h1 className="text-2xl font-bold mb-6">
        {lang === "en" ? "My Orders" : "طلباتي"}
      </h1>

      {orders.length === 0 ? (
        <div className="text-center py-16">
          <Clock size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-400 mb-4">
            {lang === "en" ? "No orders yet" : "لا توجد طلبات بعد"}
          </p>
          <Link
            href="/"
            className="text-orange-600 hover:underline text-sm"
          >
            {lang === "en" ? "Browse Menu" : "تصفح القائمة"}
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/orders/${order.id}`}
              className="block bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">
                    {lang === "en" ? "Order" : "طلب"} #{order.id.slice(0, 8).toUpperCase()}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(order.createdAt).toLocaleDateString()} -{" "}
                    {order.items.reduce((s, i) => s + i.quantity, 0)}{" "}
                    {lang === "en" ? "items" : "عناصر"}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-medium ${
                      statusColors[order.status] || "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {lang === "en"
                      ? statusLabels[order.status]?.en || order.status
                      : statusLabels[order.status]?.ar || order.status}
                  </span>
                  <span className="font-semibold text-sm">{order.totalAmount} EGP</span>
                  <ChevronRight size={16} className="text-gray-400" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
