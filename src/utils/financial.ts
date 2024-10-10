import { Budget, Expense } from "@/types";

// 日本円の表記にフォーマット (useCurrencyがture：1000 -> ¥1,000, useCurrencyがfalse：1000 -> 1,000)
export const formatCurrency = (
  amount: number,
  useCurrency: boolean = false
): string => {
  return new Intl.NumberFormat("ja-JP", {
    style: useCurrency ? "currency" : "decimal",
    currency: useCurrency ? "JPY" : undefined,
  }).format(amount);
};

// 予算や出費の合計を計算
export const calculateTotalAmount = (items: Budget[] | Expense[]): number => {
  return items.reduce((sum, current) => sum + current.amount, 0);
};

// categoryIdでグルーピングしてamountを合計する
export const categoryTotals = (
  items: Budget[] | Expense[]
): { [categoryId: number]: number } => {
  return items.reduce((acc, current) => {
    const categoryId = current.categoryId;

    // カテゴリIDがまだ存在しない場合は初期化
    if (!acc[categoryId]) {
      acc[categoryId] = 0;
    }

    // カテゴリIDごとにamountを加算
    acc[categoryId] += current.amount;

    return acc;
  }, {} as { [categoryId: number]: number });
};
