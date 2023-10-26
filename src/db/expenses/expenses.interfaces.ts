export interface Expense {
  _id: string;
  userId: number;
  messageId: number;
  chatId: number;
  amount: number;
  currency: string;
  description: string;
  category?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateExpenseParams
  extends Omit<Expense, '_id' | 'createdAt' | 'updatedAt'> {}
