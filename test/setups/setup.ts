import { randomUUID } from 'node:crypto'
import { execSync } from 'node:child_process'
import { env } from '../../src/env'
import { prisma } from '../../src/lib/prisma'

function generateDatabaseURL(schema: string) {
  const databaseUrl = new URL(env.DATABASE_URL)

  databaseUrl.searchParams.set('schema', schema)

  return databaseUrl.toString()
}

const schema = randomUUID()

export async function setup() {
  if (!env.DATABASE_URL) {
    throw new Error('Please provide valid environment variables')
  }

  const databaseUrl = generateDatabaseURL(schema)

  env.DATABASE_URL = databaseUrl

  execSync('pnpm prisma migrate deploy')
}

export async function teardown() {
  await prisma.$executeRawUnsafe(`
    DROP TABLE IF EXISTS "${schema}" CASCADE
`)
}

beforeAll(async () => {
  await setup()
})

afterAll(async () => {
  await teardown()
})
