"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { CheckCircle, Package, CookingPot, Truck, ClipboardCheck } from "lucide-react";

interface OrderStepperProps {
  status: string;
}

const steps = [
  { key: "PENDING", icon: ClipboardCheck },
  { key: "PREPARING", icon: CookingPot },
  { key: "OUT_FOR_DELIVERY", icon: Truck },
  { key: "DELIVERED", icon: Package },
];

export default function OrderStepper({ status }: OrderStepperProps) {
  const { lang } = useLanguage();
  const currentIndex = steps.findIndex((s) => s.key === status);

  const labels: Record<string, { en: string; ar: string }> = {
    PENDING: { en: "Order Placed", ar: "تم الطلب" },
    PREPARING: { en: "Preparing", ar: "يتم التحضير" },
    OUT_FOR_DELIVERY: { en: "Out for Delivery", ar: "في الطريق" },
    DELIVERED: { en: "Delivered", ar: "تم التوصيل" },
  };

  return (
    <div className="w-full py-6" dir={lang === "ar" ? "rtl" : "ltr"}>
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
