import { PrismaTransactionsRepository } from '../../../repositories/prisma/prisma.transactions-repository'
import { GetMonthActivityUseCase } from '../get-month-activity'

export function makeGetMonthActivity() {
  const transactionsRepository = new PrismaTransactionsRepository()
  const useCase = new GetMonthActivityUseCase(transactionsRepository)

  return useCase
}
