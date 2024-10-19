export type dateDropdownElement = {
  dateValue: string;
  dateView: string;
};

export type ReceiptDetail = {
  storeName: string;
  amount: number;
  date: Date;
  category: number;
};

export type ExpenseDetail = {
  expenseDate: Date | undefined;
  setExpenseDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
  storeName: string;
  setStoreName: React.Dispatch<React.SetStateAction<string>>;
  amount: number;
  setAmount: React.Dispatch<React.SetStateAction<number>>;
  categoryId: number;
  setCategoryId: React.Dispatch<React.SetStateAction<number>>;
  selectedImage: string | null;
  setSelectedImage: React.Dispatch<React.SetStateAction<string | null>>;
  fileName: string | null;
  setFileName: React.Dispatch<React.SetStateAction<string | null>>;
};
