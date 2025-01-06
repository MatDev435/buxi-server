import { Decimal } from '@prisma/client/runtime/library'
import { makeTransaction } from '../../../test/factories/make-transaction'
import { InMemoryTransactionsRepository } from '../../../test/repositories/in-memory-transactions-repository'
import { GetYearActivityUseCase } from './get-year-activity'

let inMemoryTransactionsRepository: InMemoryTransactionsRepository
let sut: GetYearActivityUseCase

describe('Get Year Activity Use Case', () => {
  beforeEach(() => {
    inMemoryTransactionsRepository = new InMemoryTransactionsRepository()
    sut = new GetYearActivityUseCase(inMemoryTransactionsRepository)

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to get year activity', async () => {
    vi.setSystemTime(new Date(2025, 0, 1, 0, 0, 0))

    inMemoryTransactionsRepository.items.push(
      makeTransaction({
        ownerId: 'user-01',
        value: new Decimal(2500),
        type: 'income',
      })
    )

    inMemoryTransactionsRepository.items.push(
      makeTransaction({
        ownerId: 'user-01',
        value: new Decimal(2500),
        type: 'income',
      })
    )

    inMemoryTransactionsRepository.items.push(
      makeTransaction({
        ownerId: 'user-01',
        value: new Decimal(1000),
        type: 'expense',
      })
    )

    vi.setSystemTime(new Date(2025, 1, 1, 0, 0, 0))

    inMemoryTransactionsRepository.items.push(
      makeTransaction({
        ownerId: 'user-01',
        value: new Decimal(4500),
        type: 'income',
      })
    )

    inMemoryTransactionsRepository.items.push(
      makeTransaction({
        ownerId: 'user-01',
        value: new Decimal(3000),
        type: 'expense',
      })
    )

    inMemoryTransactionsRepository.items.push(
      makeTransaction({
        ownerId: 'user-01',
        value: new Decimal(500),
        type: 'expense',
      })
    )

    vi.setSystemTime(new Date(2025, 2, 2, 0, 0, 0))

    inMemoryTransactionsRepository.items.push(
      makeTransaction({
        ownerId: 'user-01',
        value: new Decimal(6500),
        type: 'income',
      })
    )

    inMemoryTransactionsRepository.items.push(
      makeTransaction({
        ownerId: 'user-01',
        value: new Decimal(2500),
        type: 'expense',
      })
    )

    const { data } = await sut.execute({
      userId: 'user-01',
    })

    expect(data).toEqual(
      expect.arrayContaining([
        { month: 'jan', income: 5000, expense: 1000 },
        { month: 'fev', income: 4500, expense: 3500 },
        { month: 'mar', income: 6500, expense: 2500 },
      ])
    )
  })
})
