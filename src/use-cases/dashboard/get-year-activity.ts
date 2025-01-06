import {
  YearActivityResponse,
  TransactionsRepository,
} from '../../repositories/transactions-repository'

interface GetYearActivityRequest {
  userId: string
}

interface GetYearActivityResponse {
  data: YearActivityResponse[]
}

export class GetYearActivityUseCase {
  constructor(private transactionsRepository: TransactionsRepository) {}

  async execute({
    userId,
  }: GetYearActivityRequest): Promise<GetYearActivityResponse> {
    const data = await this.transactionsRepository.getYearActivity(userId)

    return { data }
  }
}
