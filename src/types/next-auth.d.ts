import "next-auth";
import type { DefaultSession } from "next-auth";

type UserId = string;

declare module "next-auth/jwt" {
  interface JWT {
    id: UserId;
  }
}

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: UserId;
    };
  }
}
