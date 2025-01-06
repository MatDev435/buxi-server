import { Transaction } from '@prisma/client'
import { TransactionsRepository } from '../../repositories/transactions-repository'

interface CreateTransactionRequest {
  ownerId: string
  name: string
  description?: string
  category: string
  value: number
  type: 'income' | 'expense'
}

interface CreateTransactionResponse {
  transaction: Transaction
}

export class CreateTransactionUseCase {
  constructor(private transactionsRepository: TransactionsRepository) {}

  async execute({
    ownerId,
    name,
    description,
    category,
    value,
    type,
  }: CreateTransactionRequest): Promise<CreateTransactionResponse> {
    const transaction = await this.transactionsRepository.create({
      ownerId,
      name,
      description,
      category,
      value,
      type,
    })

    return { transaction }
  }
}
