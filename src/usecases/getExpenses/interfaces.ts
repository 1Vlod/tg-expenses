export interface GetExpensesParams {
  userId: number;
  from: string;
  to: string;
  timeRange: string;
  page?: number;
}
