"use server";

import prisma from "@/lib/prisma";
import { cache } from "react";

export const getUser = cache(async (email: string) => {
  return await prisma.user.findUnique({
    where: { email },
  });
});

export const createUser = async (data: {
  name: string;
  email: string;
  image: string;
}) => {
  const res = await prisma.user.create({
    data,
  });

  return res;
};
