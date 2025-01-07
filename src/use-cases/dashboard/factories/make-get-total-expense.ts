import { PrismaTransactionsRepository } from '../../../repositories/prisma/prisma.transactions-repository'
import { GetTotalExpenseUseCase } from '../get-total-expense'

export function makeGetTotalExpense() {
  const transactionsRepository = new PrismaTransactionsRepository()
  const useCase = new GetTotalExpenseUseCase(transactionsRepository)

  return useCase
}
