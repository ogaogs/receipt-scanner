import { Budget } from "@/types/budget";
import { Expense, FirstExpenseDate } from "@/types/expense";
import { Category } from "@/types/category";
import { Receipt } from "@/types/receipt";

type MonthExpensesWithCategoryReceipt = Expense & {
  category: Category;
  receipt: Receipt | null;
};

type MonthBudgetsWithCategory = Budget & {
  category: Category;
};

export type {
  Budget,
  Expense,
  FirstExpenseDate,
  Category,
  MonthExpensesWithCategoryReceipt,
  MonthBudgetsWithCategory,
};
