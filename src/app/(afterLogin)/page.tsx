'use client';

import { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { supabase } from '@/lib/supabase';
import {
  LayoutDashboard,
  FileText,
  MessageSquare,
  AlertTriangle,
  HelpCircle,
  Sparkles,
  Trash2,
  RefreshCw,
  Search,
  Users,
  CheckCircle,
  XCircle,
  LogOut,
  User as UserIcon,
} from 'lucide-react';
import { format } from 'date-fns';

type TabType = 'overview' | 'posts' | 'comments' | 'reports' | 'inquiries' | 'ai-tester';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  const [stats, setStats] = useState({
    userCount: 0,
    postCount: 0,
    voteCount: 0,
    commentCount: 0,
    reportCount: 0,
    inquiryCount: 0,
  });
  const [loading, setLoading] = useState(false);

  // Data lists
  const [posts, setPosts] = useState<any[]>([]);
  const [comments, setComments] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [inquiries, setInquiries] = useState<any[]>([]);

  // Search filter
  const [searchTerm, setSearchTerm] = useState('');

  // AI Quality Tester state
  const [testTitle, setTestTitle] = useState('');
  const [testContent, setTestContent] = useState('');
  const [aiResult, setAiResult] = useState<any>(null);
  const [aiLoading, setAiLoading] = useState(false);

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
        supabase.from('users').select('*', { count: 'exact', head: true }),
        supabase.from('posts').select('*', { count: 'exact', head: true }),
        supabase.from('votes').select('*', { count: 'exact', head: true }),
        supabase.from('comments').select('*', { count: 'exact', head: true }),
        supabase.from('user_reports').select('*', { count: 'exact', head: true }),
        supabase.from('inquiries_feedback').select('*', { count: 'exact', head: true }),
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
      console.error('Error fetching stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('post_details_view')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
      if (data) setPosts(data);
      if (error) console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('comments')
        .select('*, posts(title)')
        .order('created_at', { ascending: false })
        .limit(50);
      if (data) setComments(data);
      if (error) console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReports = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_reports')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
      if (data) setReports(data);
      if (error) console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('inquiries_feedback')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
      if (data) setInquiries(data);
      if (error) console.error('Error fetching inquiries:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverviewStats();
  }, []);

  useEffect(() => {
    if (activeTab === 'posts') fetchPosts();
    if (activeTab === 'comments') fetchComments();
    if (activeTab === 'reports') fetchReports();
    if (activeTab === 'inquiries') fetchInquiries();
  }, [activeTab]);

  const handleDeletePost = async (id: string) => {
    if (!confirm('정말 이 게시글을 삭제하시겠습니까? 관련 투표와 댓글도 함께 삭제됩니다.')) return;
    try {
      const res = await fetch('/api/admin/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'post', id }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setPosts(prev => prev.filter(p => p.id !== id));
        alert('게시글이 삭제되었습니다.');
      } else {
        alert('삭제 실패: ' + (data.error || '오류가 발생했습니다.'));
      }
    } catch (e: any) {
      alert('오류: ' + e.message);
    }
  };

  const handleDeleteComment = async (id: string) => {
    if (!confirm('정말 이 댓글을 삭제하시겠습니까?')) return;
    try {
      const res = await fetch('/api/admin/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'comment', id }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setComments(prev => prev.filter(c => c.id !== id));
        alert('댓글이 삭제되었습니다.');
      } else {
        alert('삭제 실패: ' + (data.error || '오류가 발생했습니다.'));
      }
    } catch (e: any) {
      alert('오류: ' + e.message);
    }
  };

  const runAiInspect = async () => {
    if (!testTitle.trim() && !testContent.trim()) {
      alert('제목이나 내용을 입력해주세요.');
      return;
    }
    setAiLoading(true);
    setAiResult(null);
    try {
      const { data, error } = await supabase.functions.invoke('inspect-post-quality', {
        body: { title: testTitle, content: testContent },
      });
      if (error) throw error;
      setAiResult(data);
    } catch (err: any) {
      setAiResult({ is_approved: false, reason_code: 'ERROR', message: err.message || '호출 실패' });
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 font-sans">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-800 bg-slate-900/60 p-5 flex flex-col justify-between backdrop-blur-xl">
        <div>
          <div className="flex items-center gap-3 px-2 py-3 mb-6">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-500 to-violet-600 flex items-center justify-center font-black text-white shadow-lg shadow-rose-500/20">
              L
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                LOVE ADMIN
              </h1>
              <p className="text-xs text-slate-500">Service Management</p>
            </div>
          </div>

          <nav className="space-y-1.5">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-rose-500 text-white shadow-md shadow-rose-500/25'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <LayoutDashboard size={18} />
              대시보드 통계
            </button>

            <button
              onClick={() => setActiveTab('posts')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                activeTab === 'posts'
                  ? 'bg-rose-500 text-white shadow-md shadow-rose-500/25'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <FileText size={18} />
              게시글 관리
            </button>

            <button
              onClick={() => setActiveTab('comments')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                activeTab === 'comments'
                  ? 'bg-rose-500 text-white shadow-md shadow-rose-500/25'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <MessageSquare size={18} />
              댓글 관리
            </button>

            <button
              onClick={() => setActiveTab('reports')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                activeTab === 'reports'
                  ? 'bg-rose-500 text-white shadow-md shadow-rose-500/25'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <AlertTriangle size={18} />
              신고 내역
            </button>

            <button
              onClick={() => setActiveTab('inquiries')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                activeTab === 'inquiries'
                  ? 'bg-rose-500 text-white shadow-md shadow-rose-500/25'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <HelpCircle size={18} />
              1:1 문의 / 피드백
            </button>

            <button
              onClick={() => setActiveTab('ai-tester')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                activeTab === 'ai-tester'
                  ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-indigo-500/25'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Sparkles size={18} />
              AI 검수 시뮬레이터
            </button>
          </nav>
        </div>

        <div className="pt-4 border-t border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              NextAuth Session Active
            </span>
          </div>

          <div className="flex items-center justify-between bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
            <div className="flex items-center gap-2.5 min-w-0 pr-2">
              {session?.user?.image ? (
                <img
                  src={session.user.image}
                  alt="avatar"
                  className="w-7 h-7 rounded-lg object-cover flex-shrink-0"
                />
              ) : (
                <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 flex-shrink-0">
                  <UserIcon size={14} />
                </div>
              )}
              <div className="min-w-0">
                <p className="text-xs font-semibold text-slate-200 truncate">
                  {session?.user?.name || session?.user?.email?.split('@')[0] || 'Admin'}
                </p>
                <p className="text-[10px] text-slate-400 truncate">{session?.user?.email || 'admin'}</p>
              </div>
            </div>

            <button
              onClick={() => signOut({ callbackUrl: '/login' })}
              title="로그아웃"
              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors flex-shrink-0 cursor-pointer"
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden bg-slate-950">
        {/* Top Header */}
        <header className="h-16 border-b border-slate-800/80 px-8 flex items-center justify-between bg-slate-900/30 backdrop-blur-md">
          <h2 className="text-lg font-semibold text-white capitalize">
            {activeTab === 'overview' && '서비스 운영 대시보드'}
            {activeTab === 'posts' && '전체 게시글 모니터링'}
            {activeTab === 'comments' && '전체 댓글 모니터링'}
            {activeTab === 'reports' && '사용자 신고 접수 내역'}
            {activeTab === 'inquiries' && '1:1 고객 문의 및 피드백'}
            {activeTab === 'ai-tester' && 'Gemini AI 콘텐츠 품질 검수 시뮬레이터'}
          </h2>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (activeTab === 'overview') fetchOverviewStats();
                if (activeTab === 'posts') fetchPosts();
                if (activeTab === 'comments') fetchComments();
                if (activeTab === 'reports') fetchReports();
                if (activeTab === 'inquiries') fetchInquiries();
              }}
              disabled={loading}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 transition-colors cursor-pointer"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
              새로고침
            </button>

            <button
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 text-xs font-medium transition-colors cursor-pointer"
            >
              <LogOut size={13} />
              로그아웃
            </button>
          </div>
        </header>

        {/* Dynamic Tab Body */}
        <div className="flex-1 overflow-y-auto p-8">
          {/* TAB 1: Overview */}
          {activeTab === 'overview' && (
            <div className="space-y-8 max-w-6xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-800/50 to-slate-900/50 border border-slate-800 shadow-xl">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-sm font-medium">전체 회원수</span>
                    <Users size={20} className="text-rose-400" />
                  </div>
                  <div className="text-3xl font-extrabold text-white">{stats.userCount}명</div>
                </div>

                <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-800/50 to-slate-900/50 border border-slate-800 shadow-xl">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-sm font-medium">등록된 고민글</span>
                    <FileText size={20} className="text-violet-400" />
                  </div>
                  <div className="text-3xl font-extrabold text-white">{stats.postCount}개</div>
                </div>

                <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-800/50 to-slate-900/50 border border-slate-800 shadow-xl">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-sm font-medium">누적 투표수</span>
                    <CheckCircle size={20} className="text-emerald-400" />
                  </div>
                  <div className="text-3xl font-extrabold text-white">{stats.voteCount}회</div>
                </div>

                <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-800/50 to-slate-900/50 border border-slate-800 shadow-xl">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-sm font-medium">등록된 댓글</span>
                    <MessageSquare size={20} className="text-sky-400" />
                  </div>
                  <div className="text-3xl font-extrabold text-white">{stats.commentCount}개</div>
                </div>

                <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-800/50 to-slate-900/50 border border-slate-800 shadow-xl">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-sm font-medium">신고 접수</span>
                    <AlertTriangle size={20} className="text-amber-400" />
                  </div>
                  <div className="text-3xl font-extrabold text-white">{stats.reportCount}건</div>
                </div>

                <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-800/50 to-slate-900/50 border border-slate-800 shadow-xl">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-sm font-medium">1:1 문의 / 피드백</span>
                    <HelpCircle size={20} className="text-indigo-400" />
                  </div>
                  <div className="text-3xl font-extrabold text-white">{stats.inquiryCount}건</div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Posts Management */}
          {activeTab === 'posts' && (
            <div className="space-y-4 max-w-6xl mx-auto">
              <div className="flex items-center justify-between gap-4 mb-4">
                <div className="relative flex-1 max-w-md">
                  <Search size={16} className="absolute left-3.5 top-3 text-slate-500" />
                  <input
                    type="text"
                    placeholder="제목 또는 내용 검색..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/40 overflow-hidden">
                <table className="w-full text-left text-sm text-slate-300">
                  <thead className="bg-slate-900/80 border-b border-slate-800 text-xs text-slate-400 uppercase">
                    <tr>
                      <th className="py-3 px-4">카테고리</th>
                      <th className="py-3 px-4">제목</th>
                      <th className="py-3 px-4">투표 (O/X)</th>
                      <th className="py-3 px-4">댓글</th>
                      <th className="py-3 px-4">작성일</th>
                      <th className="py-3 px-4 text-right">관리</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {posts
                      .filter(p => !searchTerm || p.title?.includes(searchTerm) || p.content?.includes(searchTerm))
                      .map(p => (
                        <tr key={p.id} className="hover:bg-slate-800/30 transition-colors">
                          <td className="py-3.5 px-4 font-medium text-rose-400">{p.category || '일반'}</td>
                          <td className="py-3.5 px-4 max-w-md">
                            <div className="font-semibold text-white truncate">{p.title}</div>
                            <div className="text-xs text-slate-400 truncate">{p.content}</div>
                          </td>
                          <td className="py-3.5 px-4 text-xs font-mono">
                            <span className="text-violet-400">O {p.vote_o_count || 0}</span> /{' '}
                            <span className="text-rose-400">X {p.vote_x_count || 0}</span>
                          </td>
                          <td className="py-3.5 px-4 text-xs">{p.comment_count || 0}개</td>
                          <td className="py-3.5 px-4 text-xs text-slate-500 font-mono">
                            {p.created_at ? format(new Date(p.created_at), 'yyyy-MM-dd HH:mm') : '-'}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={() => handleDeletePost(p.id)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: Comments Management */}
          {activeTab === 'comments' && (
            <div className="space-y-4 max-w-6xl mx-auto">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/40 overflow-hidden">
                <table className="w-full text-left text-sm text-slate-300">
                  <thead className="bg-slate-900/80 border-b border-slate-800 text-xs text-slate-400 uppercase">
                    <tr>
                      <th className="py-3 px-4">선택</th>
                      <th className="py-3 px-4">댓글 본문</th>
                      <th className="py-3 px-4">원문 게시글</th>
                      <th className="py-3 px-4">작성일</th>
                      <th className="py-3 px-4 text-right">관리</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {comments.map(c => (
                      <tr key={c.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${
                              c.voted_choice === 'O'
                                ? 'bg-violet-500/20 text-violet-300'
                                : c.voted_choice === 'X'
                                ? 'bg-rose-500/20 text-rose-300'
                                : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            {c.voted_choice || '-'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-100 max-w-md">{c.content}</td>
                        <td className="py-3.5 px-4 text-xs text-slate-400 max-w-xs truncate">
                          {c.posts?.title || c.post_id}
                        </td>
                        <td className="py-3.5 px-4 text-xs text-slate-500 font-mono">
                          {c.created_at ? format(new Date(c.created_at), 'yyyy-MM-dd HH:mm') : '-'}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => handleDeleteComment(c.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: Reports */}
          {activeTab === 'reports' && (
            <div className="space-y-4 max-w-6xl mx-auto">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/40 overflow-hidden">
                <table className="w-full text-left text-sm text-slate-300">
                  <thead className="bg-slate-900/80 border-b border-slate-800 text-xs text-slate-400 uppercase">
                    <tr>
                      <th className="py-3 px-4">신고 대상 ID</th>
                      <th className="py-3 px-4">신고 사유</th>
                      <th className="py-3 px-4">상세 내용</th>
                      <th className="py-3 px-4">접수일</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {reports.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="text-center py-8 text-slate-500">
                           접수된 신고 내역이 없습니다.
                        </td>
                      </tr>
                    ) : (
                      reports.map(r => (
                        <tr key={r.id}>
                          <td className="py-3.5 px-4 font-mono text-xs text-slate-400">{r.reported_user_id}</td>
                          <td className="py-3.5 px-4 text-amber-400 font-medium">{r.reason}</td>
                          <td className="py-3.5 px-4">{r.details || '-'}</td>
                          <td className="py-3.5 px-4 text-xs text-slate-500 font-mono">
                            {r.created_at ? format(new Date(r.created_at), 'yyyy-MM-dd HH:mm') : '-'}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: Inquiries */}
          {activeTab === 'inquiries' && (
            <div className="space-y-4 max-w-6xl mx-auto">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/40 overflow-hidden">
                <table className="w-full text-left text-sm text-slate-300">
                  <thead className="bg-slate-900/80 border-b border-slate-800 text-xs text-slate-400 uppercase">
                    <tr>
                      <th className="py-3 px-4">구분</th>
                      <th className="py-3 px-4">내용</th>
                      <th className="py-3 px-4">작성자</th>
                      <th className="py-3 px-4">접수일</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {inquiries.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="text-center py-8 text-slate-500">
                          접수된 문의 및 피드백이 없습니다.
                        </td>
                      </tr>
                    ) : (
                      inquiries.map(iq => (
                        <tr key={iq.id}>
                          <td className="py-3.5 px-4 font-medium text-indigo-400">{iq.type || '문의'}</td>
                          <td className="py-3.5 px-4 text-slate-100">{iq.content}</td>
                          <td className="py-3.5 px-4 text-xs font-mono text-slate-400">{iq.user_id}</td>
                          <td className="py-3.5 px-4 text-xs text-slate-500 font-mono">
                            {iq.created_at ? format(new Date(iq.created_at), 'yyyy-MM-dd HH:mm') : '-'}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 6: AI Content Quality Inspector */}
          {activeTab === 'ai-tester' && (
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="p-6 rounded-2xl bg-gradient-to-b from-indigo-950/40 to-slate-900/40 border border-indigo-900/50 shadow-2xl">
                <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
                  <Sparkles className="text-indigo-400" size={18} />
                  Gemini 2.5 Flash Lite 콘텐츠 자동 검수 시뮬레이터
                </h3>
                <p className="text-xs text-slate-400 mb-6">
                  Supabase Edge Function (`inspect-post-quality`)을 직접 호출하여 도배/스팸/비방 정책 위반 여부를 실시간으로 테스트합니다.
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">게시글 제목</label>
                    <input
                      type="text"
                      placeholder="테스트할 제목 입력..."
                      value={testTitle}
                      onChange={e => setTestTitle(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">게시글 본문</label>
                    <textarea
                      rows={5}
                      placeholder="테스트할 본문 내용 입력 (예: ㅋㅋㅋㅋㅋㅋ 도배, 오픈채팅방 링크 홍보, 욕설 비방 등)..."
                      value={testContent}
                      onChange={e => setTestContent(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <button
                    onClick={runAiInspect}
                    disabled={aiLoading}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold text-sm shadow-lg shadow-indigo-500/25 hover:opacity-95 transition-opacity flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Sparkles size={16} className={aiLoading ? 'animate-spin' : ''} />
                    {aiLoading ? 'AI 검수 분석 중...' : 'AI 검수 실행'}
                  </button>
                </div>
              </div>

              {/* AI Result Card */}
              {aiResult && (
                <div
                  className={`p-6 rounded-2xl border ${
                    aiResult.is_approved
                      ? 'bg-emerald-950/20 border-emerald-800/60'
                      : 'bg-rose-950/20 border-rose-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    {aiResult.is_approved ? (
                      <CheckCircle className="text-emerald-400" size={24} />
                    ) : (
                      <XCircle className="text-rose-400" size={24} />
                    )}
                    <h4 className="font-bold text-base text-white">
                      {aiResult.is_approved ? '검수 통과 (정상 게시글)' : '검수 반려 (제재 사유 감지)'}
                    </h4>
                  </div>

                  <div className="text-xs space-y-1.5 text-slate-300">
                    <p>
                      <strong className="text-slate-400">사유 코드:</strong> {aiResult.reason_code}
                    </p>
                    {aiResult.message && (
                      <p>
                        <strong className="text-slate-400">사용자 안내 문구:</strong>{' '}
                        <span className="text-rose-300 font-medium">{aiResult.message}</span>
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
