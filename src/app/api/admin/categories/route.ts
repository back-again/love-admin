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
      .from("categories")
      .select("*")
      .order("order_index", { ascending: true });

    if (error) throw error;

    return NextResponse.json({ success: true, categories: data || [] });
  } catch (err: any) {
    console.error("Admin categories GET error:", err);
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

    const { name, order_index } = await req.json();

    if (!name || typeof name !== "string") {
      return NextResponse.json(
        { success: false, error: "카테고리 이름을 입력해주세요." },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("categories")
      .insert([
        {
          name: name.trim(),
          order_index: Number(order_index) || 0,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, category: data });
  } catch (err: any) {
    console.error("Admin categories POST error:", err);
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

    const { id, name, order_index } = await req.json();

    if (!id || !name) {
      return NextResponse.json(
        { success: false, error: "필수 정보가 누락되었습니다." },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("categories")
      .update({
        name: name.trim(),
        order_index: Number(order_index) || 0,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, category: data });
  } catch (err: any) {
    console.error("Admin categories PUT error:", err);
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
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "카테고리 ID가 필요합니다." },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin
      .from("categories")
      .delete()
      .eq("id", id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Admin categories DELETE error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "서버 오류" },
      { status: 500 }
    );
  }
}
