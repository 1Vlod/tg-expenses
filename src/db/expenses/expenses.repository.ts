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

  async getExpenses({
    userId,
    from,
    to,
    page,
  }: {
    userId: number;
    from: string;
    to: string;
    page: number;
  }) {
    const result = await this.collection
      .aggregate<{
        expenses: Expense[];
        totalCount: { count: number }[];
      }>([
        {
          $match: {
            userId,
            createdAt: {
              $gte: new Date(from),
              $lte: new Date(to),
            },
          },
        },
        {
          $facet: {
            expenses: [
              { $match: {} },
              {
                $project: {
                  _id: 1,
                  createdAt: 1,
                  amount: 1,
                  currency: 1,
                  description: 1,
                },
              },
              {
                $sort: {
                  createdAt: -1,
                },
              },
              { $skip: page * 10 },
              { $limit: 10 },
            ],
            totalCount: [{ $count: 'count' }],
          },
        },
      ])
      .toArray();

    return {
      expenses: result[0].expenses,
      totalCount: result[0].totalCount[0]?.count,
    };
  }

  async getTotal({
    userId,
    from,
    to,
  }: {
    userId: number;
    from: string;
    to: string;
  }) {
    const total = await this.collection
      .aggregate<{
        currency: string;
        total: number;
      }>([
        {
          $match: {
            userId,
            createdAt: {
              $gte: new Date(from),
              $lte: new Date(to),
            },
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

  async getExpenseByMessageId({
    messageId,
    userId,
  }: {
    messageId: number;
    userId: number;
  }) {
    return await this.collection.findOne({ messageId, userId });
  }

  async updateExpense(id: string, expense: Partial<Expense>) {
    return await this.collection.findOneAndUpdate(
      { _id: id },
      { $set: expense },
    );
  }

  async updateExpenseByMessageId(
    { messageId, userId }: { messageId: number; userId: number },
    expense: Partial<Expense>,
  ) {
    return await this.collection.findOneAndUpdate(
      { messageId, userId },
      { $set: expense },
    );
  }

  async deleteExpense(id: string) {
    return await this.collection.findOneAndDelete({
      _id: id,
    });
  }
}

export default new ExpensesRepository();
