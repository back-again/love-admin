"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { format } from "date-fns";
import Header from "../../_component/Header";

export default function ReportsArea() {
  const [loading, setLoading] = useState(false);
  const [reports, setReports] = useState<any[]>([]);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("user_reports")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);
      if (data) setReports(data);
      if (error) console.error("Error fetching reports:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  return (
    <>
      <Header
        title="사용자 신고 접수 내역"
        onRefresh={fetchReports}
        loading={loading}
      />

      <div className="flex-1 overflow-y-auto p-8 bg-[#F8FAFC]">
        <div className="space-y-4 max-w-6xl mx-auto">
          <div className="rounded-3xl border border-slate-200/80 bg-white overflow-hidden shadow-sm">
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="bg-slate-50/80 border-b border-slate-200/80 text-xs text-slate-500 font-bold uppercase">
                <tr>
                  <th className="py-3.5 px-5">피신고자 ID</th>
                  <th className="py-3.5 px-5">신고 사유</th>
                  <th className="py-3.5 px-5">상세 내용</th>
                  <th className="py-3.5 px-5">접수 일시</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {reports.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-16 text-slate-400">
                      접수된 신고 내역이 없습니다.
                    </td>
                  </tr>
                ) : (
                  reports.map((r) => (
                    <tr
                      key={r.id}
                      className="hover:bg-slate-50/60 transition-colors"
                    >
                      <td className="py-4 px-5 font-mono text-xs text-slate-500 whitespace-nowrap">
                        {r.reported_user_id}
                      </td>
                      <td className="py-4 px-5 whitespace-nowrap">
                        <span className="inline-block px-2.5 py-1 rounded-xl bg-amber-50 text-amber-600 font-bold text-xs">
                          {r.reason}
                        </span>
                      </td>
                      <td className="py-4 px-5 text-slate-800">
                        {r.details || "-"}
                      </td>
                      <td className="py-4 px-5 text-xs text-slate-400 font-mono whitespace-nowrap">
                        {r.created_at
                          ? format(new Date(r.created_at), "yyyy-MM-dd HH:mm")
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
