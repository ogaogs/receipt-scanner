// 日本円の表記にフォーマット (1000 -> ¥1,000)
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("ja-JP", {
    style: "currency",
    currency: "JPY",
  }).format(amount);
};
