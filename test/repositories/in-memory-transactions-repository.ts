import { Prisma, Transaction } from '@prisma/client'
import {
  FetchByUserIdParams,
  DashboardCardsResponse,
  TransactionsRepository,
  MonthActivityResponse,
  YearActivityResponse,
} from '../../src/repositories/transactions-repository'
import dayjs from 'dayjs'
import 'dayjs/locale/pt-br'

dayjs.locale('pt-br')

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
    const currentMonth = dayjs().month()

    const transactions = this.items.filter(item => {
      const matchesUserId = item.ownerId === userId

      const matchesDate = date
        ? item.createdAt.toISOString().split('T')[0] ===
          date.toISOString().split('T')[0]
        : dayjs(item.createdAt).month() === currentMonth

      const matchesName = name ? item.name === name : true

      const matchesCategory = category ? item.category === category : true

      return matchesUserId && matchesDate && matchesName && matchesCategory
    })

    return transactions
  }

  async getTransactionsCount(userId: string): Promise<DashboardCardsResponse> {
    const currentMonth = dayjs().month()
    const lastMonth = dayjs().subtract(1, 'month').month()

    const currentMonthTransactions = this.items.filter(
      item =>
        item.ownerId === userId &&
        dayjs(item.createdAt).month() === currentMonth
    )
    const lastMonthTransactions = this.items.filter(
      item =>
        item.ownerId === userId && dayjs(item.createdAt).month() === lastMonth
    )

    return {
      currentMonth: currentMonthTransactions.length,
      diffFromLastMonth:
        currentMonthTransactions.length - lastMonthTransactions.length,
    }
  }

  async getTotalIncome(userId: string): Promise<DashboardCardsResponse> {
    const currentMonth = dayjs().month()
    const lastMonth = dayjs().subtract(1, 'month').month()

    const currentMonthTransactions = this.items.filter(
      item =>
        item.ownerId === userId &&
        dayjs(item.createdAt).month() === currentMonth &&
        item.type === 'income'
    )
    const lastMonthTransactions = this.items.filter(
      item =>
        item.ownerId === userId &&
        dayjs(item.createdAt).month() === lastMonth &&
        item.type === 'income'
    )

    const totalIncome = currentMonthTransactions.reduce(
      (result, transaction) => {
        return result + transaction.value.toNumber()
      },
      0
    )
    const lastMonthIncome = lastMonthTransactions.reduce(
      (result, transaction) => {
        return result + transaction.value.toNumber()
      },
      0
    )
    const diffFromLastMonth =
      ((totalIncome - lastMonthIncome) / lastMonthIncome) * 100

    return {
      currentMonth: totalIncome,
      diffFromLastMonth,
    }
  }

  async getTotalExpense(userId: string): Promise<DashboardCardsResponse> {
    const currentMonth = dayjs().month()
    const lastMonth = dayjs().subtract(1, 'month').month()

    const currentMonthTransactions = this.items.filter(
      item =>
        item.ownerId === userId &&
        dayjs(item.createdAt).month() === currentMonth &&
        item.type === 'expense'
    )
    const lastMonthTransactions = this.items.filter(
      item =>
        item.ownerId === userId &&
        dayjs(item.createdAt).month() === lastMonth &&
        item.type === 'expense'
    )

    const totalExpense = currentMonthTransactions.reduce(
      (result, transaction) => {
        return result + transaction.value.toNumber()
      },
      0
    )
    const lastMonthExpense = lastMonthTransactions.reduce(
      (result, transaction) => {
        return result + transaction.value.toNumber()
      },
      0
    )

    const diffFromLastMonth =
      ((totalExpense - lastMonthExpense) / lastMonthExpense) * 100

    return {
      currentMonth: totalExpense,
      diffFromLastMonth,
    }
  }

  async getTotalProfit(userId: string): Promise<DashboardCardsResponse> {
    const currentMonth = dayjs().month()
    const lastMonth = dayjs().subtract(1, 'month').month()

    const currentMonthTransactions = this.items.filter(
      item =>
        item.ownerId === userId &&
        dayjs(item.createdAt).month() === currentMonth
    )

    const lastMonthTransactions = this.items.filter(
      item =>
        item.ownerId === userId && dayjs(item.createdAt).month() === lastMonth
    )

    const totalProfit = currentMonthTransactions.reduce(
      (result, transaction) => {
        return transaction.type === 'income'
          ? result + transaction.value.toNumber()
          : result - transaction.value.toNumber()
      },
      0
    )

    const lastMonthTotalProfit = lastMonthTransactions.reduce(
      (result, transaction) => {
        return transaction.type === 'income'
          ? result + transaction.value.toNumber()
          : result - transaction.value.toNumber()
      },
      0
    )

    const diffFromLastMonth =
      ((totalProfit - lastMonthTotalProfit) / lastMonthTotalProfit) * 100

    return {
      currentMonth: totalProfit,
      diffFromLastMonth,
    }
  }

  async getMonthActivity(userId: string): Promise<MonthActivityResponse[]> {
    const currentMonth = dayjs().month()
    const daysInMonth = dayjs().daysInMonth()

    const monthTransactions = this.items.filter(
      item =>
        item.ownerId === userId &&
        dayjs(item.createdAt).month() === currentMonth
    )

    let accumulatedValue = 0

    const dailyProfit: MonthActivityResponse[] = Array.from(
      { length: daysInMonth },
      (_, day) => {
        const profit = monthTransactions
          .filter(item => dayjs(item.createdAt).date() === day + 1)
          .reduce(
            (result, transaction) =>
              transaction.type === 'income'
                ? result + transaction.value.toNumber()
                : result - transaction.value.toNumber(),
            0
          )

        accumulatedValue += profit

        return { day: day + 1, value: accumulatedValue }
      }
    )

    return dailyProfit
  }

  async getYearActivity(userId: string): Promise<YearActivityResponse[]> {
    const data: YearActivityResponse[] = Array.from(
      { length: 11 },
      (_, month) => {
        const income = this.items
          .filter(
            item =>
              item.ownerId === userId &&
              dayjs(item.createdAt).year() === dayjs().year() &&
              dayjs(item.createdAt).month() === month &&
              item.type === 'income'
          )
          .reduce(
            (result, transaction) => result + transaction.value.toNumber(),
            0
          )

        const expense = this.items
          .filter(
            item =>
              item.ownerId === userId &&
              dayjs(item.createdAt).year() === dayjs().year() &&
              dayjs(item.createdAt).month() === month &&
              item.type === 'expense'
          )
          .reduce(
            (result, transaction) => result + transaction.value.toNumber(),
            0
          )

        return {
          month: dayjs().month(month).format('MMM'),
          income,
          expense,
        }
      }
    )

    return data
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
