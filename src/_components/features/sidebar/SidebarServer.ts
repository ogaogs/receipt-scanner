import {
  dateDropdownElement,
  ReceiptDetail,
} from "@/_components/features/sidebar/type";
import { formatDate } from "@/utils/time";
import { createExpense } from "@/lib/db";
import { uploadFileToS3, generatePutPreSignedURL } from "@/lib/s3";

// 最初の月から今日までの年月をリストにする
export const getDatesInRange = (
  firstExpenseDate: Date,
  today: Date
): Date[] => {
  const monthsInRange: Date[] = [];

  if (firstExpenseDate) {
    // minDateの年月を取得
    let currentDate = new Date(
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
  fileName: string
): Promise<ReceiptDetail> => {
  const putPreSignedURL = await generatePutPreSignedURL(fileName);
  uploadFileToS3(selectedImage, putPreSignedURL);
  // NOTE: 一旦以下を返す。
  return {
    storeName: "八百屋",
    amount: 10000,
    date: new Date(2024, 10, 9),
    category: 1,
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
