import { dbName, mongoUrl } from './config'
import { objectIdFromHexString, removeIdProp } from './helpers'

const MongoClient = require('mongodb').MongoClient

const returnError = (e) => {
  return { data: [], meta: { error: e.message }}

}

/* Dev */
import { yellow, redf } from '../logger'

export const insertOne = async (collection, data) => {
  // yellow('insertOne: collection', collection)
  // yellow('insertOne: data', data)
  // yellow('insertOne: mongoUrl', mongoUrl)
  // yellow('insertOne: dbName', dbName)
  try {
    const client = await MongoClient.connect(mongoUrl)
    const db = await client.db(dbName)
    const ret = await db.collection(collection).insertOne(data)
    return { data: ret.ops, meta: { n: 1 } }
  }
  catch (e) {
    redf('ERROR: dbFunctions.insert', e.message)
    return returnError(e)
  }

}

export const dropCollection = async (collection) => {
  try {
    const client = await MongoClient.connect(mongoUrl)
    const db = await client.db(dbName)
    const ret = await db.collection(collection).drop()
    // yellow('dbFunctions.dropCollection: ret', ret)
    return ret
  }
  catch (e) {
    redf('ERROR: dbFunctions.dropCollection', e.message)
    return returnError(e)
  }
}

export const findById = async (collection, id, project = {}) => {
  try {
    const objId = objectIdFromHexString(id)
    const client = await MongoClient.connect(mongoUrl)
    const db = await client.db(dbName)
    const ret = await db.collection(collection).find({ _id: objId }).project(project).toArray()
    return ret
  }
  catch (e) {
    redf('ERROR: dbFunctions.find', e.message)
    return returnError(e)
  }

}

export const find = async (collection, query, project = {}) => {
  try {
    const client = await MongoClient.connect(mongoUrl)
    const db = await client.db(dbName)
    const ret = await db.collection(collection).find(query).project(project).toArray()
  return ret
  }
  catch (e) {
    redf('ERROR: dbFunctions.find', e.message)
    return returnError(e)
  }

}

/*
    UNTESTED
*/
export const findOneAndDelete = async (collection, id) => {
  // yellow('id', id)
  try {
    const objId = objectIdFromHexString(id)
    const client = await MongoClient.connect(mongoUrl)
    const db = await client.db(dbName)
    const ret = await db.collection(collection).findOneAndDelete({ _id: objId })
    // yellow('ret', ret)
    return ret
  }
  catch (e) {
    redf('ERROR: dbFunctions.findOneAndDelete', e.message)
    return returnError(e)
  }
}

export const findOneAndUpdate = async ( collection, id, filter, returnOriginal = false ) => {
  try {
    // if the filter has the _id prop, remove it
    const cleanFilter = removeIdProp(filter)
    const objId = objectIdFromHexString(id)
    const client = await MongoClient.connect(mongoUrl)
    const db = await client.db(dbName)
    const ret = await db.collection(collection).findOneAndUpdate(
      { _id: objId},
      // { organization: 'BRIIA'},
      { $set: cleanFilter },
      { returnOriginal: returnOriginal }
    )
    return ret
  }
  catch (e) {
    redf('ERROR: dbFunctions.findOneAndUpdate', e)
    return returnError(e)
  }
}
