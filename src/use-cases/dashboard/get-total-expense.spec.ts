import { Decimal } from '@prisma/client/runtime/library'
import { makeTransaction } from '../../../test/factories/make-transaction'
import { InMemoryTransactionsRepository } from '../../../test/repositories/in-memory-transactions-repository'
import { GetTotalIncomeUseCase } from './get-total-income'
import { GetTransactionsCountUseCase } from './get-transactions-count'
import { GetTotalExpenseUseCase } from './get-total-expense'

let inMemoryTransactionsRepository: InMemoryTransactionsRepository
let sut: GetTotalExpenseUseCase

describe('Get Total Expense Use Case', () => {
  beforeEach(() => {
    inMemoryTransactionsRepository = new InMemoryTransactionsRepository()
    sut = new GetTotalExpenseUseCase(inMemoryTransactionsRepository)

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to get total expense', async () => {
    vi.setSystemTime(new Date(2024, 11, 1, 0, 0, 0))

    inMemoryTransactionsRepository.items.push(
      makeTransaction({
        ownerId: 'user-01',
        value: new Decimal(1500),
        type: 'expense',
      })
    )

    vi.setSystemTime(new Date(2025, 0, 1, 0, 0, 0))

    inMemoryTransactionsRepository.items.push(
      makeTransaction({
        ownerId: 'user-01',
        value: new Decimal(499.99),
        type: 'expense',
      })
    )

    inMemoryTransactionsRepository.items.push(
      makeTransaction({
        ownerId: 'user-01',
        value: new Decimal(500.01),
        type: 'expense',
      })
    )

    const { data } = await sut.execute({
      userId: 'user-01',
    })

    expect(data).toEqual({
      currentMonth: 1000,
      diffFromLastMonth: -33.33333333333333,
    })
  })
})
