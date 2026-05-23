"use client";

import { createContext, useCallback, useContext, useState } from "react";
import { cn } from "@/lib/utils";
import { CheckCircle, AlertCircle, X } from "lucide-react";

type ToastType = "success" | "error" | "info";

type Toast = { id: string; message: string; type: ToastType };

const ToastContext = createContext<{
  toast: (message: string, type?: ToastType) => void;
}>({ toast: () => {} });

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((message: string, type: ToastType = "info") => {
    const id = Math.random().toString(36).slice(2);
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4000);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed right-4 top-4 z-[9999] flex flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={cn(
              "glass-strong flex min-w-[280px] items-center gap-3 rounded-xl px-4 py-3 shadow-xl",
              t.type === "success" && "border-ssa-success/40",
              t.type === "error" && "border-red-500/40"
            )}
          >
            {t.type === "success" ? (
              <CheckCircle className="h-5 w-5 text-ssa-success shrink-0" />
            ) : t.type === "error" ? (
              <AlertCircle className="h-5 w-5 text-red-400 shrink-0" />
            ) : null}
            <span className="text-sm flex-1">{t.message}</span>
            <button
              type="button"
              onClick={() => setToasts((x) => x.filter((i) => i.id !== t.id))}
              className="opacity-60 hover:opacity-100"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
