// import expect from 'expect'
import 'babel-polyfill'
import request from 'supertest'
import {expect} from 'chai'
import {ObjectID} from 'mongodb'
import Member from '../models/member'
import app from '../server/server'
import {twoTestMembers} from './test-users'
import {oneTestMember} from './test-users'
import {fillMember, insertMembers} from './member-utils'
import Mongoose from 'mongoose'


Mongoose.Promise = global.Promise

require('dotenv').config()
// tmp-start
import {yellow, blue, green, red, greenf} from '../logger/'
// tmp-end

const util = require('util')
const setTimeoutPromise = util.promisify(setTimeout)

before(() => {
  green('global.before')
})

beforeEach(() => {
  green('global.beforeEach')
})

after(() => {
  green('global.after')
})

afterEach(() => {
  green('global.each')
})

describe('level1', function() {
  before(() => {
    green('level1.before')
  })
  describe('level2', () => {
    before(() => {
      green('level2.before')
    })
    describe('#indexOf()', function() {
      it('should return -1 when the value is not present', function() {
        expect(1).to.equal(1)
      })
    })
  })


})
