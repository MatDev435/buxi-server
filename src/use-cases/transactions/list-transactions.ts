import { Transaction } from '@prisma/client'
import {
  FetchByUserIdParams,
  TransactionsRepository,
} from '../../repositories/transactions-repository'

interface ListTransactionsRequest {
  userId: string
  params: FetchByUserIdParams
}

interface ListTransactionsResponse {
  transactions: Transaction[]
}

export class ListTransactionsUseCase {
  constructor(private transactionsRepository: TransactionsRepository) {}

  async execute({
    userId,
    params,
  }: ListTransactionsRequest): Promise<ListTransactionsResponse> {
    const transactions = await this.transactionsRepository.fetchByUserId(
      userId,
      params
    )

    return { transactions }
  }
}
