import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { supabase } from "@/lib/supabase";

export const ALLOWED_ADMIN_IDS = [
  "f141410b-991c-48f9-80c4-5fc23bdb6921",
  "b771f571-208a-4dbe-a4d2-4fa9b97b8a75",
];

export const ALLOWED_ADMIN_EMAILS = ["bur5698@gmail.com", "rsj01223@gmail.com"];

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

      if (ALLOWED_ADMIN_EMAILS.includes(userEmail)) {
        return true;
      }

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
