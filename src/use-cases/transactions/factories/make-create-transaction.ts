import { PrismaTransactionsRepository } from '../../../repositories/prisma/prisma.transactions-repository'
import { CreateTransactionUseCase } from '../create-transaction'

export function makeCreateTransaction() {
  const transactionsRepository = new PrismaTransactionsRepository()
  const useCase = new CreateTransactionUseCase(transactionsRepository)

  return useCase
}
