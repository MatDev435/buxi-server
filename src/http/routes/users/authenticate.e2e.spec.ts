import request from 'supertest'
import { app } from '../../app'

describe('(E2E) Authenticate', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to register', async () => {
    await request(app.server).post('/register').send({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })
  })
})
