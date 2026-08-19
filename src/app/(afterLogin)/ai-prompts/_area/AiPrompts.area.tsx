"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import {
  Sparkles,
  Save,
  RotateCcw,
  Play,
  Clock,
  Code2,
} from "lucide-react";
import Header from "../../_component/Header";
import { supabase } from "@/lib/supabase";

const PROMPT_META: Record<
  string,
  { label: string; description: string; edgeFunction?: string }
> = {
  inspect_post_quality: {
    label: "게시글 품질 및 스팸 검수",
    description:
      "게시글 작성 시 도배, 상업적 홍보 링크, 과도한 비속어를 실시간으로 감지하고 차단하는 AI 검수 규칙입니다.",
    edgeFunction: "inspect-post-quality",
  },
  generate_vote_options: {
    label: "투표 O/X 선택지 자동 생성",
    description:
      "게시글 내용과 작성자의 고민 상황을 분석하여, 5대 유형(판단, 선택, 공감, 액션, 평가)에 맞는 맞춤형 투표 버튼 문구를 생성하는 AI 엔진 규칙입니다.",
    edgeFunction: "generate-vote-options",
  },
};

export default function AiPromptsArea() {
  const [loading, setLoading] = useState(false);
  const [prompts, setPrompts] = useState<any[]>([]);
  const [activeType, setActiveType] = useState<string>("inspect_post_quality");

  const [currentPromptText, setCurrentPromptText] = useState("");
  const [originalPromptText, setOriginalPromptText] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const [testTitle, setTestTitle] = useState("소개팅 첫 만남 더치페이");
  const [testContent, setTestContent] = useState(
    "첫 만남에 남자가 밥값을 1원 단위까지 더치페이하자고 카톡 보냈는데 너무 정떨어지는데 제가 예민한가요?"
  );
  const [testResult, setTestResult] = useState<any>(null);
  const [testLoading, setTestLoading] = useState(false);

  const fetchPrompts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/ai-prompts");
      const data = await res.json();
      if (res.ok && data.success) {
        setPrompts(data.prompts || []);
        const found = (data.prompts || []).find(
          (p: any) => p.type === activeType
        );
        if (found) {
          setCurrentPromptText(found.prompt);
          setOriginalPromptText(found.prompt);
        } else if (data.prompts?.[0]) {
          setActiveType(data.prompts[0].type);
          setCurrentPromptText(data.prompts[0].prompt);
          setOriginalPromptText(data.prompts[0].prompt);
        }
      } else {
        console.error("Error fetching prompts:", data.error);
      }
    } catch (err) {
      console.error("Fetch prompts exception:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrompts();
  }, []);

  const handleSelectTab = (type: string) => {
    setActiveType(type);
    const target = prompts.find((p) => p.type === type);
    if (target) {
      setCurrentPromptText(target.prompt);
      setOriginalPromptText(target.prompt);
    } else {
      setCurrentPromptText("");
      setOriginalPromptText("");
    }
    setTestResult(null);
  };

  const handleSavePrompt = async () => {
    if (!activeType || !currentPromptText.trim()) {
      alert("프롬프트 내용을 입력해주세요.");
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/ai-prompts", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: activeType,
          prompt: currentPromptText,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setOriginalPromptText(currentPromptText);
        setPrompts((prev) =>
          prev.map((p) =>
            p.type === activeType
              ? { ...p, prompt: currentPromptText, updated_at: new Date().toISOString() }
              : p
          )
        );
        alert("AI 프롬프트가 성공적으로 저장되었습니다.\nEdge Function 및 서비스에 즉시 반영됩니다.");
      } else {
        alert("저장 실패: " + (data.error || "오류가 발생했습니다."));
      }
    } catch (err: any) {
      alert("오류: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetPrompt = () => {
    if (confirm("수정 중인 내용을 취소하고 기존 프롬프트로 되돌리시겠습니까?")) {
      setCurrentPromptText(originalPromptText);
    }
  };

  const runTest = async () => {
    if (!testTitle.trim() && !testContent.trim()) {
      alert("테스트할 제목이나 본문을 입력해주세요.");
      return;
    }

    setTestLoading(true);
    setTestResult(null);

    const fnName = PROMPT_META[activeType]?.edgeFunction || "inspect-post-quality";

    try {
      const { data, error } = await supabase.functions.invoke(fnName, {
        body: { title: testTitle, content: testContent },
      });

      if (error) throw error;
      setTestResult(data);
    } catch (err: any) {
      setTestResult({
        error: true,
        message: err.message || "호출 중 오류가 발생했습니다.",
      });
    } finally {
      setTestLoading(false);
    }
  };

  const isModified = currentPromptText !== originalPromptText;
  const activePromptObj = prompts.find((p) => p.type === activeType);
  const meta = PROMPT_META[activeType] || {
    label: activeType,
    description: "사용자 정의 AI 프롬프트 규칙입니다.",
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Header
        title="AI 프롬프트 및 검수 엔진 관리"
        onRefresh={fetchPrompts}
        loading={loading}
      />

      <div className="flex-1 flex flex-col min-h-0 p-5 bg-[#F8FAFC] overflow-hidden">
        {/* Top Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 flex-shrink-0">
          {prompts.map((p) => {
            const tabMeta = PROMPT_META[p.type] || { label: p.type };
            const isActive = activeType === p.type;

            return (
              <button
                key={p.type}
                onClick={() => handleSelectTab(p.type)}
                className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer flex-shrink-0 ${
                  isActive
                    ? "bg-gradient-to-r from-[#8B75F9] to-indigo-600 text-white shadow-md shadow-indigo-500/20"
                    : "bg-white border border-slate-200/80 text-slate-600 hover:text-slate-900 hover:bg-slate-50 shadow-xs"
                }`}
              >
                <Sparkles size={14} className={isActive ? "text-amber-300" : "text-slate-400"} />
                <span>{tabMeta.label}</span>
                <span
                  className={`font-mono text-[10px] px-1.5 py-0.2 rounded-md ${
                    isActive ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {p.type}
                </span>
              </button>
            );
          })}
        </div>

        {/* 100% Height 2-Column Split Layout */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-5 min-h-0 h-full">
          {/* Left Column: Big Prompt Editor (7 cols) */}
          <div className="lg:col-span-7 h-full flex flex-col min-h-0 rounded-[32px] bg-white border border-slate-200/80 p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3 flex-shrink-0">
              <div className="space-y-0.5 min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-extrabold text-slate-900 truncate">
                    {meta.label}
                  </h3>
                  <span className="px-2 py-0.5 rounded-lg bg-[#F5F1FF] text-[#8B75F9] font-mono text-[11px] font-bold flex-shrink-0">
                    {activeType}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 truncate">
                  {meta.description}
                </p>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                {isModified && (
                  <button
                    onClick={handleResetPrompt}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <RotateCcw size={13} />
                    되돌리기
                  </button>
                )}

                <button
                  onClick={handleSavePrompt}
                  disabled={isSaving}
                  className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm ${
                    isModified
                      ? "bg-[#FF5D7B] hover:bg-[#ff4b6d] text-white shadow-[#FF5D7B]/30 animate-pulse"
                      : "bg-slate-900 hover:bg-slate-800 text-white"
                  }`}
                >
                  <Save size={14} />
                  <span>{isSaving ? "저장 중..." : isModified ? "변경사항 저장 *" : "프롬프트 저장"}</span>
                </button>
              </div>
            </div>

            {/* Prompt Textarea */}
            <div className="flex-1 flex flex-col min-h-0 space-y-1.5">
              <div className="flex items-center justify-between text-xs text-slate-400 flex-shrink-0">
                <span className="font-bold flex items-center gap-1 text-slate-700 text-[11px]">
                  <Code2 size={13} className="text-[#8B75F9]" />
                  시스템 프롬프트 지시문 (System Instruction)
                </span>
                <span className="font-mono text-[11px] text-slate-500 font-semibold">
                  글자수: {currentPromptText.length.toLocaleString()}자 | 줄수: {currentPromptText.split("\n").length}줄
                </span>
              </div>

              <textarea
                value={currentPromptText}
                onChange={(e) => setCurrentPromptText(e.target.value)}
                className="flex-1 min-h-0 w-full p-4 bg-slate-50 text-slate-900 font-mono text-xs leading-relaxed rounded-2xl border border-slate-200/90 focus:bg-white focus:outline-none focus:border-[#8B75F9] focus:ring-2 focus:ring-[#8B75F9]/20 shadow-xs selection:bg-[#FFF3F4] selection:text-[#FF5D7B] resize-none overflow-y-auto"
                placeholder="AI 시스템 프롬프트 지시문을 입력하세요..."
                spellCheck={false}
              />

              {activePromptObj?.updated_at && (
                <div className="text-[10px] text-slate-400 font-mono flex items-center gap-1 pt-0.5 justify-end flex-shrink-0">
                  <Clock size={11} />
                  마지막 저장: {format(new Date(activePromptObj.updated_at), "yyyy-MM-dd HH:mm:ss")}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Live Simulator Test (5 cols) */}
          <div className="lg:col-span-5 h-full flex flex-col min-h-0 rounded-[32px] bg-white border border-slate-200/80 p-5 shadow-sm space-y-3 overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 flex-shrink-0">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-violet-50 flex items-center justify-center text-[#8B75F9] flex-shrink-0">
                  <Play size={15} />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-slate-900 truncate">
                    실시간 AI 테스트 시뮬레이터
                  </h4>
                  <p className="text-[10px] text-slate-400 truncate">
                    Gemini AI 호출 및 JSON 응답 검증
                  </p>
                </div>
              </div>

              <button
                onClick={runTest}
                disabled={testLoading}
                className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#8B75F9] to-indigo-600 text-white font-bold text-xs shadow-sm hover:opacity-95 transition-opacity flex items-center gap-1.5 cursor-pointer disabled:opacity-50 flex-shrink-0"
              >
                <Sparkles size={13} className={testLoading ? "animate-spin" : ""} />
                <span>{testLoading ? "분석 중..." : "테스트 실행"}</span>
              </button>
            </div>

            <div className="flex-1 flex flex-col min-h-0 space-y-3 overflow-hidden">
              <div className="flex-shrink-0 space-y-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-0.5">
                    테스트 게시글 제목
                  </label>
                  <input
                    type="text"
                    value={testTitle}
                    onChange={(e) => setTestTitle(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#8B75F9]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-0.5">
                    테스트 게시글 본문
                  </label>
                  <textarea
                    rows={3}
                    value={testContent}
                    onChange={(e) => setTestContent(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#8B75F9] resize-none"
                  />
                </div>
              </div>

              <div className="flex-1 flex flex-col min-h-0 bg-slate-50 rounded-2xl p-3 border border-slate-200 overflow-hidden">
                <span className="text-[10px] font-bold text-slate-600 block mb-1 flex-shrink-0">
                  AI 엔진 응답 결과 (JSON Output)
                </span>

                <div className="flex-1 min-h-0 h-full overflow-hidden flex flex-col">
                  {testLoading ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-xs text-slate-400 gap-2">
                      <Sparkles size={20} className="animate-spin text-[#8B75F9]" />
                      <span>Gemini 2.5 Flash Lite가 응답을 생성하고 있습니다...</span>
                    </div>
                  ) : testResult ? (
                    <pre className="flex-1 min-h-0 h-full p-3 bg-white text-slate-900 font-mono text-[11px] rounded-xl overflow-y-auto leading-relaxed border border-slate-200 shadow-2xs">
                      {JSON.stringify(testResult, null, 2)}
                    </pre>
                  ) : (
                    <div className="flex-1 flex items-center justify-center text-center text-xs text-slate-400 p-4">
                      상단의 &apos;테스트 실행&apos; 버튼을 눌러 AI 응답 결과를 확인해보세요.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
