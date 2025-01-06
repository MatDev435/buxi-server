import { Prisma, Transaction } from '@prisma/client'
import { TransactionsRepository } from '../../src/repositories/transactions-repository'

export class InMemoryTransactionsRepository implements TransactionsRepository {
  public items: Transaction[] = []

  async findById(id: string): Promise<Transaction | null> {
    const transaction = this.items.find(item => item.id === id)

    if (!transaction) {
      return null
    }

    return transaction
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
