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

    const { data: postsData, error: postsError } = await supabaseAdmin
      .from("post_details_view")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);

    if (postsError) {
      console.error("Admin posts fetch error:", postsError);
      return NextResponse.json(
        { success: false, error: postsError.message },
        { status: 500 }
      );
    }

    if (!postsData || postsData.length === 0) {
      return NextResponse.json({ success: true, posts: [] });
    }

    const postIds = postsData.map((p) => p.id);

    const { data: commentsData } = await supabaseAdmin
      .from("comments")
      .select("*")
      .in("post_id", postIds)
      .order("created_at", { ascending: true });

    const commentIds = commentsData?.map((c) => c.id) || [];
    let likesData: any[] = [];
    if (commentIds.length > 0) {
      const { data: clData } = await supabaseAdmin
        .from("comment_likes")
        .select("comment_id, user_id, created_at")
        .in("comment_id", commentIds);
      likesData = clData || [];
    }

    const userIds = new Set<string>();
    postsData.forEach((p) => {
      if (p.user_id) userIds.add(p.user_id);
    });
    commentsData?.forEach((c) => {
      if (c.user_id) userIds.add(c.user_id);
    });
    likesData.forEach((l) => {
      if (l.user_id) userIds.add(l.user_id);
    });

    let usersMap: Record<string, any> = {};
    if (userIds.size > 0) {
      const { data: usersData } = await supabaseAdmin
        .from("users")
        .select("id, email, provider, gender, birth_year, notification_allowed")
        .in("id", Array.from(userIds));

      usersData?.forEach((u) => {
        usersMap[u.id] = u;
      });
    }

    const likesByComment: Record<string, any[]> = {};
    likesData.forEach((l) => {
      if (!likesByComment[l.comment_id]) {
        likesByComment[l.comment_id] = [];
      }
      likesByComment[l.comment_id].push({
        ...l,
        user_info: usersMap[l.user_id],
      });
    });

    const commentsByPost: Record<string, any[]> = {};
    commentsData?.forEach((c) => {
      if (!commentsByPost[c.post_id]) {
        commentsByPost[c.post_id] = [];
      }
      const cLikes = likesByComment[c.id] || [];
      commentsByPost[c.post_id].push({
        ...c,
        user_info: usersMap[c.user_id],
        like_count: cLikes.length,
        likes: cLikes,
      });
    });

    const mergedPosts = postsData.map((p) => ({
      ...p,
      user_info: usersMap[p.user_id],
      comments: commentsByPost[p.id] || [],
    }));

    return NextResponse.json({ success: true, posts: mergedPosts });
  } catch (err: any) {
    console.error("Admin posts API exception:", err);
    return NextResponse.json(
      { success: false, error: err.message || "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
