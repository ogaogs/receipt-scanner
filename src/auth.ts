import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";
import { PrismaAdapter } from "@auth/prisma-adapter";
import {
  createUserAction,
  fetchUserWithEmailAction,
} from "@/app/_actions/users";
import prisma from "@/lib/prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const dbUser = await fetchUserWithEmailAction(user?.email || "");

        if (!dbUser) {
          const res = await createUserAction({
            name: user.name!,
            email: user.email!,
            image: user.image!,
          });
          token.id = res.id;
          return token;
        }

        token.id = dbUser.id;
        token.name = dbUser.name;
        token.email = dbUser.email;
        token.picture = dbUser.image;
      }

      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email!;
        session.user.image = token.picture;
      }
      return session;
    },

    redirect() {
      return "/";
    },
  },
});
