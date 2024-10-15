import { Budget } from "@/types/budget";
import { Expense, FirstExpenseDate } from "@/types/expense";
import { Category } from "@/types/category";

type MonthExpensesWithCategory = Expense & {
  category: Category;
};

type MonthBudgetsWithCategory = Budget & {
  category: Category;
}

export type {
  Budget,
  Expense,
  FirstExpenseDate,
  Category,
  MonthExpensesWithCategory,
  MonthBudgetsWithCategory,
};
