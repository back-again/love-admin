"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  Users,
  FileText,
  CheckCircle,
  MessageSquare,
  AlertTriangle,
  HelpCircle,
} from "lucide-react";
import Header from "../_component/Header";

export default function OverviewArea() {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    userCount: 0,
    postCount: 0,
    voteCount: 0,
    commentCount: 0,
    reportCount: 0,
    inquiryCount: 0,
  });

  const fetchOverviewStats = async () => {
    setLoading(true);
    try {
      const [
        { count: uCount },
        { count: pCount },
        { count: vCount },
        { count: cCount },
        { count: rCount },
        { count: iCount },
      ] = await Promise.all([
        supabase.from("users").select("*", { count: "exact", head: true }),
        supabase.from("posts").select("*", { count: "exact", head: true }),
        supabase.from("votes").select("*", { count: "exact", head: true }),
        supabase.from("comments").select("*", { count: "exact", head: true }),
        supabase
          .from("user_reports")
          .select("*", { count: "exact", head: true }),
        supabase
          .from("inquiries_feedback")
          .select("*", { count: "exact", head: true }),
      ]);

      setStats({
        userCount: uCount || 0,
        postCount: pCount || 0,
        voteCount: vCount || 0,
        commentCount: cCount || 0,
        reportCount: rCount || 0,
        inquiryCount: iCount || 0,
      });
    } catch (err) {
      console.error("Error fetching stats:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverviewStats();
  }, []);

  return (
    <>
      <Header
        title="서비스 운영 대시보드"
        onRefresh={fetchOverviewStats}
        loading={loading}
      />

      <div className="flex-1 overflow-y-auto p-8 bg-[#F8FAFC]">
        <div className="space-y-8 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between text-slate-500 mb-3">
                <span className="text-sm font-semibold">전체 회원수</span>
                <div className="w-10 h-10 rounded-2xl bg-[#FFF3F4] flex items-center justify-center text-[#FF5D7B]">
                  <Users size={20} />
                </div>
              </div>
              <div className="text-3xl font-extrabold text-slate-900">
                {stats.userCount}
                <span className="text-base font-semibold text-slate-500 ml-1">명</span>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between text-slate-500 mb-3">
                <span className="text-sm font-semibold">등록된 고민글</span>
                <div className="w-10 h-10 rounded-2xl bg-[#F5F1FF] flex items-center justify-center text-[#8B75F9]">
                  <FileText size={20} />
                </div>
              </div>
              <div className="text-3xl font-extrabold text-slate-900">
                {stats.postCount}
                <span className="text-base font-semibold text-slate-500 ml-1">개</span>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between text-slate-500 mb-3">
                <span className="text-sm font-semibold">누적 투표수</span>
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-500">
                  <CheckCircle size={20} />
                </div>
              </div>
              <div className="text-3xl font-extrabold text-slate-900">
                {stats.voteCount}
                <span className="text-base font-semibold text-slate-500 ml-1">회</span>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between text-slate-500 mb-3">
                <span className="text-sm font-semibold">등록된 댓글</span>
                <div className="w-10 h-10 rounded-2xl bg-sky-50 flex items-center justify-center text-sky-500">
                  <MessageSquare size={20} />
                </div>
              </div>
              <div className="text-3xl font-extrabold text-slate-900">
                {stats.commentCount}
                <span className="text-base font-semibold text-slate-500 ml-1">개</span>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between text-slate-500 mb-3">
                <span className="text-sm font-semibold">신고 접수</span>
                <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-500">
                  <AlertTriangle size={20} />
                </div>
              </div>
              <div className="text-3xl font-extrabold text-slate-900">
                {stats.reportCount}
                <span className="text-base font-semibold text-slate-500 ml-1">건</span>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between text-slate-500 mb-3">
                <span className="text-sm font-semibold">1:1 문의 / 피드백</span>
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-500">
                  <HelpCircle size={20} />
                </div>
              </div>
              <div className="text-3xl font-extrabold text-slate-900">
                {stats.inquiryCount}
                <span className="text-base font-semibold text-slate-500 ml-1">건</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
