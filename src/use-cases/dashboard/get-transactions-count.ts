import {
  DashboardCardsResponse,
  TransactionsRepository,
} from '../../repositories/transactions-repository'

interface GetTransactionsCountRequest {
  userId: string
}

interface GetTransactionsCountResponse {
  data: DashboardCardsResponse
}

export class GetTransactionsCountUseCase {
  constructor(private transactionsRepository: TransactionsRepository) {}

  async execute({
    userId,
  }: GetTransactionsCountRequest): Promise<GetTransactionsCountResponse> {
    const data = await this.transactionsRepository.getTransactionsCount(userId)

    return { data }
  }
}
