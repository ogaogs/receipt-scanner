"use server";

import prisma from "@/lib/prisma";
import { cache } from "react";

export const isFileNameExists = cache(
  async (fileName: string): Promise<boolean> => {
    const receipt = await prisma.receipt.findUnique({
      where: {
        fileName: fileName,
      },
    });
    return !!receipt; // すでに存在する場合 true を返す
  }
);
