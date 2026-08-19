"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import cx from "classnames";
import {
  LayoutDashboard,
  FileText,
  Tag,
  AlertTriangle,
  HelpCircle,
  Sparkles,
  LogOut,
  User as UserIcon,
} from "lucide-react";
import logoImg from "@/assets/logo.png";

const NAV_ITEMS = [
  { href: "/", label: "대시보드 홈", icon: LayoutDashboard },
  { href: "/posts", label: "게시글 및 댓글 관리", icon: FileText },
  { href: "/categories", label: "카테고리 관리", icon: Tag },
  { href: "/reports", label: "신고 내역", icon: AlertTriangle },
  { href: "/inquiries", label: "문의 / 피드백", icon: HelpCircle },
  { href: "/ai-tester", label: "AI 검수 테스터", icon: Sparkles, highlight: true },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <aside className="w-64 border-r border-slate-200/80 bg-white flex flex-col justify-between p-4 flex-shrink-0 shadow-sm z-20">
      <div className="space-y-6">
        <div className="flex items-center px-2 py-2">
          <Image
            src={logoImg}
            alt="연OX 로고"
            priority
            className="h-10 w-auto object-contain drop-shadow-sm"
          />
        </div>

        <nav className="space-y-1.5">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cx(
                  "flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-sm font-semibold transition-all cursor-pointer",
                  {
                    "bg-[#FF5D7B] text-white shadow-md shadow-[#FF5D7B]/25":
                      isActive && !item.highlight,
                    "bg-gradient-to-r from-[#8B75F9] to-indigo-600 text-white shadow-md shadow-[#8B75F9]/25":
                      isActive && item.highlight,
                    "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70":
                      !isActive,
                  }
                )}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          {session?.user?.image ? (
            <img
              src={session.user.image}
              alt="Admin Profile"
              className="w-8 h-8 rounded-full border border-slate-200 object-cover flex-shrink-0"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center text-slate-500 flex-shrink-0">
              <UserIcon size={14} />
            </div>
          )}
          <div className="min-w-0">
            <p className="text-xs font-bold text-slate-800 truncate">
              {session?.user?.name ||
                session?.user?.email?.split("@")[0] ||
                "Admin"}
            </p>
            <p className="text-[10px] text-slate-400 truncate">
              {session?.user?.email || "admin"}
            </p>
          </div>
        </div>

        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          title="로그아웃"
          className="p-1.5 text-slate-400 hover:text-[#FF5D7B] hover:bg-slate-200/60 rounded-xl transition-colors flex-shrink-0 cursor-pointer"
        >
          <LogOut size={16} />
        </button>
      </div>
    </aside>
  );
}
