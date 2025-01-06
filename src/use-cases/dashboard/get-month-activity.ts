import {
  MonthActivityResponse,
  TransactionsRepository,
} from '../../repositories/transactions-repository'

interface GetMonthActivityRequest {
  userId: string
}

interface GetMonthActivityResponse {
  data: MonthActivityResponse[]
}

export class GetMonthActivityUseCase {
  constructor(private transactionsRepository: TransactionsRepository) {}

  async execute({
    userId,
  }: GetMonthActivityRequest): Promise<GetMonthActivityResponse> {
    const data = await this.transactionsRepository.getMonthActivity(userId)

    return { data }
  }
}
