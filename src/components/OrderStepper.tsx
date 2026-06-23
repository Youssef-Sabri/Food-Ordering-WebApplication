"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { CheckCircle, Package, CookingPot, Truck, ClipboardCheck, XCircle } from "lucide-react";

interface OrderStepperProps {
  status: string;
}

const steps = [
  { key: "PENDING", icon: ClipboardCheck },
  { key: "PREPARING", icon: CookingPot },
  { key: "OUT_FOR_DELIVERY", icon: Truck },
  { key: "DELIVERED", icon: Package },
];

const labels: Record<string, { en: string; ar: string }> = {
  PENDING: { en: "Order Placed", ar: "تم الطلب" },
  PREPARING: { en: "Preparing", ar: "يتم التحضير" },
  OUT_FOR_DELIVERY: { en: "Out for Delivery", ar: "في الطريق" },
  DELIVERED: { en: "Delivered", ar: "تم التوصيل" },
};

export default function OrderStepper({ status }: OrderStepperProps) {
  const { lang, dir } = useLanguage();
  const currentIndex = steps.findIndex((s) => s.key === status);

  if (status === "CANCELLED") {
    return (
      <div className="w-full py-6 text-center" dir={dir}>
        <div className="inline-flex items-center gap-2 bg-red-50 text-red-700 px-4 py-2 rounded-full">
          <XCircle size={20} />
          <span className="font-semibold">{lang === "en" ? "Order Cancelled" : "الطلب ملغي"}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full py-6" dir={dir}>
      <div className="flex items-center justify-between relative">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = index <= currentIndex;
          const isLast = index === steps.length - 1;

          return (
            <div key={step.key} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isActive
                      ? "bg-orange-600 text-white"
                      : "bg-gray-200 text-gray-400"
                  }`}
                >
                  {isActive && index < currentIndex ? (
                    <CheckCircle size={20} />
                  ) : (
                    <Icon size={20} />
                  )}
                </div>
                <span
                  className={`text-xs mt-1 text-center ${
                    isActive ? "text-orange-600 font-medium" : "text-gray-400"
                  }`}
                >
                  {lang === "en" ? labels[step.key].en : labels[step.key].ar}
                </span>
              </div>
              {!isLast && (
                <div
                  className={`flex-1 h-0.5 mx-2 ${
                    index < currentIndex ? "bg-orange-600" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
