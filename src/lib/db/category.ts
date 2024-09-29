"use server";

import prisma from "@/lib/prisma";
import { Category } from "@/types";

// カテゴリを取得
export const getCategories = async (): Promise<Category[]> => {
  return await prisma.category.findMany()
};
