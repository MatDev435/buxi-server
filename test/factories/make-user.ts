import { randomUUID } from 'node:crypto'
import { User } from '@prisma/client'
import { faker } from '@faker-js/faker'

export function makeUser(override: Partial<User> = {}) {
  return {
    id: randomUUID(),
    email: faker.internet.email(),
    name: faker.internet.username(),
    hashedPassword: faker.internet.password(),
    createdAt: new Date(),
    ...override,
  } as User
}
