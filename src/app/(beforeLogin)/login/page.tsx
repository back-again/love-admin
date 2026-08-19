"use client";

import { Suspense, useState } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { RefreshCw } from "lucide-react";

function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const [loadingProvider, setLoadingProvider] = useState<
    "google" | "apple" | "credentials" | null
  >(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleOAuthLogin = async (provider: "google" | "apple") => {
    try {
      setLoadingProvider(provider);
      setErrorMsg(null);
      await signIn(provider, { callbackUrl });
    } catch (err: any) {
      setErrorMsg(err.message || `${provider} 로그인 중 오류가 발생했습니다.`);
      setLoadingProvider(null);
    }
  };

  return (
    <div className="w-full max-w-md bg-slate-900/80 backdrop-blur-2xl border border-slate-800 rounded-3xl p-8 shadow-2xl shadow-black/60 relative z-10">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
          XOXO
        </h1>
        <p className="text-xs text-slate-400 mt-1.5">
          관리자 계정으로 로그인하여 서비스를 관리하세요.
        </p>
      </div>

      {errorMsg && (
        <div className="mb-6 p-3.5 rounded-xl bg-rose-950/40 border border-rose-800/60 text-xs text-rose-300">
          {errorMsg}
        </div>
      )}

      <div className="space-y-3">
        {/* Google Login Button */}
        <button
          type="button"
          onClick={() => handleOAuthLogin("google")}
          disabled={loadingProvider !== null}
          className="w-full h-12 flex items-center justify-center gap-3 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-semibold text-sm transition-all shadow-md active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
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
            {loadingProvider === "google"
              ? "Google 연결 중..."
              : "Google 계정으로 로그인"}
          </span>
        </button>

        {/* Apple Login Button */}
        <button
          type="button"
          onClick={() => handleOAuthLogin("apple")}
          disabled={loadingProvider !== null}
          className="w-full h-12 flex items-center justify-center gap-3 px-4 rounded-xl bg-black hover:bg-slate-900 border border-slate-700/80 text-white font-semibold text-sm transition-all shadow-md active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          <svg className="w-5 h-5 fill-current" viewBox="0 0 170 170">
            <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.04-7.64-7.73-11.83-14.07-5.91-9.01-10.45-19.34-13.62-31-3.17-11.66-4.76-22.75-4.76-33.27 0-14.54 3.73-26.68 11.2-36.41 7.46-9.74 16.89-14.71 28.28-14.92 4.58 0 9.74 1.16 15.48 3.49 5.74 2.33 9.77 3.55 12.09 3.65 2.12 0 6.37-1.27 12.74-3.8 6.38-2.54 11.66-3.6 15.86-3.2 11.67.95 20.89 5.4 27.65 13.33-10.42 6.32-15.53 15.02-15.34 26.1.18 8.68 3.52 16.03 10.02 22.04 6.5 6.01 14.15 9.4 22.95 10.16-2.22 6.77-4.97 13.72-8.25 20.86zM119.22 31.84c0-7.39 2.65-14.43 7.95-21.11 5.3-6.68 11.89-10.61 19.78-11.79.74 2.12 1.11 4.29 1.11 6.51 0 7.39-2.75 14.54-8.25 21.43-5.5 6.89-12.16 10.74-19.98 11.53-.21-2.12-.61-4.31-.61-6.57z" />
          </svg>
          <span>
            {loadingProvider === "apple"
              ? "Apple 연결 중..."
              : "Apple로 로그인"}
          </span>
        </button>
      </div>

      <div className="mt-8 pt-6 border-t border-slate-800 flex items-center justify-center gap-4 text-xs text-slate-500">
        <a href="/about" className="hover:text-slate-300 transition-colors">
          서비스 소개
        </a>
        <span>•</span>
        <a href="/privacy" className="hover:text-slate-300 transition-colors">
          개인정보처리방침
        </a>
        <span>•</span>
        <a href="/terms" className="hover:text-slate-300 transition-colors">
          서비스 이용약관
        </a>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden text-slate-100">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 translate-y-1/2 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

      <Suspense
        fallback={
          <div className="w-full max-w-md bg-slate-900/80 border border-slate-800 rounded-3xl p-8 flex items-center justify-center text-slate-400">
            <RefreshCw size={24} className="animate-spin text-rose-500" />
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  );
}
