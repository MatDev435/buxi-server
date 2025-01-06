import { Prisma, Transaction } from '@prisma/client'

export interface TransactionsRepository {
  findById(id: string): Promise<Transaction | null>
  create(
    transaction: Prisma.TransactionUncheckedCreateInput
  ): Promise<Transaction>
}
