"use server";

import prisma from "@/lib/prisma";
import { cache } from "react";
import { Category } from "@/types";

// カテゴリを取得
export const getCategories = cache(async (): Promise<Category[]> => {
  return await prisma.category.findMany({
    orderBy: {
      id: "asc",
    },
  });
});
