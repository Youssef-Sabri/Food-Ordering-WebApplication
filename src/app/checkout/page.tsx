"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorBanner from "@/components/ErrorBanner";
import { formatPrice } from "@/lib/constants";
import { CreditCard, DollarSign } from "lucide-react";

export default function CheckoutPage() {
  const { lang, dir } = useLanguage();
  const { items, subtotal, clearCart } = useCart();
  const { user, token, isLoading } = useAuth();
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "ONLINE">("COD");
  const [address, setAddress] = useState({ street: "", floor: "", apartment: "", phone: "" });
  const [card, setCard] = useState({ holder: "", number: "", expiry: "", cvv: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isLoading) return;
    if (!user) router.push("/login");
    else if (items.length === 0) router.push("/");
  }, [isLoading, user, items, router]);

  if (isLoading || !user || items.length === 0) {
    return <LoadingSpinner />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const addressStr = lang === "en"
      ? `${address.street}, Floor ${address.floor}, Apartment ${address.apartment}, Phone: ${address.phone}`
      : `${address.street}، الطابق ${address.floor}، شقة ${address.apartment}، الهاتف: ${address.phone}`;

    if (paymentMethod === "ONLINE") {
      if (!card.holder || !card.number || !card.expiry || !card.cvv) {
        setError(lang === "en" ? "Please fill in all card details" : "يرجى ملء جميع بيانات البطاقة");
        setLoading(false);
        return;
      }
    }

    try {
      const res = await fetch(`/api/orders?lang=${lang}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          address: addressStr,
          paymentMethod,
          items: items.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price,
          })),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      clearCart();
      router.push(`/orders/${data.order.id}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : (lang === "en" ? "Checkout failed" : "فشل إتمام الطلب"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8" dir={dir}>
      <h1 className="text-2xl font-bold mb-6">
        {lang === "en" ? "Checkout" : "الدفع"}
      </h1>

      <ErrorBanner message={error} />

      <form onSubmit={handleSubmit}>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold mb-4">
                {lang === "en" ? "Delivery Details" : "تفاصيل التوصيل"}
              </h2>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder={lang === "en" ? "Street / Address" : "الشارع / العنوان"}
                  value={address.street}
                  onChange={(e) => setAddress({ ...address, street: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder={lang === "en" ? "Floor" : "الطابق"}
                    value={address.floor}
                    onChange={(e) => setAddress({ ...address, floor: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <input
                    type="text"
                    placeholder={lang === "en" ? "Apartment" : "الشقة"}
                    value={address.apartment}
                    onChange={(e) => setAddress({ ...address, apartment: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <input
                  type="tel"
                  placeholder={lang === "en" ? "Phone Number" : "رقم الهاتف"}
                  value={address.phone}
                  onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold mb-4">
                {lang === "en" ? "Payment Method" : "طريقة الدفع"}
              </h2>
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("COD")}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                    paymentMethod === "COD"
                      ? "border-orange-600 bg-orange-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <DollarSign size={20} className="text-green-600" />
                  <div className="text-left">
                    <p className="font-medium text-sm">
                      {lang === "en" ? "Cash on Delivery" : "الدفع عند الاستلام"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {lang === "en" ? "Pay when you receive" : "ادفع عند الاستلام"}
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("ONLINE")}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                    paymentMethod === "ONLINE"
                      ? "border-orange-600 bg-orange-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <CreditCard size={20} className="text-blue-600" />
                  <div className="text-left">
                    <p className="font-medium text-sm">
                      {lang === "en" ? "Online Payment" : "دفع أونلاين"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {lang === "en" ? "Simulated payment" : "محاكاة دفع"}
                    </p>
                  </div>
                </button>
              </div>

              {paymentMethod === "ONLINE" && (
                <div className="mt-4 space-y-3 pt-4 border-t border-gray-100">
                  <input
                    type="text"
                    placeholder={lang === "en" ? "Cardholder Name" : "اسم حامل البطاقة"}
                    value={card.holder}
                    onChange={(e) => setCard({ ...card, holder: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <input
                    type="text"
                    placeholder={lang === "en" ? "Card Number" : "رقم البطاقة"}
                    value={card.number}
                    onChange={(e) => setCard({ ...card, number: e.target.value })}
                    maxLength={16}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder={lang === "en" ? "MM/YY" : "شهر/سنة"}
                      value={card.expiry}
                      onChange={(e) => setCard({ ...card, expiry: e.target.value })}
                      maxLength={5}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    <input
                      type="text"
                      placeholder={lang === "en" ? "CVV" : "رمز الأمان"}
                      value={card.cvv}
                      onChange={(e) => setCard({ ...card, cvv: e.target.value })}
                      maxLength={4}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <h2 className="text-lg font-semibold mb-4">
                {lang === "en" ? "Order Summary" : "ملخص الطلب"}
              </h2>
              <div className="space-y-3 mb-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">
                      {lang === "en" ? item.nameEn : item.nameAr} x{`\u200E${item.quantity}\u200E`}
                    </span>
                    <span>{formatPrice(item.price * item.quantity, lang)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-100 pt-3 flex items-center justify-between font-semibold">
                <span>{lang === "en" ? "Total" : "المجموع"}</span>
                <span className="text-orange-600">{formatPrice(subtotal, lang)}</span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-6 bg-orange-600 text-white py-3 rounded-lg font-medium hover:bg-orange-700 transition-colors disabled:opacity-50"
              >
                {loading
                  ? (lang === "en" ? "Processing..." : "جاري المعالجة...")
                  : (lang === "en" ? `Place Order - ${formatPrice(subtotal, lang)}` : `تأكيد الطلب - ${formatPrice(subtotal, lang)}`)}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
