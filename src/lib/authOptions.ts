import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { supabase } from "@/lib/supabase";

// 허용된 관리자 UUID 화이트리스트 (지정된 관리자 계정만 허용)
export const ALLOWED_ADMIN_IDS = [
  "f141410b-991c-48f9-80c4-5fc23bdb6921",
  "f91a2e4a-f2b6-4c09-a7d4-afae43684c45",
];

export const ALLOWED_ADMIN_EMAILS = [
  "bur5698@gmail.com",
  "f9g24ctwwr@privaterelay.appleid.com",
];

export const authOptions: NextAuthOptions = {
  providers: [
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
  ],
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user }) {
      if (!user?.email) return false;

      const userEmail = user.email.toLowerCase();

      // 1) 허용된 관리자 이메일 검사
      if (ALLOWED_ADMIN_EMAILS.includes(userEmail)) {
        return true;
      }

      // 2) Supabase users 테이블에서 사용자 ID 조회 및 화이트리스트 검사
      try {
        const { data } = await supabase
          .from("users")
          .select("id, email")
          .eq("email", userEmail)
          .maybeSingle();

        if (data?.id && ALLOWED_ADMIN_IDS.includes(data.id)) {
          return true;
        }
      } catch (err) {
        console.error("Admin authorization error:", err);
      }

      // 관리자 권한 없는 계정은 로그인 거부 (AccessDenied)
      return false;
    },
    async jwt({ token, user }) {
      if (user?.email) {
        try {
          const { data } = await supabase
            .from("users")
            .select("id")
            .eq("email", user.email)
            .maybeSingle();
          if (data?.id) {
            token.id = data.id;
          }
        } catch (e) {}
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        (session.user as any).id = token.id || token.sub;
      }
      return session;
    },
  },
  secret:
    process.env.NEXTAUTH_SECRET || "love-admin-super-secret-key-32chars-min",
};
