import { Prisma, Transaction } from '@prisma/client'

export interface FetchByUserIdParams {
  date?: Date
  name?: string
  category?: string
}

export interface DashboardCardsResponse {
  currentMonth: number
  diffFromLastMonth: number
}

export interface MonthActivityResponse {
  day: number
  value: number
}

export interface YearActivityResponse {
  month: string
  income: number
  expense: number
}

export interface TransactionsRepository {
  findById(id: string): Promise<Transaction | null>
  fetchByUserId(
    userId: string,
    params: FetchByUserIdParams
  ): Promise<Transaction[]>
  getTransactionsCount(userId: string): Promise<DashboardCardsResponse>
  getTotalIncome(userId: string): Promise<DashboardCardsResponse>
  getTotalExpense(userId: string): Promise<DashboardCardsResponse>
  getTotalProfit(userId: string): Promise<DashboardCardsResponse>
  getMonthActivity(userId: string): Promise<MonthActivityResponse[]>
  getYearActivity(userId: string): Promise<YearActivityResponse[]>
  create(
    transaction: Prisma.TransactionUncheckedCreateInput
  ): Promise<Transaction>
  delete(id: string): Promise<void>
}
