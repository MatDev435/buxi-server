import { Prisma, Transaction } from '@prisma/client'
import {
  FetchByUserIdParams,
  TransactionsRepository,
} from '../../src/repositories/transactions-repository'

export class InMemoryTransactionsRepository implements TransactionsRepository {
  public items: Transaction[] = []

  async findById(id: string): Promise<Transaction | null> {
    const transaction = this.items.find(item => item.id === id)

    if (!transaction) {
      return null
    }

    return transaction
  }

  async fetchByUserId(
    userId: string,
    { date, name, category }: FetchByUserIdParams
  ): Promise<Transaction[]> {
    const transactions = this.items.filter(item => {
      const matchesUserId = item.ownerId === userId

      const matchesDate = date
        ? item.createdAt.toISOString().split('T')[0] ===
          date.toISOString().split('T')[0]
        : true

      const matchesName = name ? item.name === name : true

      const matchesCategory = category ? item.category === category : true

      return matchesUserId && matchesDate && matchesName && matchesCategory
    })

    return transactions
  }

  async create(
    transaction: Prisma.TransactionUncheckedCreateInput
  ): Promise<Transaction> {
    const newTransaction = {
      id: transaction.id,
      ownerId: transaction.ownerId,
      name: transaction.name,
      description: transaction.description,
      category: transaction.category,
      value: transaction.value,
      type: transaction.type,
      createdAt: transaction.createdAt,
    } as Transaction

    this.items.push(newTransaction)

    return newTransaction
  }

  async delete(id: string): Promise<void> {
    const itemIndex = this.items.findIndex(item => item.id === id)

    this.items.splice(itemIndex, 1)
  }
}
