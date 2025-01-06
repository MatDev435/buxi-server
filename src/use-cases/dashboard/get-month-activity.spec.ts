import { Decimal } from '@prisma/client/runtime/library'
import { makeTransaction } from '../../../test/factories/make-transaction'
import { InMemoryTransactionsRepository } from '../../../test/repositories/in-memory-transactions-repository'
import { GetTotalIncomeUseCase } from './get-total-income'
import { GetTransactionsCountUseCase } from './get-transactions-count'
import { GetTotalExpenseUseCase } from './get-total-expense'
import { GetMonthActivityUseCase } from './get-month-activity'

let inMemoryTransactionsRepository: InMemoryTransactionsRepository
let sut: GetMonthActivityUseCase

describe('Get Month Activity Use Case', () => {
  beforeEach(() => {
    inMemoryTransactionsRepository = new InMemoryTransactionsRepository()
    sut = new GetMonthActivityUseCase(inMemoryTransactionsRepository)

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to get month activity', async () => {
    vi.setSystemTime(new Date(2024, 11, 1, 0, 0, 0))

    inMemoryTransactionsRepository.items.push(
      makeTransaction({
        ownerId: 'user-01',
      })
    )

    vi.setSystemTime(new Date(2025, 0, 1, 0, 0, 0))

    inMemoryTransactionsRepository.items.push(
      makeTransaction({
        ownerId: 'user-01',
        value: new Decimal(2000),
        type: 'income',
      })
    )

    vi.setSystemTime(new Date(2025, 0, 2, 0, 0, 0))

    inMemoryTransactionsRepository.items.push(
      makeTransaction({
        ownerId: 'user-01',
        value: new Decimal(500),
        type: 'expense',
      })
    )

    vi.setSystemTime(new Date(2025, 0, 3, 0, 0, 0))

    inMemoryTransactionsRepository.items.push(
      makeTransaction({
        ownerId: 'user-01',
        value: new Decimal(100),
        type: 'income',
      })
    )

    const { data } = await sut.execute({
      userId: 'user-01',
    })

    expect(data).toEqual(
      expect.arrayContaining([
        { day: 1, value: 2000 },
        { day: 2, value: 1500 },
        { day: 3, value: 1600 },
      ])
    )
  })
})
