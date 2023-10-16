import { Collection } from 'mongodb';
import { randomUUID } from 'crypto';
import { CreateExpenseParams, Expense } from './expenses.interfaces';
import mongoProvider from '../../modules/mongo';

class ExpensesRepository {
  private collectionName = 'expenses';
  private collection: Collection<Expense>;

  constructor() {
    this.collection = mongoProvider.db.collection<Expense>(this.collectionName);
  }

  async createExpense(expense: CreateExpenseParams) {
    const createdAt = new Date();
    const result = await this.collection.insertOne({
      ...expense,
      createdAt,
      updatedAt: createdAt,
      _id: randomUUID(),
    });
    return result;
  }

  async getExpenses(userId: string) {
    return await this.collection.find({ userId }).toArray();
  }

  async getTotal(userId: string) {
    const total = await this.collection
      .aggregate<{
        currency: string;
        total: number;
      }>([
        {
          $match: {
            userId,
          },
        },
        {
          $group: {
            _id: '$currency',
            total: {
              $sum: '$amount',
            },
          },
        },
        {
          $project: {
            _id: 0,
            total: 1,
            currency: '$_id',
          },
        },
      ])
      .toArray();
    return total;
  }

  async getExpenseById(id: string) {
    return await this.collection.findOne({ _id: id });
  }

  async updateExpense(id: string, expense: Partial<Expense>) {
    return await this.collection.findOneAndUpdate(
      { _id: id },
      { $set: expense },
    );
  }

  async deleteExpense(id: string) {
    return await this.collection.findOneAndDelete({
      _id: id,
    });
  }
}

const expensesRepository = new ExpensesRepository();

export default expensesRepository;
