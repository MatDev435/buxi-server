import { Prisma, User } from '@prisma/client'
import { UsersRepository } from '../../src/repositories/users-repository'

export class InMemoryUsersRepository implements UsersRepository {
  public items: User[] = []

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.items.find(item => item.email === email)

    if (!user) {
      return null
    }

    return user
  }

  async create(user: Prisma.UserUncheckedCreateInput): Promise<User> {
    const newUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      hashedPassword: user.hashedPassword,
      createdAt: user.createdAt,
    } as User

    this.items.push(newUser)

    return newUser
  }
}
