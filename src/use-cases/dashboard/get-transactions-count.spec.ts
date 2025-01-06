import { makeTransaction } from '../../../test/factories/make-transaction'
import { InMemoryTransactionsRepository } from '../../../test/repositories/in-memory-transactions-repository'
import { GetTransactionsCountUseCase } from './get-transactions-count'

let inMemoryTransactionsRepository: InMemoryTransactionsRepository
let sut: GetTransactionsCountUseCase

describe('Get Transactions Count Use Case', () => {
  beforeEach(() => {
    inMemoryTransactionsRepository = new InMemoryTransactionsRepository()
    sut = new GetTransactionsCountUseCase(inMemoryTransactionsRepository)

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to get transactions count', async () => {
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
      })
    )

    inMemoryTransactionsRepository.items.push(
      makeTransaction({
        ownerId: 'user-01',
      })
    )

    const { data } = await sut.execute({
      userId: 'user-01',
    })

    expect(data).toEqual({
      currentMonth: 2,
      diffFromLastMonth: 1,
    })
  })
})
