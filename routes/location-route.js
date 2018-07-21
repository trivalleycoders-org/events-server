import express from 'express'
/* Dev */
import { red, yellow } from '../logger'

const MongoClient = require('mongodb').MongoClient
const database = 'EventsDev'
const collection = 'cities'
const router = express.Router()

const executeFind = async (query, project) => {
  // yellow('query', query)
  // yellow('project', project)
  const url = 'mongodb://localhost:27017'
  const client = await MongoClient.connect(url, { useNewUrlParser: true })
  const db = await client.db(database)
  const ret = await db.collection(collection).find(query).project(project).toArray()
  return ret
}


router.get('/cities/:startsWith', async (req, res) => {
  const startsWith = req.params.startsWith
  yellow('startsWith', startsWith)
  const re = new RegExp(`^${startsWith}`)
  const q = { cityName: { $regex: re , $options: 'im' }}
  const p = { cityName: 1, stateName: 1, postalCode: 1, _id: 0 }
  const cities = await executeFind(q, p)
  res.send(JSON.stringify({cities}))
})


export default router
