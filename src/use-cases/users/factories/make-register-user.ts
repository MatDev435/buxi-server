import { BcryptEncrypter } from '../../../repositories/cryptography/bcrypt-encrypter'
import { PrismaUsersRepository } from '../../../repositories/prisma/prisma-users-repository'
import { RegisterUserUseCase } from '../register-user'

export function makeRegisterUser() {
  const usersRepository = new PrismaUsersRepository()
  const encrypter = new BcryptEncrypter()
  const useCase = new RegisterUserUseCase(usersRepository, encrypter)

  return useCase
}
