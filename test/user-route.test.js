import request from 'supertest'
import { expect } from 'chai'
import app from '../server/server.js'

require('dotenv').config()

const util = require('util')
const setTimeoutPromise = util.promisify(setTimeout)

after(async () => {
  if (!process.env.WATCH) {
    setTimeoutPromise(2500).then((value) => {
      process.exit(0)
    })
  }
})

describe('User Route', () => {

  const user = {
    email: 'test5@xyz.com',
    password: 'welcome'
  }

  it('should register a new user', async () => {
    await request(app).post('/users').send({ user }).expect(200)
  })

  it('should login the user', async () => {
    const res = await request(app).post('/users/login').send({ user }).expect(200)
  })

})
