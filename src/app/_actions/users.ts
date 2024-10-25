"use server";
import { getUser, createUser } from "@/lib/db";

export async function fetchUserWithEmailAction(email: string) {
  const res = await getUser(email);

  return res;
}

export async function createUserAction(data: {
  name: string;
  email: string;
  image: string;
}) {
  const res = await createUser(data);

  return res;
}
