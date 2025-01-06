import { User } from '@prisma/client'
import { UsersRepository } from '../../repositories/users-repository'
import { UserAlreadyExistsError } from '../_errors/user-already-exists-error'
import { Encrypter } from '../../repositories/cryptography/encrypter'

interface RegisterUserRequest {
  name: string
  email: string
  password: string
}

interface RegisterUserResponse {
  user: User
}

export class RegisterUserUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private encrypter: Encrypter
  ) {}

  async execute({
    name,
    email,
    password,
  }: RegisterUserRequest): Promise<RegisterUserResponse> {
    const userWithSameEmail = await this.usersRepository.findByEmail(email)

    if (userWithSameEmail) {
      throw new UserAlreadyExistsError()
    }

    const hashedPassword = await this.encrypter.hash(password)

    const user = await this.usersRepository.create({
      name,
      email,
      hashedPassword,
    })

    return { user }
  }
}
