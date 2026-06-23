"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import OrderStepper from "@/components/OrderStepper";
import { formatPrice } from "@/lib/constants";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Order } from "@/lib/types";
import { CheckCircle, Package, XCircle } from "lucide-react";

export default function OrderConfirmationPage() {
  const { lang, dir } = useLanguage();
  const { user, token, isLoading } = useAuth();
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [isLoading, user, router]);

  useEffect(() => {
    if (!token) return;

    let active = true;
    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/orders/${params.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok && active) {
          setOrder(data.order);
        }
      } catch {
        console.error("fetchOrder failed");
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchOrder();
    const interval = setInterval(fetchOrder, 5000);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [token, params.id]);

  if (isLoading || !user || loading) {
    return <LoadingSpinner />;
  }

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center" dir={dir}>
        <Package size={48} className="mx-auto text-gray-300 mb-4" />
        <h1 className="text-xl font-bold mb-2">
          {lang === "en" ? "Order Not Found" : "الطلب غير موجود"}
        </h1>
        <Link href="/" className="text-orange-600 hover:underline">
          {lang === "en" ? "Back to Menu" : "العودة إلى القائمة"}
        </Link>
      </div>
    );
  }

  const isCancelled = order.status === "CANCELLED";
  const createdAt = new Date(order.createdAt);
  const estimatedDelivery = new Date(createdAt.getTime() + 45 * 60000);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8" dir={dir}>
      <div className={`rounded-xl shadow-sm border p-6 mb-6 text-center ${
        isCancelled
          ? "bg-red-50 border-red-100"
          : "bg-white border-gray-100"
      }`}>
        {isCancelled ? (
          <XCircle size={48} className="mx-auto text-red-500 mb-3" />
        ) : (
          <CheckCircle size={48} className="mx-auto text-green-500 mb-3" />
        )}
        <h1 className={`text-2xl font-bold mb-1 ${
          isCancelled ? "text-red-600" : "text-green-600"
        }`}>
          {isCancelled
            ? (lang === "en" ? "Order Cancelled" : "تم إلغاء الطلب")
            : (lang === "en" ? "Order Confirmed!" : "تم تأكيد الطلب!")}
        </h1>
        <p className="text-gray-500">
          {lang === "en" ? "Order ID:" : "رقم الطلب:"} {order.id.slice(0, 8).toUpperCase()}
        </p>
        {!isCancelled && (
          <p className="text-sm text-gray-400 mt-1">
            {lang === "en"
              ? `Estimated delivery by ${estimatedDelivery.toLocaleTimeString()}`
              : `الوصول المتوقع بحلول ${estimatedDelivery.toLocaleTimeString()}`}
          </p>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">
          {lang === "en" ? "Order Status" : "حالة الطلب"}
        </h2>
        <OrderStepper status={order.status} />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">
          {lang === "en" ? "Order Items" : "عناصر الطلب"}
        </h2>
        <div className="space-y-2">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span className="text-gray-600">
                {lang === "en" ? item.product.nameEn : item.product.nameAr} x{`\u200E${item.quantity}\u200E`}
              </span>
              <span>{formatPrice(item.price * item.quantity, lang)}</span>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-100 mt-3 pt-3 flex justify-between font-semibold">
          <span>{lang === "en" ? "Total" : "المجموع"}</span>
          <span className="text-orange-600">{formatPrice(order.totalAmount, lang)}</span>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold mb-3">
          {lang === "en" ? "Payment & Delivery" : "الدفع والتوصيل"}
        </h2>
        <div className="space-y-1 text-sm text-gray-600">
          <p>
            <span className="font-medium">
              {lang === "en" ? "Payment:" : "الدفع:"}
            </span>{" "}
            {order.paymentMethod === "COD"
              ? lang === "en"
                ? "Cash on Delivery"
                : "الدفع عند الاستلام"
              : lang === "en"
              ? "Online Payment"
              : "دفع أونلاين"}
          </p>
          <p>
            <span className="font-medium">
              {lang === "en" ? "Status:" : "الحالة:"}
            </span>{" "}
            {order.paymentStatus === "PAID"
              ? lang === "en"
                ? "Paid"
                : "مدفوع"
              : lang === "en"
              ? "Pending"
              : "معلق"}
          </p>
          <p className="mt-2">{order.address}</p>
        </div>
      </div>

      <div className="text-center mt-6">
        <Link
          href="/"
          className="text-orange-600 hover:underline text-sm"
        >
          {lang === "en" ? "Back to Menu" : "العودة إلى القائمة"}
        </Link>
      </div>
    </div>
  );
}
