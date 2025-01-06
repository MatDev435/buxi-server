import {
  DashboardCardsResponse,
  TransactionsRepository,
} from '../../repositories/transactions-repository'

interface GetTotalExpenseRequest {
  userId: string
}

interface GetTotalExpenseResponse {
  data: DashboardCardsResponse
}

export class GetTotalExpenseUseCase {
  constructor(private transactionsRepository: TransactionsRepository) {}

  async execute({
    userId,
  }: GetTotalExpenseRequest): Promise<GetTotalExpenseResponse> {
    const data = await this.transactionsRepository.getTotalExpense(userId)

    return { data }
  }
}
