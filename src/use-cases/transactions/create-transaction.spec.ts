import { InMemoryTransactionsRepository } from '../../../test/repositories/in-memory-transactions-repository'
import { CreateTransactionUseCase } from './create-transaction'

let inMemoryTransactionsRepository: InMemoryTransactionsRepository
let sut: CreateTransactionUseCase

describe('Create Transaction Use Case', () => {
  beforeEach(() => {
    inMemoryTransactionsRepository = new InMemoryTransactionsRepository()
    sut = new CreateTransactionUseCase(inMemoryTransactionsRepository)
  })

  it('should be able to create a transaction', async () => {
    const { transaction } = await sut.execute({
      ownerId: 'user-01',
      name: 'Hamburger',
      description: 'Just a hamburger',
      category: 'food',
      value: 30,
      type: 'expense',
    })

    expect(transaction).toEqual(inMemoryTransactionsRepository.items[0])
  })
})
