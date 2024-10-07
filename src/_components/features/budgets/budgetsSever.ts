import { getMonthBudgetsWithCategory } from "@/lib/db/budget";
import { CategoryBudgets } from "@/_components/features/budgets/type";

export const getAndFormatCategoryBudgets = async (
  userId: string,
  firstDay: Date,
  lastDay: Date
): Promise<{ formattedCategoryBudgets: CategoryBudgets[]; totalAmount: number }> => {
  const monthBudgetsWithCategory = await getMonthBudgetsWithCategory(
    userId,
    firstDay,
    lastDay
  );

  // 出費を特定のフォーマットにする
  const formattedCategoryBudgets = monthBudgetsWithCategory.map((categoryBudget) => ({
    category: categoryBudget.category.name,
    amount: categoryBudget.amount,
  }));

  // 予算の合計を求める
  const totalAmount = formattedCategoryBudgets.reduce((acc, category) => acc + category.amount, 0);

  return { formattedCategoryBudgets, totalAmount };
};
