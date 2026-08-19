import Link from "next/link";
import {
  Heart,
  Sparkles,
  MessageCircle,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-rose-500 selection:text-white">
      {/* Top Header */}
      <header className="border-b border-slate-800/80 bg-slate-900/40 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/about" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-500 to-violet-600 flex items-center justify-center font-black text-white text-base shadow-lg shadow-rose-500/25">
              OX
            </div>
            <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
              연OX (XOXO)
            </span>
          </Link>

          <div className="flex items-center gap-4 text-xs font-medium">
            <Link
              href="/privacy"
              className="text-slate-400 hover:text-slate-200 transition-colors"
            >
              개인정보처리방침
            </Link>
            <Link
              href="/terms"
              className="text-slate-400 hover:text-slate-200 transition-colors"
            >
              서비스 이용약관
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-5xl mx-auto px-6 py-20 flex-1 space-y-24">
        <div className="text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-medium">
            <Heart size={14} className="text-rose-400 fill-rose-400/30" />
            <span>집단지성과 AI로 푸는 솔직한 연애 솔루션</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
            연애 고민, 이제 혼자 끙끙 앓지 말고 <br />
            <span className="text-rose-400">O/X 집단지성</span>과{" "}
            <span className="text-violet-400">AI 두림이</span>에게 물어보세요.
          </h1>

          <p className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            친구에게도 말 못 할 연애 갈등부터 사소한 썸 고민까지, 철저한 익명성
            속에서 성향별 찬반 투표와 1:1 맞춤 AI 상담으로 명쾌한 해답을
            찾으세요.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm space-y-4 hover:border-slate-700 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
              <CheckCircle2 size={24} />
            </div>
            <h3 className="text-lg font-bold text-white">
              O/X 투표 & 성향별 피드백
            </h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              사연을 올리면 유저들이 직관적인 O/X 투표로 판단을 내려줍니다. 나와
              같은 선택지를 고른 사람들과의 깊이 있는 댓글 토론을 경험하세요.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm space-y-4 hover:border-slate-700 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
              <Sparkles size={24} />
            </div>
            <h3 className="text-lg font-bold text-white">내 연애 성향 진단</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              10가지 사물 모티브 기반 성향 분석으로 나의 연애 스탯, 갈등 해결
              패턴, 취약점을 진단받고 맞춤형 카드로 관리하세요.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm space-y-4 hover:border-slate-700 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
              <MessageCircle size={24} />
            </div>
            <h3 className="text-lg font-bold text-white">
              1:1 AI 상담사 두림이
            </h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              내 연애 성향과 사연 맥락을 기억하는 Gemini AI 상담사가 24시간
              실시간으로 공감과 현실적인 해결 방안을 제안합니다.
            </p>
          </div>
        </div>

        {/* Trust & Safety Section */}
        <div className="p-8 rounded-3xl bg-gradient-to-b from-slate-900/90 to-slate-950 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
              <ShieldCheck size={18} />
              <span>100% 완전 익명 보장 & 실시간 클린 필터링</span>
            </div>
            <p className="text-xs text-slate-400 max-w-xl">
              어떠한 개인 신상도 외부에 노출되지 않으며, 악성 비방 및 도배
              행위는 Gemini AI 자동 검수 엔진과 신고 시스템에 의해 철저히
              보호됩니다.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/privacy"
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
            >
              개인정보처리방침
            </Link>
            <Link
              href="/terms"
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
            >
              이용약관
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-900/20 py-8 text-xs text-slate-500 text-center space-y-2">
        <p>© 2026 연OX (XOXO) 운영팀. All rights reserved.</p>
        <p>문의: rsj01223@gmail.com</p>
      </footer>
    </div>
  );
}
