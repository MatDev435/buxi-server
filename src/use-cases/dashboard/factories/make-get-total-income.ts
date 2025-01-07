import { PrismaTransactionsRepository } from '../../../repositories/prisma/prisma.transactions-repository'
import { GetTotalIncomeUseCase } from '../get-total-income'

export function makeGetTotalIncome() {
  const transactionsRepository = new PrismaTransactionsRepository()
  const useCase = new GetTotalIncomeUseCase(transactionsRepository)

  return useCase
}
