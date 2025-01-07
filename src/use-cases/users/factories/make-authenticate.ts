import { BcryptEncrypter } from '../../../repositories/cryptography/bcrypt-encrypter'
import { PrismaUsersRepository } from '../../../repositories/prisma/prisma-users-repository'
import { AuthenticateUseCase } from '../authenticate'

export function makeAuthenticate() {
  const usersRepository = new PrismaUsersRepository()
  const encrypter = new BcryptEncrypter()
  const useCase = new AuthenticateUseCase(usersRepository, encrypter)

  return useCase
}
