"use client";

import { Suspense, useState } from "react";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { RefreshCw } from "lucide-react";
import logoImg from "@/assets/logo.png";

function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const urlError = searchParams.get("error");

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(
    urlError === "AccessDenied"
      ? "접근 권한이 없는 계정입니다. 지정된 관리자 계정으로만 로그인할 수 있습니다."
      : urlError
        ? "로그인 중 오류가 발생했습니다. 다시 시도해 주세요."
        : null,
  );

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setErrorMsg(null);
      await signIn("google", { callbackUrl });
    } catch (err: any) {
      setErrorMsg(err.message || "Google 로그인 중 오류가 발생했습니다.");
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white border border-slate-200/80 rounded-[32px] p-8 shadow-xl shadow-slate-200/50 relative z-10">
      <div className="flex flex-col items-center text-center mb-6">
        <Image
          src={logoImg}
          alt="연OX"
          priority
          className="h-20 w-auto object-contain mb-3"
        />
        <h2 className="text-xl font-extrabold text-[#0F172A] tracking-tight leading-snug">
          건강한 연애를 위한<br />연애 커뮤니티 관리자 콘솔
        </h2>
      </div>

      <div className="my-6 space-y-3">
        <div className="flex justify-start">
          <div className="bg-[#F5F5F5] px-4 py-2.5 rounded-2xl rounded-tl-sm text-sm font-semibold text-[#0F172A] shadow-sm max-w-[85%]">
            ...내가 예민한걸까?
          </div>
        </div>

        <div className="flex justify-end">
          <div className="bg-[#F5F1FF] px-4 py-2.5 rounded-2xl rounded-tr-sm text-sm font-semibold text-[#0F172A] shadow-sm max-w-[85%]">
            <span className="text-[#8B75F9] font-black mr-1">O</span> 그 정도는 봐줄 수 있지
          </div>
        </div>

        <div className="flex justify-end">
          <div className="bg-[#FFF3F4] px-4 py-2.5 rounded-2xl rounded-tr-sm text-sm font-semibold text-[#0F172A] shadow-sm max-w-[85%]">
            <span className="text-[#FF5D7B] font-black mr-1">X</span> 나같아도 서운해
          </div>
        </div>
      </div>

      {errorMsg && (
        <div className="mb-5 p-3.5 rounded-2xl bg-[#FFF3F4] border border-[#FF5D7B]/30 text-xs font-bold text-[#FF5D7B] leading-relaxed">
          {errorMsg}
        </div>
      )}

      <div className="space-y-3 mt-6">
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full h-12 flex items-center justify-center gap-3 px-4 rounded-2xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-bold text-sm transition-all shadow-sm active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>
            {loading ? "Google 연결 중..." : "Google 계정으로 로그인"}
          </span>
        </button>
      </div>

      <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-center gap-4 text-xs font-semibold text-slate-400">
        <a href="/about" className="hover:text-slate-700 transition-colors">
          서비스 소개
        </a>
        <span>•</span>
        <a href="/privacy" className="hover:text-slate-700 transition-colors">
          개인정보처리방침
        </a>
        <span>•</span>
        <a href="/terms" className="hover:text-slate-700 transition-colors">
          서비스 이용약관
        </a>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-4 relative overflow-hidden text-[#0F172A]">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#FFF3F4] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 translate-y-1/2 w-96 h-96 bg-[#F5F1FF] rounded-full blur-3xl pointer-events-none" />

      <Suspense
        fallback={
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-[32px] p-8 flex items-center justify-center text-slate-400 shadow-xl">
            <RefreshCw size={24} className="animate-spin text-[#FF5D7B]" />
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  );
}
