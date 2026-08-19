"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Search, Trash2, MessageSquare, CornerDownRight, User, Heart } from "lucide-react";
import Header from "../../_component/Header";

export default function PostsArea() {
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const formatGender = (gender?: string) => {
    if (gender === "male") return "남";
    if (gender === "female") return "여";
    return gender || null;
  };

  const fetchPostsWithComments = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/posts");
      const data = await res.json();
      if (res.ok && data.success) {
        setPosts(data.posts || []);
      } else {
        console.error("Error fetching posts:", data.error);
      }
    } catch (err) {
      console.error("Error fetching posts API:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPostsWithComments();
  }, []);

  const handleDeletePost = async (id: string) => {
    if (
      !confirm(
        "정말 이 게시글을 삭제하시겠습니까? 관련 투표와 댓글도 함께 삭제됩니다."
      )
    )
      return;
    try {
      const res = await fetch("/api/admin/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "post", id }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setPosts((prev) => prev.filter((p) => p.id !== id));
        alert("게시글이 삭제되었습니다.");
      } else {
        alert("삭제 실패: " + (data.error || "오류가 발생했습니다."));
      }
    } catch (e: any) {
      alert("오류: " + e.message);
    }
  };

  const handleDeleteComment = async (postId: string, commentId: string) => {
    if (!confirm("정말 이 댓글을 삭제하시겠습니까?")) return;
    try {
      const res = await fetch("/api/admin/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "comment", id: commentId }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setPosts((prev) =>
          prev.map((p) =>
            p.id === postId
              ? {
                  ...p,
                  comments: p.comments.filter((c: any) => c.id !== commentId),
                  comment_count: Math.max(0, (p.comment_count || 1) - 1),
                }
              : p
          )
        );
        alert("댓글이 삭제되었습니다.");
      } else {
        alert("삭제 실패: " + (data.error || "오류가 발생했습니다."));
      }
    } catch (e: any) {
      alert("오류: " + e.message);
    }
  };

  const filteredPosts = posts.filter(
    (p) =>
      !searchTerm ||
      p.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.user_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.user_info?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.user_info?.provider?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.title?.includes(searchTerm) ||
      p.content?.includes(searchTerm) ||
      p.comments?.some(
        (c: any) =>
          c.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.user_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.user_info?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.user_info?.provider?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.content?.includes(searchTerm) ||
          c.likes?.some(
            (l: any) =>
              l.user_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
              l.user_info?.email?.toLowerCase().includes(searchTerm.toLowerCase())
          )
      )
  );

  return (
    <>
      <Header
        title="게시글 & 댓글 통합 관리"
        onRefresh={fetchPostsWithComments}
        loading={loading}
      />

      <div className="flex-1 overflow-y-auto p-8 bg-[#F8FAFC]">
        <div className="space-y-6 max-w-5xl mx-auto">
          <div className="flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search
                size={16}
                className="absolute left-3.5 top-3 text-slate-400"
              />
              <input
                type="text"
                placeholder="게시글ID, 유저ID, 이메일, 제목, 본문, 댓글 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-2xl text-sm text-slate-900 focus:outline-none focus:border-[#FF5D7B] shadow-sm"
              />
            </div>
            <div className="text-xs text-slate-500 font-semibold">
              총 <span className="text-[#FF5D7B] font-bold">{filteredPosts.length}</span>개의 게시글
            </div>
          </div>

          {filteredPosts.length === 0 ? (
            <div className="p-16 rounded-[32px] bg-white border border-slate-200 text-center text-slate-400 shadow-sm">
              게시글 데이터가 없습니다.
            </div>
          ) : (
            <div className="space-y-5">
              {filteredPosts.map((p) => {
                const u = p.user_info;
                const gender = formatGender(u?.gender);
                const birthYear = u?.birth_year ? `${u.birth_year}년생` : null;

                return (
                  <div
                    key={p.id}
                    className="rounded-[32px] bg-white border border-slate-200/80 p-6 shadow-sm hover:shadow-md transition-shadow space-y-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-2 min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap text-xs">
                          <span className="px-2.5 py-0.5 rounded-full bg-[#FFF3F4] text-[#FF5D7B] font-bold">
                            {p.category || "일반"}
                          </span>

                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-700 font-mono text-xs font-bold">
                            <span className="text-slate-400 font-sans font-medium text-[11px]">게시글 ID:</span>
                            {p.id}
                          </span>

                          <span className="text-slate-400 font-mono">
                            {p.created_at
                              ? format(new Date(p.created_at), "yyyy-MM-dd HH:mm:ss")
                              : "-"}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 flex-wrap text-xs pt-0.5">
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 text-slate-800 font-medium">
                            <User size={13} className="text-[#FF5D7B]" />
                            <span className="text-slate-500 font-normal">작성자:</span>
                            <span className="font-bold text-slate-900">{u?.email || "이메일 없음"}</span>
                            {u?.provider && (
                              <span className="px-1.5 py-0.2 rounded bg-white text-[10px] text-slate-600 font-bold uppercase border border-slate-200">
                                {u.provider}
                              </span>
                            )}
                            {gender && (
                              <span className="text-slate-600 font-semibold">
                                {gender}
                              </span>
                            )}
                            {birthYear && (
                              <span className="text-slate-600">
                                {birthYear}
                              </span>
                            )}
                            <span className="text-slate-400 font-mono text-[11px] pl-1 border-l border-slate-300">
                              유저 ID: {p.user_id || "없음"}
                            </span>
                          </div>
                        </div>

                        <h3 className="text-base font-bold text-slate-900 leading-snug pt-1">
                          {p.title}
                        </h3>

                        <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap">
                          {p.content}
                        </p>
                      </div>

                      <div className="flex items-center gap-3 flex-shrink-0">
                        <div className="flex items-center gap-1 font-mono text-xs">
                          <span className="px-2.5 py-1 rounded-xl bg-[#F5F1FF] text-[#8B75F9] font-black">
                            O {p.vote_o_count || 0}
                          </span>
                          <span className="px-2.5 py-1 rounded-xl bg-[#FFF3F4] text-[#FF5D7B] font-black">
                            X {p.vote_x_count || 0}
                          </span>
                        </div>

                        <button
                          onClick={() => handleDeletePost(p.id)}
                          className="p-2 text-slate-400 hover:text-[#FF5D7B] hover:bg-[#FFF3F4] rounded-xl transition-colors cursor-pointer"
                          title="게시글 및 전체 댓글 삭제"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 space-y-2.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-800 flex items-center gap-1.5">
                          <MessageSquare size={14} className="text-[#FF5D7B]" />
                          등록된 댓글 ({p.comments?.length || 0})
                        </span>
                      </div>

                      {!p.comments || p.comments.length === 0 ? (
                        <p className="text-xs text-slate-400 py-1 pl-2">
                          작성된 댓글이 없습니다.
                        </p>
                      ) : (
                        <div className="space-y-2 bg-slate-50/80 p-3.5 rounded-2xl border border-slate-100">
                          {p.comments.map((c: any) => {
                            const cu = c.user_info;
                            const cGender = formatGender(cu?.gender);
                            const cBirth = cu?.birth_year ? `${cu.birth_year}년생` : null;
                            const likes = c.likes || [];

                            return (
                              <div
                                key={c.id}
                                className="flex items-start justify-between gap-3 p-3 rounded-2xl bg-white border border-slate-200/60 shadow-2xs hover:border-slate-300 transition-colors"
                              >
                                <div className="flex items-start gap-2.5 min-w-0 flex-1">
                                  <CornerDownRight
                                    size={14}
                                    className="text-slate-400 mt-1 flex-shrink-0"
                                  />
                                  <span
                                    className={`px-2.5 py-1 rounded-xl text-xs font-black flex-shrink-0 mt-0.5 ${
                                      c.voted_choice === "O"
                                        ? "bg-[#F5F1FF] text-[#8B75F9]"
                                        : c.voted_choice === "X"
                                        ? "bg-[#FFF3F4] text-[#FF5D7B]"
                                        : "bg-slate-100 text-slate-500"
                                    }`}
                                  >
                                    {c.voted_choice || "미투표"}
                                  </span>

                                  <div className="min-w-0 flex-1 space-y-1.5">
                                    <div className="flex items-center gap-2 flex-wrap text-xs">
                                      <span className="font-mono text-slate-700 font-bold bg-slate-100 px-2 py-0.5 rounded-lg text-[11px]">
                                        <span className="text-slate-400 font-sans font-medium text-[10px] mr-1">댓글 ID:</span>
                                        {c.id}
                                      </span>

                                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-800 text-xs font-medium">
                                        <User size={11} className="text-slate-400" />
                                        <span className="font-bold text-slate-900">
                                          {cu?.email || "이메일 없음"}
                                        </span>
                                        {cu?.provider && (
                                          <span className="px-1.5 py-0.2 rounded bg-white text-[9px] text-slate-600 font-bold uppercase border border-slate-200">
                                            {cu.provider}
                                          </span>
                                        )}
                                        {cGender && (
                                          <span className="text-slate-600 font-semibold">
                                            {cGender}
                                          </span>
                                        )}
                                        {cBirth && (
                                          <span className="text-slate-600">
                                            {cBirth}
                                          </span>
                                        )}
                                        <span className="text-slate-400 font-mono text-[10px] pl-1 border-l border-slate-300">
                                          유저 ID: {c.user_id || "없음"}
                                        </span>
                                      </div>

                                      <span className="text-slate-400 font-mono text-[11px]">
                                        {c.created_at
                                          ? format(
                                              new Date(c.created_at),
                                              "yyyy-MM-dd HH:mm:ss"
                                            )
                                          : "-"}
                                      </span>
                                    </div>

                                    <p className="text-xs text-slate-800 font-medium break-all leading-relaxed pl-0.5">
                                      {c.content}
                                    </p>

                                    <div className="pt-1 flex items-start gap-2 flex-wrap">
                                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-[#FFF3F4] text-[#FF5D7B] text-xs font-bold">
                                        <Heart size={12} className="fill-[#FF5D7B]" />
                                        좋아요 {c.like_count || 0}개
                                      </span>

                                      {likes.length > 0 && (
                                        <div className="flex items-center gap-1.5 flex-wrap text-xs text-slate-600">
                                          <span className="text-slate-400 text-[11px]">누른 유저:</span>
                                          {likes.map((l: any, idx: number) => {
                                            const lu = l.user_info;
                                            const lGender = formatGender(lu?.gender);
                                            const lBirth = lu?.birth_year ? `${lu.birth_year}년` : null;
                                            const lTraits = [lGender, lBirth].filter(Boolean).join("/");

                                            return (
                                              <span
                                                key={l.user_id + idx}
                                                className="px-2 py-0.5 rounded-lg bg-white text-slate-700 font-medium border border-slate-200 text-xs shadow-2xs"
                                                title={`유저 ID: ${l.user_id} (${l.created_at})`}
                                              >
                                                {lu?.email || l.user_id}
                                                {lu?.provider ? ` · ${lu.provider}` : ""}
                                                {lTraits ? ` (${lTraits})` : ""}
                                              </span>
                                            );
                                          })}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                <button
                                  onClick={() => handleDeleteComment(p.id, c.id)}
                                  className="p-1.5 text-slate-400 hover:text-[#FF5D7B] hover:bg-[#FFF3F4] rounded-lg transition-colors cursor-pointer flex-shrink-0"
                                  title="댓글 삭제"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
