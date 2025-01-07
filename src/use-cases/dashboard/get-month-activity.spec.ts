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
    vi.setSystemTime(new Date(2024, 11, 4, 0, 0, 0))

    inMemoryTransactionsRepository.items.push(
      makeTransaction({
        ownerId: 'user-01',
        value: new Decimal(3000),
        type: 'income',
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
        { day: '05/12', value: 3000 },
        { day: '01/01', value: 5000 },
        { day: '03/01', value: 4600 },
      ])
    )
  })
})
