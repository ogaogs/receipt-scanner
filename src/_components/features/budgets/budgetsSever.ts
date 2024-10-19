import {
  createBudget,
  getMonthBudgetsWithCategory,
  updateBudget,
} from "@/lib/db/budget";
import { CategoryBudgets } from "@/_components/features/budgets/type";
import { Category } from "@/types";

export const getAndFormatCategoryBudgets = async (
  userId: string,
  firstDay: Date,
  lastDay: Date,
  categories: Category[]
): Promise<{
  formattedCategoryBudgets: CategoryBudgets[];
  totalAmount: number;
}> => {
  const monthBudgetsWithCategory = await getMonthBudgetsWithCategory(
    userId,
    firstDay,
    lastDay
  );

  // 出費を特定のフォーマットにする
  const formattedCategoryBudgets = categories.map((category) => {
    // 予算のカテゴリに一致する項目を検索
    const budget = monthBudgetsWithCategory.find(
      (budget) => budget.categoryId === category.id
    );

    // 該当する予算がない場合は budgetIdはnull amountに0 を設定
    return {
      budgetId: budget ? budget.id : null,
      categoryId: category.id,
      category: category.name,
      amount: budget ? budget.amount : 0,
    };
  });

  // 予算の合計を求める
  const totalAmount = formattedCategoryBudgets.reduce(
    (acc, category) => acc + category.amount,
    0
  );

  return { formattedCategoryBudgets, totalAmount };
};

// カテゴリーに紐づいた予算を更新する
export const updateCategoryBudgets = async (
  userId: string,
  categoryBudgets: CategoryBudgets[],
  targetYear: number,
  targetMonth: number
) => {
  const targetYearMonth = new Date(targetYear, targetMonth - 1, 15);
  // Promise.allでリクエストを並行処理
  const promises = categoryBudgets.map((budget) => {
    if (budget.budgetId) {
      return updateBudget(budget.budgetId, budget.amount);
    } else {
      return createBudget(
        userId,
        budget.amount,
        targetYearMonth,
        budget.categoryId
      );
    }
  });

  // すべてのリクエストが完了するのを待つ
  await Promise.all(promises);
};
