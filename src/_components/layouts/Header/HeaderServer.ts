"use server";

import { signIn, signOut } from "@/auth";

export const authControl = async (action: string) => {
  if (action == "signIn") {
    await signIn("google");
  } else {
    await signOut();
  }
};
