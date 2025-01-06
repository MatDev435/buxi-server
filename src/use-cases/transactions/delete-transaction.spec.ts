import { makeTransaction } from '../../../test/factories/make-transaction'
import { InMemoryTransactionsRepository } from '../../../test/repositories/in-memory-transactions-repository'
import { ResourceNotFoundError } from '../_errors/resource-not-found-error'
import { DeleteTransactionUseCase } from './delete-transaction'

let inMemoryTransactionsRepository: InMemoryTransactionsRepository
let sut: DeleteTransactionUseCase

describe('Delete Transaction Use Case', () => {
  beforeEach(() => {
    inMemoryTransactionsRepository = new InMemoryTransactionsRepository()
    sut = new DeleteTransactionUseCase(inMemoryTransactionsRepository)
  })

  it('should be able to delete a transaction', async () => {
    inMemoryTransactionsRepository.items.push(
      makeTransaction({
        id: 'transaction-01',
      })
    )

    const { success } = await sut.execute({
      transactionId: 'transaction-01',
    })

    expect(success).toBe(true)
  })

  it('should be not able to delete an inexistent transaction', async () => {
    await expect(() =>
      sut.execute({
        transactionId: 'inexistent-transaction-id',
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
