"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { format } from "date-fns";
import Header from "../../_component/Header";

export default function InquiriesArea() {
  const [loading, setLoading] = useState(false);
  const [inquiries, setInquiries] = useState<any[]>([]);

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("inquiries_feedback")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);
      if (data) setInquiries(data);
      if (error) console.error("Error fetching inquiries:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  return (
    <>
      <Header
        title="1:1 고객 문의 및 피드백"
        onRefresh={fetchInquiries}
        loading={loading}
      />

      <div className="flex-1 overflow-y-auto p-8 bg-[#F8FAFC]">
        <div className="space-y-4 max-w-6xl mx-auto">
          <div className="rounded-3xl border border-slate-200/80 bg-white overflow-hidden shadow-sm">
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="bg-slate-50/80 border-b border-slate-200/80 text-xs text-slate-500 font-bold uppercase">
                <tr>
                  <th className="py-3.5 px-5">유형</th>
                  <th className="py-3.5 px-5">문의 및 피드백 내용</th>
                  <th className="py-3.5 px-5">작성자 ID</th>
                  <th className="py-3.5 px-5">작성 일시</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {inquiries.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-16 text-slate-400">
                      접수된 문의 및 피드백이 없습니다.
                    </td>
                  </tr>
                ) : (
                  inquiries.map((iq) => (
                    <tr
                      key={iq.id}
                      className="hover:bg-slate-50/60 transition-colors"
                    >
                      <td className="py-4 px-5 whitespace-nowrap">
                        <span className="inline-block px-2.5 py-1 rounded-xl bg-indigo-50 text-indigo-600 font-bold text-xs">
                          {iq.type || "문의"}
                        </span>
                      </td>
                      <td className="py-4 px-5 text-slate-900 font-medium">
                        {iq.content}
                      </td>
                      <td className="py-4 px-5 text-xs font-mono text-slate-400 whitespace-nowrap">
                        {iq.user_id}
                      </td>
                      <td className="py-4 px-5 text-xs text-slate-400 font-mono whitespace-nowrap">
                        {iq.created_at
                          ? format(new Date(iq.created_at), "yyyy-MM-dd HH:mm")
                          : "-"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
