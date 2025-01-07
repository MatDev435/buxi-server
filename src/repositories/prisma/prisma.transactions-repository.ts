import { Prisma, Transaction } from '@prisma/client'
import {
  DashboardCardsResponse,
  FetchByUserIdParams,
  MonthActivityResponse,
  TransactionsRepository,
  YearActivityResponse,
} from '../transactions-repository'
import { prisma } from '../../lib/prisma'
import dayjs from 'dayjs'
import 'dayjs/locale/pt-br'

dayjs.locale('pt-br')

export class PrismaTransactionsRepository implements TransactionsRepository {
  async findById(id: string): Promise<Transaction | null> {
    const transaction = await prisma.transaction.findUnique({
      where: {
        id,
      },
    })

    return transaction
  }

  async fetchByUserId(
    userId: string,
    params: FetchByUserIdParams
  ): Promise<Transaction[]> {
    const currentMonth = dayjs().month()
    const currentYear = dayjs().year()

    const transactions = await prisma.transaction.findMany({
      where: {
        ownerId: userId,
        createdAt: {
          gte: new Date(currentYear, currentMonth, 1),
          lt: new Date(currentYear, currentMonth + 1, 1),
        },
      },
    })

    return transactions
  }

  async getTransactionsCount(userId: string): Promise<DashboardCardsResponse> {
    const currentMonth = dayjs().month()
    const lastMonth = dayjs().subtract(1, 'month').month()
    const currentYear = dayjs().year()

    const currentMonthTransactions = await prisma.transaction.findMany({
      where: {
        ownerId: userId,
        createdAt: {
          gte: new Date(currentYear, currentMonth, 1),
          lt: new Date(currentYear, currentMonth + 1, 1),
        },
      },
      select: {
        value: true,
      },
    })

    const lastMonthTransactions = await prisma.transaction.findMany({
      where: {
        ownerId: userId,
        createdAt: {
          gte: new Date(currentYear, lastMonth, 1),
          lt: new Date(currentYear, lastMonth + 1, 1),
        },
      },
      select: {
        value: true,
      },
    })

    const diffFromLastMonth =
      ((currentMonthTransactions.length - lastMonthTransactions.length) /
        lastMonthTransactions.length) *
      100

    return {
      currentMonth: currentMonthTransactions.length,
      diffFromLastMonth,
    }
  }

  async getTotalIncome(userId: string): Promise<DashboardCardsResponse> {
    const currentMonth = dayjs().month()
    const lastMonth = dayjs().subtract(1, 'month').month()
    const currentYear = dayjs().year()

    const currentMonthTransactions = await prisma.transaction.findMany({
      where: {
        ownerId: userId,
        type: 'income',
        createdAt: {
          gte: new Date(currentYear, currentMonth, 1),
          lt: new Date(currentYear, currentMonth + 1, 1),
        },
      },
      select: {
        value: true,
      },
    })

    const lastMonthTransactions = await prisma.transaction.findMany({
      where: {
        ownerId: userId,
        type: 'income',
        createdAt: {
          gte: new Date(currentYear, lastMonth, 1),
          lt: new Date(currentYear, lastMonth + 1, 1),
        },
      },
      select: {
        value: true,
      },
    })

    const totalIncome = currentMonthTransactions.reduce(
      (result, transaction) => result + transaction.value.toNumber(),
      0
    )
    const lastMonthIncome = lastMonthTransactions.reduce(
      (result, transaction) => result + transaction.value.toNumber(),
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
    const currentYear = dayjs().year()

    const currentMonthTransactions = await prisma.transaction.findMany({
      where: {
        ownerId: userId,
        type: 'expense',
        createdAt: {
          gte: new Date(currentYear, currentMonth, 1),
          lt: new Date(currentYear, currentMonth + 1, 1),
        },
      },
      select: {
        value: true,
      },
    })

    const lastMonthTransactions = await prisma.transaction.findMany({
      where: {
        ownerId: userId,
        type: 'expense',
        createdAt: {
          gte: new Date(currentYear, lastMonth, 1),
          lt: new Date(currentYear, lastMonth + 1, 1),
        },
      },
      select: {
        value: true,
      },
    })

    const totalExpense = currentMonthTransactions.reduce(
      (result, transaction) => result + transaction.value.toNumber(),
      0
    )
    const lastMonthExpense = lastMonthTransactions.reduce(
      (result, transaction) => result + transaction.value.toNumber(),
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
    const currentYear = dayjs().year()

    const currentMonthTransactions = await prisma.transaction.findMany({
      where: {
        ownerId: userId,
        createdAt: {
          gte: new Date(currentYear, currentMonth, 1),
          lt: new Date(currentYear, currentMonth + 1, 1),
        },
      },
      select: {
        value: true,
        type: true,
      },
    })

    const lastMonthTransactions = await prisma.transaction.findMany({
      where: {
        ownerId: userId,
        createdAt: {
          gte: new Date(currentYear, lastMonth, 1),
          lt: new Date(currentYear, lastMonth + 1, 1),
        },
      },
      select: {
        value: true,
        type: true,
      },
    })

    const totalProfit = currentMonthTransactions.reduce(
      (result, transaction) =>
        transaction.type === 'income'
          ? result + transaction.value.toNumber()
          : result - transaction.value.toNumber(),
      0
    )
    const lastMonthProfit = lastMonthTransactions.reduce(
      (result, transaction) =>
        transaction.type === 'income'
          ? result + transaction.value.toNumber()
          : result - transaction.value.toNumber(),
      0
    )

    const diffFromLastMonth =
      ((totalProfit - lastMonthProfit) / lastMonthProfit) * 100

    return {
      currentMonth: totalProfit,
      diffFromLastMonth,
    }
  }

  async getMonthActivity(userId: string): Promise<MonthActivityResponse[]> {
    const currentMonth = dayjs().month()
    const currentYear = dayjs().year()

    const monthTransactions = await prisma.transaction.findMany({
      where: {
        ownerId: userId,
        createdAt: {
          gte: new Date(currentYear, currentMonth, 1),
          lt: new Date(currentYear, currentMonth + 1, 1),
        },
      },
      select: {
        value: true,
        type: true,
        createdAt: true,
      },
    })

    const daysInMonth = dayjs().daysInMonth()
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
    const startOfYear = dayjs().startOf('year').toDate()
    const endOfYear = dayjs().endOf('year').toDate()

    const transactions = await prisma.transaction.findMany({
      where: {
        ownerId: userId,
        createdAt: {
          gte: startOfYear,
          lt: endOfYear,
        },
      },
      select: {
        value: true,
        type: true,
        createdAt: true,
      },
    })

    const data: YearActivityResponse[] = Array.from(
      { length: 11 },
      (_, month) => {
        const income = transactions
          .filter(
            item =>
              dayjs(item.createdAt).month() === month && item.type === 'income'
          )
          .reduce(
            (result, transaction) => result + transaction.value.toNumber(),
            0
          )

        const expense = transactions
          .filter(
            item =>
              dayjs(item.createdAt).month() === month && item.type === 'expense'
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
    const newTransaction = await prisma.transaction.create({
      data: transaction,
    })

    return newTransaction
  }

  async delete(id: string): Promise<void> {
    await prisma.transaction.delete({
      where: {
        id,
      },
    })
  }
}
