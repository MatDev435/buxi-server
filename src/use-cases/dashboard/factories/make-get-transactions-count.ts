import { PrismaTransactionsRepository } from '../../../repositories/prisma/prisma.transactions-repository'
import { GetTransactionsCountUseCase } from '../get-transactions-count'

export function makeGetTransactionsCount() {
  const transactionsRepository = new PrismaTransactionsRepository()
  const useCase = new GetTransactionsCountUseCase(transactionsRepository)

  return useCase
}
