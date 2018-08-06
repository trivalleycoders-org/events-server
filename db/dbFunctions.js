import { dbName, mongoUrl } from './config'
import { objectIdFromHexString } from './helpers'

const MongoClient = require('mongodb').MongoClient

/* Dev */
import { yellow, redf } from '../logger'

export const insertOne = async (collection, data) => {
  try {
    const client = await MongoClient.connect(mongoUrl, { useNewUrlParser: true })
    const db = await client.db(dbName)
    const ret = await db.collection(collection).insert(data)
    return { data: ret.ops, meta: { n: 1 } }
  }
  catch (e) {
    redf('ERROR: dbFunctions.insert', e)
  }

}

export const dropCollection = async (collection) => {
  try {
    const client = await MongoClient.connect(mongoUrl, { useNewUrlParser: true })
    const db = await client.db(dbName)
    const ret = await db.collection(collection).drop()
    yellow('dbFunctions.dropCollection: ret', ret)
  }
  catch (e) {
    redf('ERROR: dbFunctions.dropCollection', e)
  }
}

export const findById = async (collection, id, project = {}) => {
  try {
    const objId = objectIdFromHexString(id)
    const client = await MongoClient.connect(mongoUrl, { useNewUrlParser: true })
    const db = await client.db(dbName)
    const ret = await db.collection(collection).find({ _id: objId }).project(project).toArray()
  return ret
  }
  catch (e) {
    redf('ERROR: dbFunctions.find', e)
  }

}

export const find = async (collection, query, project = {}) => {
  try {
    const client = await MongoClient.connect(mongoUrl, { useNewUrlParser: true })
    const db = await client.db(dbName)
    const ret = await db.collection(collection).find(query).project(project).toArray()
  return ret
  }
  catch (e) {
    redf('ERROR: dbFunctions.find', e)
  }

}

/*
    UNTESTED
*/
export const findOneAndDelete = async (collection, id) => {
  yellow('id', id)
  try {
    const objId = objectIdFromHexString(id)
    const client = await MongoClient.connect(mongoUrl, { useNewUrlParser: true })
    const db = await client.db(dbName)
    const ret = await db.collection(collection).findOneAndDelete({ _id: objId })
    yellow('ret', ret)
    return ret
  }
  catch (e) {
    redf('ERROR: dbFunctions.findOneAndDelete', e)
  }
}

export const findOneAndUpdate = async ( collection, id, filter, returnOriginal = false ) => {
  try {
    const objId = objectIdFromHexString(id)
    const client = await MongoClient.connect(mongoUrl, { useNewUrlParser: true })
    const db = await client.db(dbName)
    const ret = await db.collection(collection).findOneAndUpdate(
      { _id: objId},
      // { organization: 'BRIIA'},
      { $set: filter },
      { returnOriginal: returnOriginal }
    )
    return ret
  }
  catch (e) {
    redf('ERROR: dbFunctions.findOneAndUpdate', e)
  }
}
