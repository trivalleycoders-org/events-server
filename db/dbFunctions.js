
const MongoClient = require('mongodb').MongoClient
require('dotenv').config()
/* Dev */
import { yellow, redf } from '../logger'
import { Z_FILTERED } from 'zlib';

const nodeEnv = process.env.NODE_ENV

const url = () => {

  switch (nodeEnv) {
    case 'test':
    case 'development':
      return 'mongodb://localhost:27017'
    case 'production':
      return 'TBD'
  }
}

const database = () => {
  switch (nodeEnv) {
    case 'test':
      return 'EventsTest'
    case 'development':
      return 'EventsDev'
    case 'production':
      return 'Events'
  }
}

export const find = async (collection, query, project = {}) => {
  try {
    const client = await MongoClient.connect(url(), { useNewUrlParser: true })
    const db = await client.db(database())
    const ret = await db.collection(collection).find(query).project(project).toArray()
  return ret
  }
  catch (e) {
    redf('ERROR: dbFunctions.find', e)
  }

}

export const insert = async (collection, data) => {
  try {
    const client = await MongoClient.connect(url(), { useNewUrlParser: true })
    const db = await client.db(database())
    const ret = await db.collection(collection).insert(data)
    return ret
  }
  catch (e) {
    redf('ERROR: dbFunctions.insert', e)
  }

}

export const dropCollection = async (collection) => {
  try {
    const client = await MongoClient.connect(url(), { useNewUrlParser: true })
    const db = await client.db(database())
    const ret = await db.collection(collection).drop()
    yellow('dbFunctions.dropCollection: ret', ret)
  }
  catch (e) {
    redf('ERROR: dbFunctions.dropCollection', e)
  }
}

export const findOneAndUpdate = async (
  collection,
  filter,
  update,
  projection = {},
  returnOriginal = true
) => {
  try {
    const client = await MongoClient.connect(url(), { useNewUrlParser: true })
    const db = await client.db(database())
    const options = { projection, returnOriginal }
    const ret = await db.collection(collection).findOneAndUpdate(filter, update, options)
    yellow('dbFunctions.findOneAndUpdate: ret', ret)
    return ret
  }
  catch (e) {
    redf('ERROR: dbFunctions.findOneAndUpdate', e)
  }
}