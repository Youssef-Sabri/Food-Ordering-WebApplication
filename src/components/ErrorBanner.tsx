"use client";

interface ErrorBannerProps {
  message: string;
}

export default function ErrorBanner({ message }: ErrorBannerProps) {
  if (!message) return null;
  return <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4">{message}</div>;
}
