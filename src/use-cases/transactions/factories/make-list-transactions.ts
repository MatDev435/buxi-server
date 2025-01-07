import { PrismaTransactionsRepository } from '../../../repositories/prisma/prisma.transactions-repository'
import { ListTransactionsUseCase } from '../list-transactions'

export function makeListTransactions() {
  const transactionsRepository = new PrismaTransactionsRepository()
  const useCase = new ListTransactionsUseCase(transactionsRepository)

  return useCase
}
