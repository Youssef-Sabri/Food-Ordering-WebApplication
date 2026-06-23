"use client";

import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  message: string;
  action?: { label: string; onClick: () => void };
}

export default function EmptyState({ icon: Icon, message, action }: EmptyStateProps) {
  return (
    <div className="text-center py-16">
      <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
        <Icon size={24} className="text-gray-300" />
      </div>
      <p className="text-gray-400 text-lg font-medium">{message}</p>
      {action && (
        <button onClick={action.onClick} className="mt-3 text-orange-600 text-sm font-medium hover:underline">
          {action.label}
        </button>
      )}
    </div>
  );
}
