import {
  dateDropdownElement,
  ReceiptDetail,
} from "@/_components/features/sidebar/type";
import { formatDate, formatStrDate } from "@/utils/time";
import { createExpense, isFileNameExists } from "@/lib/db";
import { uploadFileToS3, generatePreSignedURL } from "@/lib/s3";
import { getReceiptDetailFromModel } from "@/utils/analyzeReceipt";
import { Category } from "@/types";

// 最初の月から今日までの年月をリストにする
export const getDatesInRange = (
  firstExpenseDate: Date,
  today: Date
): Date[] => {
  const monthsInRange: Date[] = [];

  if (firstExpenseDate) {
    // minDateの年月を取得
    const currentDate = new Date(
      firstExpenseDate.getFullYear(),
      firstExpenseDate.getMonth(),
      1
    );

    while (currentDate <= today) {
      // 年と月を取得し、Data型でその年月の15日を保存
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      monthsInRange.push(new Date(year, month, 15)); // UTCでわかりづらいため、15日にし、年月は分かりやすいようにした

      // 次の月に移動
      currentDate.setMonth(currentDate.getMonth() + 1);
    }
  }
  return monthsInRange;
};

export const makeDateElements = (
  datesInRange: Date[]
): dateDropdownElement[] => {
  return datesInRange.map((date): dateDropdownElement => {
    return {
      dateValue: formatDate(date, { year: true, month: "2-digit" }).replace(
        "/",
        "-"
      ),
      dateView: formatDate(date, { year: true, month: "long" }),
    };
  });
};

export const getReceiptDetail = async (
  selectedImage: string,
  fileName: string,
  categories: Category[]
): Promise<ReceiptDetail> => {
  const putPreSignedURL = await generatePreSignedURL(fileName, "put");
  await uploadFileToS3(selectedImage, putPreSignedURL);
  const getPreSignedURL = await generatePreSignedURL(fileName, "get");

  const receiptDetail = await getReceiptDetailFromModel(getPreSignedURL);
  if (receiptDetail.error) {
    throw new Error(receiptDetail.error.message);
  }

  console.log(receiptDetail);

  const responseStoreName = receiptDetail.receipt_detail?.store_name || "";
  const responseAmount = receiptDetail.receipt_detail?.amount || 0;
  const responseDate = receiptDetail.receipt_detail?.date || "";
  const responseCategory = receiptDetail.receipt_detail?.category || "";

  const date = formatStrDate(responseDate) || new Date(); // うまく取得できなかったら本日の日付を返す
  const categoryId =
    categories.find((category) => category.name === responseCategory)?.id || 1; // うまく取得できなかったら"食費"を返す

  return {
    storeName: responseStoreName,
    amount: responseAmount,
    date: date,
    category: categoryId,
  };
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

export const checkFileNameExists = async (fileName: string) => {
  return await isFileNameExists(fileName);
};
