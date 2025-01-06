import { faker } from '@faker-js/faker'
import { Transaction } from '@prisma/client'
import { randomUUID } from 'node:crypto'

export function makeTransaction(override: Partial<Transaction> = {}) {
  return {
    id: randomUUID(),
    name: faker.lorem.sentence(),
    description: faker.lorem.paragraph(),
    category: faker.lorem.sentence(),
    value: faker.number.int(),
    type: 'income',
    createdAt: new Date(),
    ...override,
  } as Transaction
}
