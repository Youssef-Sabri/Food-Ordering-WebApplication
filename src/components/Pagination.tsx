"use client";
import { ReactNode } from "react";

interface PaginationProps<T> {
  items: T[];
  itemsPerPage: number;
  page: number;
  onPageChange: (page: number) => void;
  lang: string;
  children: (paginatedItems: T[]) => ReactNode;
}

export default function Pagination<T>({ items, itemsPerPage, page, onPageChange, lang, children }: PaginationProps<T>) {
  const totalPages = Math.ceil(items.length / itemsPerPage);
  const paginatedItems = items.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <>
      {children(paginatedItems)}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <button
            onClick={() => onPageChange(Math.max(1, page - 1))}
            disabled={page === 1}
            className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {lang === "en" ? "Prev" : "السابق"}
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`px-3 py-1.5 text-sm rounded-lg border ${
                p === page
                  ? "bg-orange-600 text-white border-orange-600"
                  : "border-gray-200 hover:bg-gray-50"
              }`}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => onPageChange(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {lang === "en" ? "Next" : "التالي"}
          </button>
        </div>
      )}
    </>
  );
}
