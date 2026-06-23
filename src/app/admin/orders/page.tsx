"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { STATUS_OPTIONS, STATUS_LABELS, STATUS_COLORS, formatPrice } from "@/lib/constants";
import Pagination from "@/components/Pagination";
import { Order } from "@/lib/types";
import { ArrowLeft, ChevronDown } from "lucide-react";

function StatusDropdown({ orderId, currentStatus, lang, token, onUpdate }: {
  orderId: string; currentStatus: string; lang: string; token: string | null; onUpdate: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [position, setPosition] = useState<{ top: number; right: number } | null>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        btnRef.current && !btnRef.current.contains(e.target as Node) &&
        menuRef.current && !menuRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggle = () => {
    if (!open && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setPosition({ top: rect.bottom + 6, right: window.innerWidth - rect.right });
    }
    setOpen(!open);
  };

  const handleSelect = async (status: string) => {
    setUpdatingId(orderId);
    setOpen(false);
    try {
      await fetch("/api/admin/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ id: orderId, status }),
      });
      onUpdate();
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <>
      <button
        ref={btnRef}
        onClick={handleToggle}
        disabled={updatingId === orderId}
        className={`text-xs px-3 py-1.5 rounded-full font-medium flex items-center gap-1 transition-shadow ${
          STATUS_COLORS[currentStatus] || "bg-gray-100 text-gray-800"
        } ${open ? "shadow-md" : "shadow-sm"}`}
      >
        {lang === "en" ? STATUS_LABELS[currentStatus]?.en : STATUS_LABELS[currentStatus]?.ar}
        <ChevronDown size={10} className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && position && (
        <div
          ref={menuRef}
          style={{ position: "fixed", top: position.top, right: position.right, zIndex: 50 }}
          className="bg-white rounded-xl shadow-xl border border-gray-100 py-1 min-w-[150px] animate-fadeIn overflow-hidden"
        >
          {STATUS_OPTIONS.map((opt) => (
            <button
              key={opt}
              onClick={() => handleSelect(opt)}
              className={`w-full text-left px-3 py-2 text-xs font-medium flex items-center gap-2.5 transition-colors ${
                opt === currentStatus
                  ? "bg-orange-50 text-orange-700"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <span className={`w-2 h-2 rounded-full flex-shrink-0 ${STATUS_COLORS[opt]?.split(" ")[0] || "bg-gray-300"}`} />
              <span className="flex-1">{lang === "en" ? STATUS_LABELS[opt]?.en : STATUS_LABELS[opt]?.ar}</span>
              {opt === currentStatus && (
                <svg className="w-3.5 h-3.5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </>
  );
}

const ITEMS_PER_PAGE = 10;

export default function AdminOrdersPage() {
  const { lang, dir } = useLanguage();
  const { user, token } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [page, setPage] = useState(1);

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
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="overflow-x-auto rounded-xl">
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
                            {lang === "en" ? item.product.nameEn : item.product.nameAr} x{`\u200E${item.quantity}\u200E`}
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
                        <StatusDropdown
                          orderId={order.id}
                          currentStatus={order.status}
                          lang={lang}
                          token={token}
                          onUpdate={fetchOrders}
                        />
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
