"use client";

import { signOut } from "next-auth/react";
import { RefreshCw, LogOut } from "lucide-react";

interface HeaderProps {
  title: string;
  onRefresh?: () => void;
  loading?: boolean;
}

export default function Header({ title, onRefresh, loading = false }: HeaderProps) {
  return (
    <header className="h-16 border-b border-slate-200/80 px-8 flex items-center justify-between bg-white/80 backdrop-blur-md flex-shrink-0 z-10">
      <h2 className="text-lg font-bold text-slate-900">{title}</h2>

      <div className="flex items-center gap-3">
        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={loading}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 transition-colors cursor-pointer disabled:opacity-50"
          >
            <RefreshCw size={14} className={loading ? "animate-spin text-[#FF5D7B]" : ""} />
            새로고침
          </button>
        )}

        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#FFF3F4] hover:bg-[#FFE5E8] text-[#FF5D7B] border border-[#FF5D7B]/20 text-xs font-bold transition-colors cursor-pointer"
        >
          <LogOut size={13} />
          로그아웃
        </button>
      </div>
    </header>
  );
}
