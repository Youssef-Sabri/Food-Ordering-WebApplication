"use client";

import Link from "next/link";
import { ShoppingCart, User, LogOut, LayoutDashboard, Menu, X, UtensilsCrossed } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSwitcher from "./LanguageSwitcher";
import { useState } from "react";

interface NavbarProps {
  onCartClick: () => void;
}

export default function Navbar({ onCartClick }: NavbarProps) {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const { lang } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200/80 shadow-sm" dir={lang === "ar" ? "rtl" : "ltr"}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-orange-600 text-white p-1.5 rounded-lg group-hover:bg-orange-700 transition-colors">
              <UtensilsCrossed size={20} />
            </div>
            <div>
              <span className="text-lg font-bold text-gray-900">FoodDash</span>
              <span className="hidden sm:block text-[10px] text-gray-400 leading-tight -mt-0.5">{lang === "en" ? "Food Delivery" : "توصيل طلبات"}</span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-5">
            <LanguageSwitcher />

            {user?.role === "ADMIN" && (
              <Link
                href="/admin"
                className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-orange-600 transition-colors"
              >
                <LayoutDashboard size={17} />
                {lang === "en" ? "Admin" : "لوحة التحكم"}
              </Link>
            )}

            <button
              onClick={onCartClick}
              className="relative flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-orange-600 transition-colors"
            >
              <ShoppingCart size={19} />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-orange-600 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 shadow-sm">
                  {totalItems}
                </span>
              )}
              <span>{lang === "en" ? "Cart" : "السلة"}</span>
            </button>

            {user ? (
              <div className="flex items-center gap-4 pl-4 border-l border-gray-200">
                <Link
                  href="/orders"
                  className="text-sm font-medium text-gray-600 hover:text-orange-600 transition-colors"
                >
                  {lang === "en" ? "My Orders" : "طلباتي"}
                </Link>
                <div className="flex items-center gap-1.5 text-sm text-gray-500">
                  <div className="bg-orange-100 text-orange-700 p-1 rounded-full">
                    <User size={14} />
                  </div>
                  <span className="font-medium">{user.name}</span>
                </div>
                <button
                  onClick={logout}
                  className="flex items-center gap-1 text-sm text-gray-400 hover:text-red-500 transition-colors"
                >
                  <LogOut size={15} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 pl-4 border-l border-gray-200">
                <Link
                  href="/login"
                  className="text-sm font-medium text-gray-600 hover:text-orange-600 transition-colors px-3 py-1.5"
                >
                  {lang === "en" ? "Login" : "تسجيل دخول"}
                </Link>
                <Link
                  href="/register"
                  className="text-sm font-medium bg-orange-600 text-white px-4 py-1.5 rounded-lg hover:bg-orange-700 transition-colors shadow-sm"
                >
                  {lang === "en" ? "Sign Up" : "إنشاء حساب"}
                </Link>
              </div>
            )}
          </div>

          <div className="md:hidden flex items-center gap-1">
            <button onClick={onCartClick} className="relative p-2 text-gray-600">
              <ShoppingCart size={20} />
              {totalItems > 0 && (
                <span className="absolute top-0.5 right-0.5 bg-orange-600 text-white text-[10px] font-bold rounded-full min-w-[16px] h-[16px] flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-gray-600">
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-3 animate-fadeIn">
          <LanguageSwitcher />
          {user?.role === "ADMIN" && (
            <Link href="/admin" className="block text-sm font-medium text-gray-600 py-1" onClick={() => setMobileMenuOpen(false)}>
              <LayoutDashboard size={16} className="inline mr-2" />
              {lang === "en" ? "Admin Dashboard" : "لوحة التحكم"}
            </Link>
          )}
          {user ? (
            <>
              <Link href="/orders" className="block text-sm font-medium text-gray-600 py-1" onClick={() => setMobileMenuOpen(false)}>
                {lang === "en" ? "My Orders" : "طلباتي"}
              </Link>
              <div className="flex items-center gap-2 text-sm text-gray-500 py-1">
                <User size={14} />
                {user.name}
              </div>
              <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="flex items-center gap-1 text-sm text-red-500 py-1">
                <LogOut size={14} />
                {lang === "en" ? "Logout" : "تسجيل خروج"}
              </button>
            </>
          ) : (
            <div className="flex items-center gap-3 pt-1">
              <Link href="/login" className="text-sm font-medium text-gray-600" onClick={() => setMobileMenuOpen(false)}>
                {lang === "en" ? "Login" : "تسجيل دخول"}
              </Link>
              <Link href="/register" className="text-sm font-medium bg-orange-600 text-white px-4 py-1.5 rounded-lg" onClick={() => setMobileMenuOpen(false)}>
                {lang === "en" ? "Sign Up" : "إنشاء حساب"}
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
