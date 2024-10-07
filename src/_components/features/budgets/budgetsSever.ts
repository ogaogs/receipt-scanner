import { getMonthBudgetsWithCategory } from "@/lib/db/budget";
import { CategoryBudgets } from "@/_components/features/budgets/type";

export const getAndFormatCategoryBudgets = async (
  userId: string,
  firstDay: Date,
  lastDay: Date
): Promise<CategoryBudgets[]> => {
  const monthBudgetsWithCategory = await getMonthBudgetsWithCategory(
    userId,
    firstDay,
    lastDay
  );

  // 出費を特定のフォーマットにする
  const categoryBudgets = monthBudgetsWithCategory.map((categoryBudget) => ({
    category: categoryBudget.category.name,
    amount: categoryBudget.amount,
  }));
  return categoryBudgets;
};
