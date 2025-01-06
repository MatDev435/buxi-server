import { makeUser } from '../../../test/factories/make-user'
import { FakeEncrypter } from '../../../test/repositories/cryptography/fake-encrypter'
import { InMemoryUsersRepository } from '../../../test/repositories/in-memory-users-repository'
import { UserAlreadyExistsError } from '../_errors/user-already-exists-error'
import { RegisterUserUseCase } from './register-user'

let inMemoryUsersRepository: InMemoryUsersRepository
let fakeEncrypter: FakeEncrypter
let sut: RegisterUserUseCase

describe('Register User Use Case', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    fakeEncrypter = new FakeEncrypter()
    sut = new RegisterUserUseCase(inMemoryUsersRepository, fakeEncrypter)
  })

  it('should be able to register a user', async () => {
    const { user } = await sut.execute({
      email: 'johndoe@example.com',
      name: 'John Doe',
      password: '123456',
    })

    expect(user).toEqual(inMemoryUsersRepository.items[0])
  })

  it('should be hash user password upon registration', async () => {
    const { user } = await sut.execute({
      email: 'johndoe@example.com',
      name: 'John Doe',
      password: '123456',
    })

    const isPasswordHashed = await fakeEncrypter.compare(
      '123456',
      user.hashedPassword
    )

    expect(isPasswordHashed).toBe(true)
  })

  it('should not be able to register a same user twice', async () => {
    inMemoryUsersRepository.items.push(
      makeUser({
        email: 'johndoe@example.com',
      })
    )

    await expect(() =>
      sut.execute({
        email: 'johndoe@example.com',
        name: 'John Doe',
        password: '123456',
      })
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})
