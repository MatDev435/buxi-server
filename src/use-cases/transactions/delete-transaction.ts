import { TransactionsRepository } from '../../repositories/transactions-repository'
import { ResourceNotFoundError } from '../_errors/resource-not-found-error'

interface DeleteTransactionRequest {
  transactionId: string
}

interface DeleteTransactionResponse {
  success: true
}

export class DeleteTransactionUseCase {
  constructor(private transactionsRepository: TransactionsRepository) {}

  async execute({
    transactionId,
  }: DeleteTransactionRequest): Promise<DeleteTransactionResponse> {
    const transaction =
      await this.transactionsRepository.findById(transactionId)

    if (!transaction) {
      throw new ResourceNotFoundError()
    }

    await this.transactionsRepository.delete(transaction.id)

    return { success: true }
  }
}
