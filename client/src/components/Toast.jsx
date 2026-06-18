import React from 'react';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

export default function Toast({ toast }) {
  if (!toast) return null;

  return (
    <div className="fixed top-6 right-6 z-50 animate-bounce duration-300">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-xl text-white font-medium transition ${
        toast.type === 'error' ? 'bg-rose-500' : toast.type === 'warning' ? 'bg-amber-500' : 'bg-emerald-500'
      }`}>
        {toast.type === 'error' ? (
          <XCircle size={20} />
        ) : toast.type === 'warning' ? (
          <AlertTriangle size={20} />
        ) : (
          <CheckCircle size={20} />
        )}
        <span>{toast.message}</span>
      </div>
    </div>
  );
}
