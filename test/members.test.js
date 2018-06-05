// import expect from 'expect'
import 'babel-polyfill'
import request from 'supertest'
import {expect} from 'chai'
import {ObjectID} from 'mongodb'
import Member from '../models/member'
import app from '../server/server'
import {twoTestMembers} from './test-users'
import {oneTestMember} from './test-users'
import {fillMember, insertMembers, getMembers, clearMembers } from './member-utils'
import Mongoose from 'mongoose'

Mongoose.Promise = global.Promise

require('dotenv').config()
// tmp-start
import {yellow, blue, green, red, greenf} from '../logger/'
// tmp-end

const util = require('util')
const setTimeoutPromise = util.promisify(setTimeout)

before((done) => {
  Mongoose.connect(process.env.MONGODB_URI).then(() => {
    greenf('Mongoose connection: ', 'connected')
    done()
  })
})

after(async () => {
  await Mongoose.connection.close().then(() => {
    greenf('Mongoose connection: ', 'closed')
  })
  if (!process.env.WATCH) {
    setTimeoutPromise(1900).then((value) => {
      process.exit(0)
    })
  }
})

describe('members test - start', () => {
  describe('PATCH /members', () => {
    let hexId
    let firstName
    before(async () => {
      await clearMembers()
      const members = await insertMembers(1)
      firstName = members[0].firstName
      const _id = members[0]._id
      hexId = _id.toHexString()
    })
    it('should update firstName', async () => {
      const res = await request(app).delete(`/members/${hexId}`)
      expect(200)
      expect(res.body.member.firstName).to.equal(firstName)
    })
  })

  describe('GET /members', () => {
    // Setup
    describe('Get all members', () => {
      before(async () => {
        await clearMembers()
        await insertMembers(2)
      })
      it('should get all members', async () => {
        const ret = await request(app).get('/members')
        expect(200)
        expect((ret) => {
          expect(ret.body.members.length).to.equal(2)
        })
      })
    })
  })

  describe('GET /members/:id', () => {
    let hexId
    before(async () => {
      await clearMembers()
      const ids = await insertMembers(1, { idsOnly: true })
      hexId = ids[0].toHexString()
      const res = await request(app).delete(`/members/${hexId}`)
      expect(200)
      expect(res.body.member._id).to.equal(hexId)

    })
    it('should get specified member', async () => {
      const ret = await request(app).get('/members')
      expect(200)
      expect((ret) => {
        expect(ret.body.members.length).to.equal(2)
      })
    })
  })

  describe('DELETE /members/:id', () => {
    let hexId
    before(async () => {
      await clearMembers()
      const ids = await insertMembers(1, { idsOnly: true })
      const _id = ids[0]
      hexId = _id.toHexString()
    })
    it('delete 1 member', async () => {
      const res = await request(app).delete(`/members/${hexId}`).send(hexId)
      expect(200)
      expect(res.body.member._id).to.equal(hexId)

    })
  })

  describe('POST /members', () => {
    describe('Insert multiple members', () => {
      let members
      before(async () => {
        await clearMembers()
        members = await getMembers(2)
      })
      it('should insert 2 members', async () => {
        const res = await request(app).post('/members').send(members)
        expect(200)
        expect(res.body.length).to.equal(2)
      })
    })
    describe('Insert one member', () => {
      let members
      before(async () => {
        await clearMembers()
        members = await getMembers(1)
      })
      it('should insert 1 member', async () => {
        const res = await request(app).post('/members').send(members)
        expect(200)
        expect(res.body.length).to.equal(1)
      })
    })
    describe('Bad request', () => {
      it('should return 400', async () => {
        const badMember = {
          someProperty: 'value'
        }
        const res = await request(app).post('/members').send(badMember)
        expect(400)

      })
    })
  })
})
