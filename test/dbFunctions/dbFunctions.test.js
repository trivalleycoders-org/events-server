import 'babel-polyfill'
import request from 'supertest'
import { expect } from 'chai'
import app from '../../server/server'
import {yellow, blue, green, red, greenf, redf} from '../../logger/'
import { people } from './fixture'
import { find,
  findById,
  findOneAndDelete,
  findOneAndUpdate,
  dropCollection,
  insertMany,
  insertOne,
} from '../../db'
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
const dropAllCollections = async () => {
  try {
    await dropCollection('people')
    await dropCollection('events')
    await dropCollection('postalCodes')
  }
  catch (e) {
    redf('ERROR: before', e)
  }
}

// before(async () => {
//   yellow('before')
// })

after(async () => {
  // dropPeopleCollection()
  dropAllCollections()
  if (!process.env.WATCH) {
    setTimeoutPromise(1900).then((value) => {
      process.exit(0)
    })
  }
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

describe('findById()', () => {
  before(async () => {
    dropPeopleCollection()
  })
  it('should find by id', async () => {
    const insert = await insertOne('people', people[0])
    const d1 = insert.data
    expect(d1.length).to.equal(1)
    const id = d1[0]._id
    const f = await findById('people', id)
    const data = f.data
    expect(data.length).to.equal(1)
    const p = data[0]
    expect(p.first).to.equal('Abe')
  })
})

describe('findOneAndDelete()', () => {
  before(async () => {
    dropPeopleCollection()
  })
  it('should find by id and delete', async () => {
    const insert = await insertMany('people', people)
    const d1 = insert.data
    expect(d1.length).to.equal(4)
    const id = d1[0]._id
    const f = await findOneAndDelete('people', id)
    const data = f.data
    expect(data.length).to.equal(1)
    const p = data[0]
    expect(p.first).to.equal('Abe')
  })
})

describe('findOneAndUpdate()', () => {
  before(async () => {
    dropPeopleCollection()
  })
  it('should find by id and update', async () => {
    const insert = await insertMany('people', people)
    const insertedData = insert.data
    expect(insertedData.length).to.equal(4)
    const id = insertedData[0]._id
    const newData1 = {first: 'Jed'}
    const update1 = await findOneAndUpdate('people', id, newData1)
    const data1 = update1.data
    expect(data1.length).to.equal(1)
    const person1 = data1[0]
    expect(person1.first).to.equal('Jed')
    //
    const newData2 = {last: 'Jenkins'}
    const update2 = await findOneAndUpdate('people', id, newData2)
    const data2 = update2.data
    expect(data2.length).to.equal(1)
    const person2 = data2[0]
    expect(person2.last).to.equal('Jenkins')
    //
    const newData3 = {first: 'Bob', last: 'Bradcliff'}
    const update3 = await findOneAndUpdate('people', id, newData3)
    const data3 = update3.data
    expect(data3.length).to.equal(1)
    const person3 = data3[0]
    expect(person3.first).to.equal('Bob')
    expect(person3.last).to.equal('Bradcliff')
  })
})

describe('insert()', () => {
  before(async () => {
    dropPeopleCollection()
  })
  it('should add one person', async () => {
    const onePerson = people[0]
    const insert = await insertOne('people', onePerson)
    const data = insert.data
    expect(data.length).to.equal(1)
    const p = data[0]
    expect(p.first).to.equal('Abe')
  })
})

describe('insertMany()', () => {
  before(async () => {
    dropPeopleCollection()
  })
  it('should add one person', async () => {
    const insert = await insertMany('people', people)
    const data = insert.data
    expect(data.length).to.equal(4)
  })
})