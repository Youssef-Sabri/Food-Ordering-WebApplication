export const CATEGORY_LABELS: Record<string, { en: string; ar: string }> = {
  All: { en: "All", ar: "الكل" },
  Burgers: { en: "Burgers", ar: "برجر" },
  Pizza: { en: "Pizza", ar: "بيتزا" },
  Drinks: { en: "Drinks", ar: "مشروبات" },
  Desserts: { en: "Desserts", ar: "حلويات" },
};

export const STATUS_OPTIONS = ["PENDING", "PREPARING", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED"];

export const STATUS_LABELS: Record<string, { en: string; ar: string }> = {
  PENDING: { en: "Pending", ar: "معلق" },
  PREPARING: { en: "Preparing", ar: "يتم التحضير" },
  OUT_FOR_DELIVERY: { en: "Out for Delivery", ar: "في الطريق" },
  DELIVERED: { en: "Delivered", ar: "تم التوصيل" },
  CANCELLED: { en: "Cancelled", ar: "ملغي" },
};

export const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  PREPARING: "bg-blue-100 text-blue-800",
  OUT_FOR_DELIVERY: "bg-purple-100 text-purple-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
};

export function getErrorMessage(err: unknown, lang: string, fallbackEn: string, fallbackAr: string): string {
  return err instanceof Error ? err.message : (lang === "en" ? fallbackEn : fallbackAr);
}

export function imgError(e: React.SyntheticEvent<HTMLImageElement>) {
  (e.target as HTMLImageElement).style.display = "none";
}

export function formatPrice(amount: number, lang: string) {
  const num = amount.toFixed(2);
  if (lang === "ar") {
    return `ج.م\u200E ${num}\u200E`;
  }
  return `${num} EGP`;
}
