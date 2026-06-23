"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { STATUS_LABELS, STATUS_COLORS, formatPrice } from "@/lib/constants";
import LoadingSpinner from "@/components/LoadingSpinner";
import EmptyState from "@/components/EmptyState";
import { Order } from "@/lib/types";
import { Clock, ChevronRight } from "lucide-react";

export default function OrdersPage() {
  const { lang, dir } = useLanguage();
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
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user, token, router]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8" dir={dir}>
      <h1 className="text-2xl font-bold mb-6">
        {lang === "en" ? "My Orders" : "طلباتي"}
      </h1>

      {orders.length === 0 ? (
        <EmptyState
          icon={Clock}
          message={lang === "en" ? "No orders yet" : "لا توجد طلبات بعد"}
          action={{ label: lang === "en" ? "Browse Menu" : "تصفح القائمة", onClick: () => router.push("/") }}
        />
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
                      STATUS_COLORS[order.status] || "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {lang === "en"
                      ? STATUS_LABELS[order.status]?.en || order.status
                      : STATUS_LABELS[order.status]?.ar || order.status}
                  </span>
                  <span className="font-semibold text-sm">{formatPrice(order.totalAmount, lang)}</span>
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
