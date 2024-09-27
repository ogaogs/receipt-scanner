// 月の初日と最終日を返す
export const getStartAndEndOfMonth = (date: Date) => {
  // UTCで表示される
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

  return { firstDay, lastDay };
};
