import Link from 'next/link';
import { FileText, ArrowLeft } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-rose-500 selection:text-white">
      {/* Header */}
      <header className="border-b border-slate-800/80 bg-slate-900/40 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/about" className="flex items-center gap-2 text-slate-400 hover:text-slate-200 text-xs font-semibold transition-colors">
            <ArrowLeft size={16} />
            <span>서비스 소개로 돌아가기</span>
          </Link>
          <span className="font-bold text-sm text-slate-300">연OX 서비스 이용약관</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12 flex-1 w-full space-y-8">
        <div className="space-y-3 pb-6 border-b border-slate-800">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-semibold">
            <FileText size={14} />
            <span>Terms of Service</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">
            연OX (XOXO) 서비스 이용약관
          </h1>
          <p className="text-xs text-slate-400">
            공고일자: 2026년 08월 19일 | 시행일자: 2026년 08월 19일
          </p>
        </div>

        <div className="space-y-6 text-sm text-slate-300 leading-relaxed">
          <p className="bg-slate-900/50 p-4 rounded-2xl border border-slate-800 text-slate-300">
            본 약관은 연OX(이하 &quot;서비스&quot;)의 이용과 관련하여 운영팀과 이용자 사이의 권리, 의무, 책임사항 및 커뮤니티 이용 규칙을 규정합니다. 이용자는 본 서비스 이용약관에 동의함으로서 서비스 내 모든 활동 수칙과 가이드라인을 완전하게 준수할 것을 약속합니다.
          </p>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span className="w-1.5 h-4 bg-rose-500 rounded-full inline-block"></span>
              제1조 (목적)
            </h2>
            <p className="text-slate-400">
              본 약관은 연OX가 제공하는 애플리케이션 및 제반 서비스의 이용조건, 절차, 회원과 서비스 간의 권리와 의무, 내 연애 성향 테스트, AI 챗봇 상담 기능, 고민글 투표/댓글 피드 및 커뮤니티 활동 수칙을 규정함으로써 집단지성을 통한 성숙하고 건전한 연애 고민 해결을 돕는 것을 목적으로 합니다.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span className="w-1.5 h-4 bg-rose-500 rounded-full inline-block"></span>
              제2조 (용어의 정의 및 주요 기능)
            </h2>
            <ul className="list-disc list-inside space-y-1 text-slate-400 pl-2">
              <li><strong>연OX 고민글:</strong> 회원이 상대방과의 연애 갈등이나 특정 상황에 대해 다른 회원들의 판단과 의견을 구하고자 작성한 게시물</li>
              <li><strong>O/X 투표:</strong> 다른 회원의 사연에 대해 자신의 찬성(O) 또는 반대(X) 의사를 직관적으로 표현하는 투표 시스템</li>
              <li><strong>성향별 분기 댓글:</strong> 자신이 투표한 선택지(O 또는 X)의 성향에 해당하는 주장과 의견을 댓글 및 답글로 소통하는 피드백 시스템</li>
              <li><strong>내 연애 성향 테스트:</strong> 10가지 사물 모티브 기반으로 회원의 4대 연애 스탯, 갈등 해결 방식, 취약점을 도출하는 성향 진단 기능</li>
              <li><strong>1:1 AI 상담 (두림이):</strong> 유저의 연애 성향 진단 결과 및 작성 고민 사연 데이터를 토대로 맞춤형 솔루션을 제공하는 대화형 AI 상담 기능</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span className="w-1.5 h-4 bg-rose-500 rounded-full inline-block"></span>
              제3조 (철저한 익명성 보장 및 개인정보 보호)
            </h2>
            <p className="text-slate-400">
              1. 본 서비스는 모든 활동에 대해 완전한 익명성을 보장합니다. 서비스는 법령에 특별한 규정이 있는 경우를 제외하고 회원의 식별 정보를 제3자에게 노출하지 않습니다.<br />
              2. 회원은 게시물이나 댓글 작성 시 본인 또는 전/현 연인 등 특정 개인을 추적하거나 식별할 수 있는 개인 신상 정보(이름, 전화번호, 직장명, SNS 계정 등)를 노출해서는 안 됩니다.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span className="w-1.5 h-4 bg-rose-500 rounded-full inline-block"></span>
              제4조 (커뮤니티 가이드라인 및 제재 기준)
            </h2>
            <p className="text-slate-400">
              건전하고 안전한 소통 환경 유지를 위해 아래 기준에 따라 위반 콘텐츠는 즉시 삭제되며 계정 이용 제한이 적용됩니다.
            </p>

            <div className="rounded-2xl border border-slate-800 overflow-hidden bg-slate-900/40">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-rose-500/10 border-b border-slate-800 text-rose-300 font-bold">
                  <tr>
                    <th className="py-3 px-4">위반 항목</th>
                    <th className="py-3 px-4">신고 인정 기준</th>
                    <th className="py-3 px-4">1~2회 누적</th>
                    <th className="py-3 px-4">3회 이상</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  <tr>
                    <td className="py-3 px-4 font-semibold text-white">욕설 및 비하</td>
                    <td className="py-3 px-4 text-slate-400">타인 인신공격, 조롱, 혐오 발언</td>
                    <td className="py-3 px-4 text-amber-300">즉시 삭제 및 경고</td>
                    <td className="py-3 px-4 text-rose-400 font-bold">영구 정지</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold text-white">도배 및 스팸</td>
                    <td className="py-3 px-4 text-slate-400">의미 없는 연속 글, 상업적 광고</td>
                    <td className="py-3 px-4 text-amber-300">즉시 삭제 및 경고</td>
                    <td className="py-3 px-4 text-rose-400 font-bold">영구 정지</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold text-white">신상 유포</td>
                    <td className="py-3 px-4 text-slate-400">실명, 연락처, SNS 무단 노출</td>
                    <td className="py-3 px-4 text-rose-300">즉시 삭제 & 7일 정지</td>
                    <td className="py-3 px-4 text-rose-400 font-bold">영구 정지</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold text-white">허위 신고</td>
                    <td className="py-3 px-4 text-slate-400">무고 유저를 고의로 반복 신고</td>
                    <td className="py-3 px-4 text-amber-300">신고 기능 7일 제한</td>
                    <td className="py-3 px-4 text-rose-400 font-bold">영구 정지</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span className="w-1.5 h-4 bg-rose-500 rounded-full inline-block"></span>
              제5조 (게시물의 권리 및 서비스 탈퇴 정책)
            </h2>
            <p className="text-slate-400">
              1. 회원이 작성한 게시물 및 댓글의 저작권은 작성자 본인에게 있습니다.<br />
              2. 회원 탈퇴 시 계정 식별 정보는 완전히 파기되나, 다른 회원의 집단지성 데이터 맥락 유지를 위해 작성한 게시물, 댓글, 투표 기록은 파기되지 않고 작성자를 추적할 수 없는 &apos;완전 익명 상태&apos;로 유지됩니다.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span className="w-1.5 h-4 bg-rose-500 rounded-full inline-block"></span>
              제6조 (고객지원 및 문의)
            </h2>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 space-y-1">
              <p>• <strong>공식 이메일:</strong> rsj01223@gmail.com</p>
              <p>• <strong>담당 부서:</strong> 연OX 운영 및 고객지원팀</p>
            </div>
          </section>
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
