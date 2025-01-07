import { PrismaTransactionsRepository } from '../../../repositories/prisma/prisma.transactions-repository'
import { GetTotalProfitUseCase } from '../get-total-profit'

export function makeGetTotalProfit() {
  const transactionsRepository = new PrismaTransactionsRepository()
  const useCase = new GetTotalProfitUseCase(transactionsRepository)

  return useCase
}
