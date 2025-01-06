import { makeTransaction } from '../../../test/factories/make-transaction'
import { InMemoryTransactionsRepository } from '../../../test/repositories/in-memory-transactions-repository'
import { ListTransactionsUseCase } from './list-transactions'

let inMemoryTransactionsRepository: InMemoryTransactionsRepository
let sut: ListTransactionsUseCase

describe('List Transactions Use Case', () => {
  beforeEach(() => {
    inMemoryTransactionsRepository = new InMemoryTransactionsRepository()
    sut = new ListTransactionsUseCase(inMemoryTransactionsRepository)

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to list transactions', async () => {
    vi.setSystemTime(new Date(2025, 0, 5, 0, 0, 0))

    inMemoryTransactionsRepository.items.push(
      makeTransaction({
        ownerId: 'user-01',
      })
    )

    vi.setSystemTime(new Date(2025, 0, 6, 0, 0, 0))

    inMemoryTransactionsRepository.items.push(
      makeTransaction({
        ownerId: 'user-01',
        name: 'Filter by name',
      })
    )

    inMemoryTransactionsRepository.items.push(
      makeTransaction({
        ownerId: 'user-01',
        name: 'Filter by name',
        category: 'Filter by category',
      })
    )

    const { transactions } = await sut.execute({
      userId: 'user-01',
      params: {
        date: new Date(),
        name: 'Filter by name',
        category: 'Filter by category',
      },
    })

    expect(inMemoryTransactionsRepository.items).toHaveLength(3)
    expect(transactions).toHaveLength(1)
  })
})
