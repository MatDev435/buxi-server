import { PrismaTransactionsRepository } from '../../../repositories/prisma/prisma.transactions-repository'
import { GetYearActivityUseCase } from '../get-year-activity'

export function makeGetYearActivity() {
  const transactionsRepository = new PrismaTransactionsRepository()
  const useCase = new GetYearActivityUseCase(transactionsRepository)

  return useCase
}
