import {
  DashboardCardsResponse,
  TransactionsRepository,
} from '../../repositories/transactions-repository'

interface GetTotalIncomeRequest {
  userId: string
}

interface GetTotalIncomeResponse {
  data: DashboardCardsResponse
}

export class GetTotalIncomeUseCase {
  constructor(private transactionsRepository: TransactionsRepository) {}

  async execute({
    userId,
  }: GetTotalIncomeRequest): Promise<GetTotalIncomeResponse> {
    const data = await this.transactionsRepository.getTotalIncome(userId)

    return { data }
  }
}
