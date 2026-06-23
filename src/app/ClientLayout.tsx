"use client";

import { ReactNode, useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import Navbar from "@/components/Navbar";
import CartDrawer from "@/components/CartDrawer";

export default function ClientLayout({ children }: { children: ReactNode }) {
  const { lang, dir } = useLanguage();
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <div dir={dir} className="flex flex-col flex-1">
      <Navbar onCartClick={() => setCartOpen(true)} />
      <main className="flex-1">{children}</main>
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-white font-bold text-lg mb-3">FoodDash</h3>
              <p className="text-sm leading-relaxed">
                {lang === "en"
                  ? "Your trusted destination for delicious food delivered fresh to your doorstep."
                  : "وجهتك الموثوقة للطعام اللذيذ الطازج على باب منزلك."}
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">
                {lang === "en" ? "Quick Links" : "روابط سريعة"}
              </h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/" className="hover:text-orange-400 transition-colors">
                    {lang === "en" ? "Menu" : "القائمة"}
                  </Link>
                </li>
                <li>
                  <Link href="/orders" className="hover:text-orange-400 transition-colors">
                    {lang === "en" ? "My Orders" : "طلباتي"}
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">
                {lang === "en" ? "Contact" : "اتصل بنا"}
              </h4>
              <ul className="space-y-2 text-sm">
                <li>info@fooddash.com</li>
                <li><span dir="ltr">+20 100 000 0000</span></li>
                <li>
                  {lang === "en" ? "Cairo, Egypt" : "القاهرة، مصر"}
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
            &copy; {new Date().getFullYear()} FoodDash. {lang === "en" ? "All rights reserved." : "جميع الحقوق محفوظة."}
          </div>
        </div>
      </footer>
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}
