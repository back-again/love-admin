"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Plus, Trash2, Edit2, Check, X, Tag, ArrowUpDown } from "lucide-react";
import Header from "../../_component/Header";

export default function CategoriesArea() {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);

  const [newName, setNewName] = useState("");
  const [newOrder, setNewOrder] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editOrder, setEditOrder] = useState<number>(1);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/categories");
      const data = await res.json();
      if (res.ok && data.success) {
        setCategories(data.categories || []);
        if (data.categories?.length > 0) {
          const maxOrder = Math.max(
            ...data.categories.map((c: any) => c.order_index || 0)
          );
          setNewOrder(maxOrder + 1);
        }
      } else {
        console.error("Fetch categories error:", data.error);
      }
    } catch (err) {
      console.error("Fetch categories exception:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) {
      alert("카테고리 이름을 입력해주세요.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName.trim(), order_index: newOrder }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setNewName("");
        fetchCategories();
        alert("새 카테고리가 추가되었습니다.");
      } else {
        alert("추가 실패: " + (data.error || "오류가 발생했습니다."));
      }
    } catch (err: any) {
      alert("오류: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const startEdit = (cat: any) => {
    setEditingId(cat.id);
    setEditName(cat.name);
    setEditOrder(cat.order_index || 0);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName("");
  };

  const handleUpdateCategory = async (id: string) => {
    if (!editName.trim()) {
      alert("카테고리 이름을 입력해주세요.");
      return;
    }

    try {
      const res = await fetch("/api/admin/categories", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          name: editName.trim(),
          order_index: editOrder,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setEditingId(null);
        fetchCategories();
        alert("카테고리가 수정되었습니다.");
      } else {
        alert("수정 실패: " + (data.error || "오류가 발생했습니다."));
      }
    } catch (err: any) {
      alert("오류: " + err.message);
    }
  };

  const handleDeleteCategory = async (id: string, name: string) => {
    if (
      !confirm(
        `정말 '${name}' 카테고리를 삭제하시겠습니까?\n해당 카테고리를 참조하는 게시글이 있을 경우 문제가 발생할 수 있습니다.`
      )
    )
      return;

    try {
      const res = await fetch(`/api/admin/categories?id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setCategories((prev) => prev.filter((c) => c.id !== id));
        alert("카테고리가 삭제되었습니다.");
      } else {
        alert("삭제 실패: " + (data.error || "오류가 발생했습니다."));
      }
    } catch (err: any) {
      alert("오류: " + err.message);
    }
  };

  return (
    <>
      <Header
        title="게시글 카테고리 관리"
        onRefresh={fetchCategories}
        loading={loading}
      />

      <div className="flex-1 overflow-y-auto p-8 bg-[#F8FAFC]">
        <div className="space-y-6 max-w-4xl mx-auto">
          <div className="rounded-[32px] bg-white border border-slate-200/80 p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Plus size={16} className="text-[#FF5D7B]" />
              신규 카테고리 등록
            </h3>

            <form
              onSubmit={handleCreateCategory}
              className="flex items-center gap-3 flex-wrap sm:flex-nowrap"
            >
              <div className="flex-1 min-w-[200px]">
                <input
                  type="text"
                  placeholder="카테고리명 (예: 직장/동료, 소개팅)..."
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-900 focus:outline-none focus:border-[#FF5D7B]"
                />
              </div>

              <div className="w-28">
                <input
                  type="number"
                  placeholder="순서"
                  value={newOrder}
                  onChange={(e) => setNewOrder(Number(e.target.value))}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-900 focus:outline-none focus:border-[#FF5D7B]"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2.5 bg-[#FF5D7B] hover:bg-[#ff4b6d] text-white font-bold text-sm rounded-2xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 flex-shrink-0"
              >
                <Plus size={16} />
                <span>추가하기</span>
              </button>
            </form>
          </div>

          <div className="rounded-[32px] border border-slate-200/80 bg-white overflow-hidden shadow-sm">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Tag size={15} className="text-[#FF5D7B]" />
                전체 카테고리 목록 ({categories.length}개)
              </span>
              <span className="text-[11px] text-slate-400">
                순서 숫자가 작을수록 앱 상단에 먼저 노출됩니다.
              </span>
            </div>

            <table className="w-full text-left text-sm text-slate-700">
              <thead className="bg-slate-50/80 border-b border-slate-200/80 text-xs text-slate-500 font-bold uppercase">
                <tr>
                  <th className="py-3.5 px-5 w-20">순서</th>
                  <th className="py-3.5 px-5">카테고리명</th>
                  <th className="py-3.5 px-5">카테고리 ID</th>
                  <th className="py-3.5 px-5">생성일시</th>
                  <th className="py-3.5 px-5 text-right w-28">관리</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {categories.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-16 text-slate-400">
                      등록된 카테고리가 없습니다.
                    </td>
                  </tr>
                ) : (
                  categories.map((c) => {
                    const isEditing = editingId === c.id;

                    return (
                      <tr
                        key={c.id}
                        className="hover:bg-slate-50/60 transition-colors"
                      >
                        <td className="py-4 px-5 font-mono text-xs font-bold text-slate-600">
                          {isEditing ? (
                            <input
                              type="number"
                              value={editOrder}
                              onChange={(e) =>
                                setEditOrder(Number(e.target.value))
                              }
                              className="w-16 px-2 py-1 bg-white border border-slate-300 rounded-lg text-xs"
                            />
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-100 text-slate-800">
                              <ArrowUpDown size={11} className="text-slate-400" />
                              {c.order_index}
                            </span>
                          )}
                        </td>

                        <td className="py-4 px-5">
                          {isEditing ? (
                            <input
                              type="text"
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              className="w-full max-w-xs px-3 py-1 bg-white border border-slate-300 rounded-xl text-xs font-bold"
                            />
                          ) : (
                            <span className="px-3 py-1 rounded-full bg-[#FFF3F4] text-[#FF5D7B] font-bold text-xs">
                              {c.name}
                            </span>
                          )}
                        </td>

                        <td className="py-4 px-5 font-mono text-xs text-slate-500">
                          {c.id}
                        </td>

                        <td className="py-4 px-5 text-xs text-slate-400 font-mono">
                          {c.created_at
                            ? format(
                                new Date(c.created_at),
                                "yyyy-MM-dd HH:mm:ss"
                              )
                            : "-"}
                        </td>

                        <td className="py-4 px-5 text-right whitespace-nowrap">
                          {isEditing ? (
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => handleUpdateCategory(c.id)}
                                className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                                title="저장"
                              >
                                <Check size={16} />
                              </button>
                              <button
                                onClick={cancelEdit}
                                className="p-1.5 text-slate-400 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                                title="취소"
                              >
                                <X size={16} />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => startEdit(c)}
                                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                                title="수정"
                              >
                                <Edit2 size={15} />
                              </button>
                              <button
                                onClick={() =>
                                  handleDeleteCategory(c.id, c.name)
                                }
                                className="p-1.5 text-slate-400 hover:text-[#FF5D7B] hover:bg-[#FFF3F4] rounded-lg transition-colors cursor-pointer"
                                title="삭제"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
