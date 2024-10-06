type StartAndEndOfMonth = {
  firstDay: Date;
  lastDay: Date;
};

// 本日の日付を取得(UTC)
export const getToday = (): Date => {
  return new Date();
};

// 月の初日と最終日を返す
export const getStartAndEndOfMonth = (date: Date): StartAndEndOfMonth => {
  // UTCで表示される
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

  return { firstDay, lastDay };
};

// 2024-10-14T15:00:00.000Z を指定した形に変換する(*何も指定しないと 2024/10/15 がかえる)
export const formatDate = (
  date: Date,
  formatOptions: { year?: boolean; month?: boolean; day?: boolean } = {}
): string => {
  const { year, month, day } = formatOptions;
  return date.toLocaleDateString("ja-JP", {
    year: year ? "numeric" : undefined,
    month: month ? "long" : undefined,
    day: day ? "numeric" : undefined,
  });
};

export const formatStrDate = (dateStr: string): Date | undefined => {
  // 正規表現で年、月、日を抽出
  const dateParts = dateStr.match(/(\d{4})年(\d{1,2})月(\d{1,2})/);

  // 年、月、日を抽出してDateオブジェクトに変換
  if (dateParts) {
    const year = parseInt(dateParts[1], 10);
    const month = parseInt(dateParts[2], 10) - 1; // 月は0が1月になるので、-1する
    const day = parseInt(dateParts[3], 10);
    return new Date(year, month, day);
  }
};
