import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions, ALLOWED_ADMIN_EMAILS } from "@/lib/authOptions";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (
      !session?.user?.email ||
      !ALLOWED_ADMIN_EMAILS.includes(session.user.email.toLowerCase())
    ) {
      return NextResponse.json(
        { success: false, error: "관리자 권한이 없습니다." },
        { status: 403 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("ai_prompts")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) throw error;

    return NextResponse.json({ success: true, prompts: data || [] });
  } catch (err: any) {
    console.error("Admin ai-prompts GET error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "서버 오류" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (
      !session?.user?.email ||
      !ALLOWED_ADMIN_EMAILS.includes(session.user.email.toLowerCase())
    ) {
      return NextResponse.json(
        { success: false, error: "관리자 권한이 없습니다." },
        { status: 403 }
      );
    }

    const { type, prompt } = await req.json();

    if (!type || typeof prompt !== "string") {
      return NextResponse.json(
        { success: false, error: "유효하지 않은 요청 데이터입니다." },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("ai_prompts")
      .upsert(
        {
          type,
          prompt,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "type" }
      )
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, prompt: data });
  } catch (err: any) {
    console.error("Admin ai-prompts PUT error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "서버 오류" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (
      !session?.user?.email ||
      !ALLOWED_ADMIN_EMAILS.includes(session.user.email.toLowerCase())
    ) {
      return NextResponse.json(
        { success: false, error: "관리자 권한이 없습니다." },
        { status: 403 }
      );
    }

    const { type, prompt } = await req.json();

    if (!type || !prompt) {
      return NextResponse.json(
        { success: false, error: "프롬프트 타입과 내용을 입력해주세요." },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("ai_prompts")
      .insert([
        {
          type: type.trim(),
          prompt,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, prompt: data });
  } catch (err: any) {
    console.error("Admin ai-prompts POST error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "서버 오류" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (
      !session?.user?.email ||
      !ALLOWED_ADMIN_EMAILS.includes(session.user.email.toLowerCase())
    ) {
      return NextResponse.json(
        { success: false, error: "관리자 권한이 없습니다." },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");

    if (!type) {
      return NextResponse.json(
        { success: false, error: "삭제할 프롬프트 타입이 필요합니다." },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin
      .from("ai_prompts")
      .delete()
      .eq("type", type);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Admin ai-prompts DELETE error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "서버 오류" },
      { status: 500 }
    );
  }
}
