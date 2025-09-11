"use server";

import { AnalyzeResult } from "@/_components/features/sidebar/type";
import { formatStrDate } from "@/utils/time";
import { createExpense } from "@/lib/db";
import { uploadFileToS3, generatePreSignedURL } from "@/lib/s3";
import { getReceiptDetailFromModel } from "@/utils/analyzeReceipt";
import { Category } from "@/types";
import { ReceiptAnalysisError } from "@/constants/errors";

export const getReceiptDetail = async (
  selectedImage: string,
  fileName: string,
  categories: Category[]
): Promise<AnalyzeResult> => {
  try {
    const putPreSignedURL = await generatePreSignedURL(fileName, "put");
    await uploadFileToS3(selectedImage, putPreSignedURL);

    const receiptDetail = await getReceiptDetailFromModel(fileName);

    // 全ての項目がnullの場合のチェック
    const isAnalyzed = !(
      receiptDetail.store_name === null &&
      receiptDetail.amount === null &&
      receiptDetail.date === null &&
      receiptDetail.category === null
    );

    const responseStoreName = receiptDetail?.store_name || "";
    const responseAmount = receiptDetail?.amount || 0;
    const responseDate = receiptDetail?.date || "";
    const responseCategory = receiptDetail?.category || "";

    const date = formatStrDate(responseDate) || new Date(); // うまく取得できなかったら本日の日付を返す
    const categoryId =
      categories.find((category) => category.name === responseCategory)?.id ||
      1; // うまく取得できなかったら"食費"を返す

    return {
      success: true,
      data: {
        storeName: responseStoreName,
        amount: responseAmount,
        date: date,
        category: categoryId,
        isAnalyzed: isAnalyzed,
      },
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof ReceiptAnalysisError
          ? error.message
          : "レシート解析中にエラーが発生しました。サポートまでお問い合わせください。",
    };
  }
};

export const formatAndCreateExpense = async (
  userId: string,
  date: Date,
  storeName: string,
  amount: number,
  categoryId: number,
  fileName: string | null
) => {
  try {
    await createExpense(userId, amount, storeName, date, categoryId, fileName);
  } catch (error) {
    throw error;
  }
};
