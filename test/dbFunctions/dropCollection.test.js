import 'babel-polyfill'
import request from 'supertest'
import { expect } from 'chai'
import app from '../../server/server'
import {yellow, blue, green, red, greenf, redf} from '../../logger/'
import { people } from './fixture'
import { find, findById, dropCollection, insertMany, insertOne } from '../../db'
import { ObjectID } from  'mongodb'
require('dotenv').config()

const util = require('util')
const setTimeoutPromise = util.promisify(setTimeout)

const dropPeopleCollection = async () => {
  try {
    await dropCollection('people')
  }
  catch (e) {
    redf('ERROR: before', e)
  }
}

// before(async () => {
//   yellow('before')
// })

after(async () => {
  // yellow('after')
  // dropPeopleCollection()
  if (!process.env.WATCH) {
    setTimeoutPromise(1900).then((value) => {
      process.exit(0)
    })
  }
})

// describe.only('dbFunctions', async () => {
//   before(async () => {
//     await dropCollection('people')

//   })



// })

describe('insert()', () => {
  before(async () => {
    dropPeopleCollection()
  })
  it('should add one person', async () => {
    const onePerson = people[0]
    const insert = await insertOne('people', onePerson)
    // yellow('insert', insert)
    const data = insert.data
    // yellow('data', data)
    expect(data.length).to.equal(1)
    const meta = insert.meta
    // yellow('meta', meta)
    expect(meta.n).to.equal(1)
    const p = data[0]
    // yellow('p', p)
    expect(p.first).to.equal('Abe')
  })
})

describe('insertMany()', () => {
  before(async () => {
    dropPeopleCollection()
  })
  it('should add one person', async () => {
    const insert = await insertMany('people', people)
    // yellow('insert', insert)
    const data = insert.data
    expect(data.length).to.equal(4)
  })
})

describe('find()', () => {
  before(async () => {
    dropPeopleCollection()
  })
  it('should find 4 people', async () => {
    const insert = await insertMany('people', people)
    const d1 = insert.data
    expect(d1.length).to.equal(4)
    const f = await find('people')
    expect(f.data.length).to.equal(4)
  })
})

const isValidObjectID = (id) => {
  const isValid = ObjectID.isValid(id)
  return isValid
}

export const objectIdFromHexString = (hexId) => {
  try {
    return ObjectID.createFromHexString(hexId)
  }
  catch (e) {
    redf('ERROR /db/helpers.js.objectidFromHexString', e)
  }
}

describe.only('findById()', () => {
  before(async () => {
    dropPeopleCollection()
  })
  it('should find by id', async () => {
    const insert = await insertOne('people', people[0])
    const d1 = insert.data
    expect(d1.length).to.equal(1)
    const id = d1[0]._id
    const f = await findById('people', id)
    expect(f.data.length).to.equal(1)
  })
})


