import { User } from '@prisma/client'
import { UsersRepository } from '../../repositories/users-repository'
import { Encrypter } from '../../repositories/cryptography/encrypter'
import { InvalidCredentialsError } from '../_errors/invalid-credentials-error'

interface AuthenticateRequest {
  email: string
  password: string
}

interface AuthenticateResponse {
  user: User
}

export class AuthenticateUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private encrypter: Encrypter
  ) {}

  async execute({
    email,
    password,
  }: AuthenticateRequest): Promise<AuthenticateResponse> {
    const user = await this.usersRepository.findByEmail(email)

    if (!user) {
      throw new InvalidCredentialsError()
    }

    const isPasswordCorrect = await this.encrypter.compare(
      password,
      user.hashedPassword
    )

    if (!isPasswordCorrect) {
      throw new InvalidCredentialsError()
    }

    return { user }
  }
}
