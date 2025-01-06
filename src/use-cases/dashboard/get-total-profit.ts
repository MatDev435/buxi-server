import {
  DashboardCardsResponse,
  TransactionsRepository,
} from '../../repositories/transactions-repository'

interface GetTotalProfitRequest {
  userId: string
}

interface GetTotalProfitResponse {
  data: DashboardCardsResponse
}

export class GetTotalProfitUseCase {
  constructor(private transactionsRepository: TransactionsRepository) {}

  async execute({
    userId,
  }: GetTotalProfitRequest): Promise<GetTotalProfitResponse> {
    const data = await this.transactionsRepository.getTotalProfit(userId)

    return { data }
  }
}
