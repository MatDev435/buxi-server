import { makeUser } from '../../../test/factories/make-user'
import { FakeEncrypter } from '../../../test/repositories/cryptography/fake-encrypter'
import { InMemoryUsersRepository } from '../../../test/repositories/in-memory-users-repository'
import { InvalidCredentialsError } from '../_errors/invalid-credentials-error'
import { AuthenticateUseCase } from './authenticate'

let inMemoryUsersRepository: InMemoryUsersRepository
let fakeEncrypter: FakeEncrypter
let sut: AuthenticateUseCase

describe('Authenticate Use Case', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    fakeEncrypter = new FakeEncrypter()
    sut = new AuthenticateUseCase(inMemoryUsersRepository, fakeEncrypter)
  })

  it('should be able to authenticate', async () => {
    inMemoryUsersRepository.items.push(
      makeUser({
        email: 'johndoe@example.com',
        hashedPassword: await fakeEncrypter.hash('123456'),
      })
    )

    const { user } = await sut.execute({
      email: 'johndoe@example.com',
      password: '123456',
    })

    expect(user).toEqual(inMemoryUsersRepository.items[0])
  })

  it('should not be able to authenticate with wrong email', async () => {
    inMemoryUsersRepository.items.push(
      makeUser({
        email: 'johndoe@example.com',
        hashedPassword: await fakeEncrypter.hash('123456'),
      })
    )

    await expect(() =>
      sut.execute({
        email: 'wrong@example.com',
        password: '123456',
      })
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not be able to authenticate with wrong password', async () => {
    inMemoryUsersRepository.items.push(
      makeUser({
        email: 'johndoe@example.com',
        hashedPassword: await fakeEncrypter.hash('123456'),
      })
    )

    await expect(() =>
      sut.execute({
        email: 'johndoe@example.com',
        password: 'wrong',
      })
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
