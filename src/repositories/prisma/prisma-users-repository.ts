import { Prisma, User } from '@prisma/client'
import { UsersRepository } from '../users-repository'
import { prisma } from '../../lib/prisma'

export class PrismaUsersRepository implements UsersRepository {
  async findByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    return user
  }

  async create(user: Prisma.UserUncheckedCreateInput): Promise<User> {
    const newUser = await prisma.user.create({
      data: user,
    })

    return newUser
  }
}
