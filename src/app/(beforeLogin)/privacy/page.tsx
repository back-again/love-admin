import Link from 'next/link';
import Image from 'next/image';
import { Shield, ArrowLeft } from 'lucide-react';
import logoImg from '@/assets/logo.png';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col justify-between selection:bg-[#FFF3F4] selection:text-[#FF5D7B]">
      <header className="border-b border-slate-200/80 bg-white/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/about" className="flex items-center gap-1.5 text-slate-600 hover:text-slate-900 text-xs font-bold transition-colors">
            <ArrowLeft size={16} />
            <span>서비스 소개로 돌아가기</span>
          </Link>
          <span className="font-extrabold text-sm text-slate-800">개인정보처리방침</span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12 flex-1 w-full space-y-8">
        <div className="space-y-3 pb-6 border-b border-slate-200">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 text-xs font-bold">
            <Shield size={14} />
            <span>Privacy Policy</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900">
            연OX 개인정보처리방침
          </h1>
          <p className="text-xs text-slate-400 font-medium">
            공고일자: 2026년 08월 19일 | 시행일자: 2026년 08월 19일
          </p>
        </div>

        <div className="space-y-6 text-sm text-slate-600 leading-relaxed bg-white p-8 rounded-[32px] border border-slate-200/80 shadow-sm">
          <p className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-slate-700 font-medium">
            연OX 운영팀(이하 &quot;운영팀&quot;)은 「개인정보 보호법」 등 관련 법령을 준수하며, 회원의 개인정보를 보호하고 고충을 신속하게 처리하기 위해 다음과 같이 개인정보처리방침을 수립·공개합니다.
          </p>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="w-1.5 h-4 bg-[#FF5D7B] rounded-full inline-block"></span>
              1. 개인정보의 수집 및 이용 목적
            </h2>
            <ul className="list-disc list-inside space-y-1 text-slate-500 pl-2">
              <li><strong>회원 관리:</strong> 소셜 로그인을 통한 회원 식별 및 인증, 중복 가입 및 부정 이용 방지</li>
              <li><strong>서비스 제공:</strong> 고민글 및 찬반 투표 결과 조회, 연애 성향 진단 분석 데이터 관리, 1:1 AI 상담 내역 관리</li>
              <li><strong>고충 처리:</strong> 문의사항 접수 및 피드백 반영, 불량 회원 신고 및 차단 조치</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="w-1.5 h-4 bg-[#FF5D7B] rounded-full inline-block"></span>
              2. 수집하는 개인정보의 항목 및 방법
            </h2>
            <ul className="list-disc list-inside space-y-1 text-slate-500 pl-2">
              <li><strong>필수 항목:</strong> 이메일 주소, 소셜 회원 식별자(ID)</li>
              <li><strong>선택 항목:</strong> 성별, 생년월일 (맞춤형 성향 분석용)</li>
              <li><strong>자동 수집 항목:</strong> 서비스 이용 기록, 접속 로그, 기기 정보, 쿠키</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="w-1.5 h-4 bg-[#FF5D7B] rounded-full inline-block"></span>
              3. 개인정보의 보유 및 이용 기간
            </h2>
            <div className="space-y-2 text-slate-500">
              <p>1. 회원 탈퇴 시 개인 식별 정보는 지체 없이 즉시 완전히 파기됩니다.</p>
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs leading-relaxed font-medium">
                <strong>[중요 - 탈퇴 후 데이터 잔존 정책]:</strong> 탈퇴 시 개인 식별 정보는 완전 파기되며, 서버에 남은 고민글, 댓글, 투표 기록은 작성자를 추적할 수 없는 &apos;완전한 익명 데이터&apos;로 전환되어 집단지성 맥락 유지를 위해 보존됩니다.
              </div>
            </div>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="w-1.5 h-4 bg-[#FF5D7B] rounded-full inline-block"></span>
              4. 개인정보의 제3자 제공 및 처리위탁
            </h2>
            <p className="text-slate-500">
              운영팀은 회원의 사전 동의 없이는 원칙적으로 개인정보를 외부에 제공하거나 위탁하지 않습니다. 단, 법령의 규정에 의거하거나 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우는 예외로 합니다.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="w-1.5 h-4 bg-[#FF5D7B] rounded-full inline-block"></span>
              5. 정보주체의 권리·의무 및 행사방법
            </h2>
            <p className="text-slate-500">
              회원은 언제든지 개인정보 열람·정정·삭제 및 회원 탈퇴 요구를 할 수 있습니다. 탈퇴 완료 후에는 익명 전환되어 게시물에 대한 직접 정정/삭제 요구가 불가능하므로, 삭제를 원하는 게시물은 탈퇴 전 직접 삭제하셔야 합니다.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="w-1.5 h-4 bg-[#FF5D7B] rounded-full inline-block"></span>
              6. 개인정보의 안전성 확보 조치
            </h2>
            <ul className="list-disc list-inside space-y-1 text-slate-500 pl-2">
              <li>개인정보의 암호화 전송 (HTTPS / SSL 보안 프로토콜 적용)</li>
              <li>해킹 등에 대비한 기술적 대책 및 보안 서버 구축</li>
              <li>개인정보 취급 담당자의 최소화 및 보안 교육 이수</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="w-1.5 h-4 bg-[#FF5D7B] rounded-full inline-block"></span>
              7. 개인정보 보호책임자 및 고충처리
            </h2>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-700 space-y-1">
              <p>• <strong>책임자:</strong> 연OX 개인정보 보호책임자</p>
              <p>• <strong>이메일:</strong> rsj01223@gmail.com</p>
              <p>• <strong>처리 기간:</strong> 문의 접수 후 영업일 기준 48시간 이내 회신</p>
            </div>
          </section>
        </div>
      </main>

      <footer className="border-t border-slate-200/80 bg-white py-8 text-xs text-slate-400 text-center space-y-1 font-medium">
        <p>© 2026 연OX 운영팀. All rights reserved.</p>
        <p>문의: rsj01223@gmail.com</p>
      </footer>
    </div>
  );
}
