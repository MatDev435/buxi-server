import { Prisma, Transaction } from '@prisma/client'

export interface FetchByUserIdParams {
  date?: Date
  name?: string
  category?: string
}

export interface TransactionsRepository {
  findById(id: string): Promise<Transaction | null>
  fetchByUserId(
    userId: string,
    params: FetchByUserIdParams
  ): Promise<Transaction[]>
  create(
    transaction: Prisma.TransactionUncheckedCreateInput
  ): Promise<Transaction>
  delete(id: string): Promise<void>
}
