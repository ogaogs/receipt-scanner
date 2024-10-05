import { Budget } from "@/types/budget";
import { Expense, FirstExpenseDate } from "@/types/expense";
import { Category } from "@/types/category";

type MonthExpensesWithCategory = Expense & {
  category: Category;
};

export type {
  Budget,
  Expense,
  FirstExpenseDate,
  Category,
  MonthExpensesWithCategory,
};
