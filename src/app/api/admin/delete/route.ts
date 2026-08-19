import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions, ALLOWED_ADMIN_EMAILS } from '@/lib/authOptions';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    // 관리자 세션 확인
    if (!session?.user?.email || !ALLOWED_ADMIN_EMAILS.includes(session.user.email.toLowerCase())) {
      return NextResponse.json(
        { success: false, error: '관리자 권한이 없습니다.' },
        { status: 403 }
      );
    }

    const { type, id } = await req.json();

    if (!type || !id) {
      return NextResponse.json(
        { success: false, error: '잘못된 요청 파라미터입니다.' },
        { status: 400 }
      );
    }

    let error = null;

    if (type === 'post') {
      const result = await supabaseAdmin.from('posts').delete().eq('id', id);
      error = result.error;
    } else if (type === 'comment') {
      const result = await supabaseAdmin.from('comments').delete().eq('id', id);
      error = result.error;
    } else {
      return NextResponse.json(
        { success: false, error: '지원하지 않는 삭제 대상입니다.' },
        { status: 400 }
      );
    }

    if (error) {
      console.error('Admin delete error:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Admin delete API exception:', err);
    return NextResponse.json(
      { success: false, error: err.message || '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
