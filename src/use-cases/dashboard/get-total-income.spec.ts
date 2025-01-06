import { Decimal } from '@prisma/client/runtime/library'
import { makeTransaction } from '../../../test/factories/make-transaction'
import { InMemoryTransactionsRepository } from '../../../test/repositories/in-memory-transactions-repository'
import { GetTotalIncomeUseCase } from './get-total-income'
import { GetTransactionsCountUseCase } from './get-transactions-count'

let inMemoryTransactionsRepository: InMemoryTransactionsRepository
let sut: GetTotalIncomeUseCase

describe('Get Total Income Use Case', () => {
  beforeEach(() => {
    inMemoryTransactionsRepository = new InMemoryTransactionsRepository()
    sut = new GetTotalIncomeUseCase(inMemoryTransactionsRepository)

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to get total income', async () => {
    vi.setSystemTime(new Date(2024, 11, 1, 0, 0, 0))

    inMemoryTransactionsRepository.items.push(
      makeTransaction({
        ownerId: 'user-01',
        value: new Decimal(1500),
        type: 'income',
      })
    )

    vi.setSystemTime(new Date(2025, 0, 1, 0, 0, 0))

    inMemoryTransactionsRepository.items.push(
      makeTransaction({
        ownerId: 'user-01',
        value: new Decimal(1499.99),
        type: 'income',
      })
    )

    inMemoryTransactionsRepository.items.push(
      makeTransaction({
        ownerId: 'user-01',
        value: new Decimal(1500.01),
        type: 'income',
      })
    )

    const { data } = await sut.execute({
      userId: 'user-01',
    })

    expect(data).toEqual({
      currentMonth: 3000,
      diffFromLastMonth: 100,
    })
  })
})
