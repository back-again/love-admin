"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Sparkles, CheckCircle, XCircle } from "lucide-react";
import Header from "../../_component/Header";

export default function AiTesterArea() {
  const [testTitle, setTestTitle] = useState("");
  const [testContent, setTestContent] = useState("");
  const [aiResult, setAiResult] = useState<any>(null);
  const [aiLoading, setAiLoading] = useState(false);

  const runAiInspect = async () => {
    if (!testTitle.trim() && !testContent.trim()) {
      alert("제목이나 내용을 입력해주세요.");
      return;
    }
    setAiLoading(true);
    setAiResult(null);
    try {
      const { data, error } = await supabase.functions.invoke(
        "inspect-post-quality",
        {
          body: { title: testTitle, content: testContent },
        }
      );
      if (error) throw error;
      setAiResult(data);
    } catch (err: any) {
      setAiResult({
        is_approved: false,
        reason_code: "ERROR",
        message: err.message || "호출 실패",
      });
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <>
      <Header title="Gemini AI 콘텐츠 품질 검수 시뮬레이터" />

      <div className="flex-1 overflow-y-auto p-8 bg-[#F8FAFC]">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 mb-1.5 flex items-center gap-2">
              <Sparkles size={18} className="text-[#8B75F9]" />
              Gemini 2.5 Flash Lite 콘텐츠 자동 검수 시뮬레이터
            </h3>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              Supabase Edge Function (`inspect-post-quality`)을 직접 호출하여
              도배/스팸/비방 정책 위반 여부를 실시간으로 테스트합니다.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  게시글 제목
                </label>
                <input
                  type="text"
                  placeholder="테스트할 제목 입력..."
                  value={testTitle}
                  onChange={(e) => setTestTitle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-900 focus:outline-none focus:border-[#8B75F9]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  게시글 본문
                </label>
                <textarea
                  rows={5}
                  placeholder="테스트할 본문 내용 입력 (예: ㅋㅋㅋㅋㅋㅋ 도배, 오픈채팅방 링크 홍보, 욕설 비방 등)..."
                  value={testContent}
                  onChange={(e) => setTestContent(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-900 focus:outline-none focus:border-[#8B75F9]"
                />
              </div>

              <button
                onClick={runAiInspect}
                disabled={aiLoading}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#8B75F9] to-indigo-600 text-white font-bold text-sm shadow-md shadow-[#8B75F9]/25 hover:opacity-95 transition-opacity flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Sparkles
                  size={16}
                  className={aiLoading ? "animate-spin" : ""}
                />
                {aiLoading ? "AI 검수 분석 중..." : "AI 검수 실행"}
              </button>
            </div>
          </div>

          {aiResult && (
            <div
              className={`p-6 rounded-3xl border ${
                aiResult.is_approved
                  ? "bg-emerald-50/70 border-emerald-200"
                  : "bg-rose-50/70 border-rose-200"
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                {aiResult.is_approved ? (
                  <CheckCircle className="text-emerald-500" size={24} />
                ) : (
                  <XCircle className="text-[#FF5D7B]" size={24} />
                )}
                <h4 className="font-bold text-base text-slate-900">
                  {aiResult.is_approved
                    ? "검수 통과 (정상 게시글)"
                    : "검수 반려 (제재 사유 감지)"}
                </h4>
              </div>

              <div className="space-y-1.5 text-xs text-slate-700">
                <p>
                  <strong className="text-slate-500">사유 코드:</strong>{" "}
                  <span className="font-mono font-semibold">{aiResult.reason_code}</span>
                </p>
                {aiResult.message && (
                  <p>
                    <strong className="text-slate-500">
                      사용자 안내 문구:
                    </strong>{" "}
                    <span className="text-[#FF5D7B] font-bold">
                      {aiResult.message}
                    </span>
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
