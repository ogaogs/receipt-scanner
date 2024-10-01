export type Expense = {
  id: string;
  storeName: string;
  amount: number;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  categoryId: number;
};

export type FirstExpenseDate = {
  _min: { date: Date | null };
};
