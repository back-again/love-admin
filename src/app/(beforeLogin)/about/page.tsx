import Link from "next/link";
import Image from "next/image";
import {
  Heart,
  Sparkles,
  MessageCircle,
  ShieldCheck,
  CheckCircle2,
  Lock,
  FileCheck,
} from "lucide-react";
import logoImg from "@/assets/logo.png";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col justify-between selection:bg-[#FFF3F4] selection:text-[#FF5D7B]">
      <header className="border-b border-slate-200/80 bg-white/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-end">
          <div className="flex items-center gap-4 text-xs font-bold">
            <Link
              href="/privacy"
              className="text-slate-500 hover:text-slate-900 transition-colors"
            >
              개인정보처리방침
            </Link>
            <Link
              href="/terms"
              className="text-slate-500 hover:text-slate-900 transition-colors"
            >
              서비스 이용약관
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-16 flex-1 space-y-20">
        <div className="text-center space-y-6">
          <div className="flex justify-center mb-2">
            <Image
              src={logoImg}
              alt="연OX 로고"
              priority
              className="h-24 md:h-32 w-auto object-contain drop-shadow-md"
            />
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFF3F4] border border-[#FF5D7B]/20 text-[#FF5D7B] text-xs font-bold">
            <Heart size={14} className="fill-[#FF5D7B]/30" />
            <span>건강한 연애를 위한 연애 커뮤니티</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight text-[#0F172A]">
            연애 고민, 이제 혼자 끙끙 앓지 마세요
          </h1>

          <p className="text-slate-600 text-base md:text-lg font-semibold max-w-3xl mx-auto leading-relaxed">
            집단지성 O/X 찬반 투표와 1:1 맞춤 AI 상담으로 연애 갈등과 고민을 해결하는 모바일 및 웹 서비스입니다.
          </p>

          <p className="text-slate-500 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            친구에게도 털어놓기 힘든 연애 고민을 완전한 익명성 속에서 나누고,
            성향별 투표 피드백과 AI 상담을 통해 건강하고 성숙한 관계를 유지할 수 있도록 지원합니다.
          </p>
        </div>

        <div className="p-8 rounded-[32px] bg-white border border-slate-200/80 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="w-10 h-10 rounded-2xl bg-[#F5F1FF] flex items-center justify-center text-[#8B75F9]">
              <FileCheck size={20} />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">연OX 애플리케이션의 목적 및 이용 안내</h2>
              <p className="text-xs text-slate-400">Application Purpose and Usage Guidelines</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-600 leading-relaxed">
            <div className="space-y-2 p-5 rounded-2xl bg-slate-50 border border-slate-100">
              <h3 className="font-bold text-[#FF5D7B] text-sm flex items-center gap-1.5">
                <CheckCircle2 size={16} />
                서비스의 주된 목적
              </h3>
              <p>
                <strong>연OX</strong>는 이용자의 연애 사연을 바탕으로 한 O/X 집단지성 투표, 맞춤형 연애 성향 진단 테스트,
                그리고 대화형 AI 상담을 제공하여 건전하고 성숙한 연애 및 갈등 해결을 돕는 것을 목적으로 합니다.
              </p>
            </div>

            <div className="space-y-2 p-5 rounded-2xl bg-slate-50 border border-slate-100">
              <h3 className="font-bold text-[#8B75F9] text-sm flex items-center gap-1.5">
                <Lock size={16} />
                Google 계정 로그인 목적
              </h3>
              <p>
                Google 로그인은 이용자 본인 식별, 안전한 계정 생성 및 서비스 데이터(작성 고민글, 투표 내역, 성향 진단 결과)의
                동기화와 서비스 운영 관리를 위한 본인 인증 용도로만 사용됩니다.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-8 rounded-[32px] bg-white border border-slate-200/80 shadow-sm space-y-4 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-[#FFF3F4] flex items-center justify-center text-[#FF5D7B]">
              <CheckCircle2 size={24} />
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              O/X 투표 & 성향별 피드백
            </h3>
            <p className="text-slate-500 text-xs leading-relaxed">
              사연을 등록하면 유저들이 직관적인 O/X 투표로 판단을 내려줍니다. 나와
              같은 선택지를 고른 사람들과의 깊이 있는 댓글 토론을 나눌 수 있습니다.
            </p>
          </div>

          <div className="p-8 rounded-[32px] bg-white border border-slate-200/80 shadow-sm space-y-4 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-[#F5F1FF] flex items-center justify-center text-[#8B75F9]">
              <Sparkles size={24} />
            </div>
            <h3 className="text-lg font-bold text-slate-900">내 연애 성향 진단</h3>
            <p className="text-slate-500 text-xs leading-relaxed">
              10가지 사물 모티브 기반 성향 분석으로 나의 연애 스탯, 갈등 해결
              패턴, 취약점을 진단받고 맞춤형 카드로 관리할 수 있습니다.
            </p>
          </div>

          <div className="p-8 rounded-[32px] bg-white border border-slate-200/80 shadow-sm space-y-4 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-sky-50 flex items-center justify-center text-sky-500">
              <MessageCircle size={24} />
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              1:1 AI 상담사 두림이
            </h3>
            <p className="text-slate-500 text-xs leading-relaxed">
              내 연애 성향과 사연 맥락을 기억하는 Gemini AI 상담사가 24시간
              실시간으로 공감과 현실적인 해결 방안을 제안합니다.
            </p>
          </div>
        </div>

        <div className="p-8 rounded-[32px] bg-white border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
              <ShieldCheck size={18} />
              <span>100% 완전 익명 보장 & 실시간 클린 필터링</span>
            </div>
            <p className="text-xs text-slate-500 max-w-xl leading-relaxed">
              어떠한 개인 신상도 외부에 노출되지 않으며, 악성 비방 및 도배
              행위는 Gemini AI 자동 검수 엔진과 신고 시스템에 의해 철저히 보호됩니다.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/privacy"
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
            >
              개인정보처리방침
            </Link>
            <Link
              href="/terms"
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
            >
              이용약관
            </Link>
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-200/80 bg-white py-8 text-xs text-slate-400 text-center space-y-1 font-medium">
        <p>© 2026 연OX 운영팀. All rights reserved.</p>
        <p>문의: rsj01223@gmail.com</p>
      </footer>
    </div>
  );
}
