import express from 'express'
import fetch from 'node-fetch'
/* Dev */
import { red, yellow } from '../logger'

const router = express.Router()
const MongoClient = require('mongodb').MongoClient
const database = 'EventsDev'
const collection = 'postalCodes'
const url = 'mongodb://localhost:27017'

const executeAggregate = async (query) => {
  const client = await MongoClient.connect(url, { useNewUrlParser: true })
  const db = await client.db(database)
  const ret = await db.collection(collection).aggregate(query).toArray()
  return ret
}


router.get('/postal-codes/:startsWith', async (req, res) => {
  const startsWith = req.params.startsWith
  // yellow('startsWith', startsWith)
  const re = new RegExp(`^${startsWith}`)
  // yellow('re', re)

  const match1 = {
    $match: { 'postalCode': { $regex: re , $options: 'im' } }
  }
  const project1 = {
    $project: {
      postalCode: 1,
      searchString: {
        $cond: { if: { $ifNull: ['$stateName', false] },
          then: { $concat: [ '$postalCode', ' ', '$cityName', ' ', '$stateName' ] },
          else: { $concat: [ '$postalCode', ' ', '$cityName' ] } }
      }
    }
  }

  const q = [
    match1,
    project1,
  ]
  // yellow('q', q)
  const ret = await executeAggregate(q)
  // yellow('ret', ret)
  res.send(JSON.stringify(ret))
})

router.get('/', async (req, res) => {
  // const r1 = await fetch('http://github.com/users/github')
  // res.send(JSON.stringify(r1))
  // res.send('route working')
  const url0 = 'https://github.com/'
  const url1 = 'https://maps.googleapis.com/maps/api/place/autocomplete/json?input=dublin+library&key=AIzaSyChA326uxlXZXCiaqEYxdn4eTJTt3OhPyE&session_token=1234567890'

  fetch(url1)
	.then(res => res.text())
	.then(body => res.send(body))
})

router.get('/cities/:startsWith', async (req, res) => {
  const startsWith = req.params.startsWith
  // yellow('startsWith', startsWith)

  const re = new RegExp(`^${startsWith}`)
  const match1 = {
    $match: { 'cityName': { $regex: re , $options: 'im' } }
  }
  const project1 = {
    $project: {
      _id: 1,
      postalString: 1,
      searchString: { $concat: [ '$cityName', ', ', '$stateName', ' ', '$postalCode']}
    }
  }
  const q = [
    match1,
    project1,
  ]

  const ret = await executeAggregate(q)
  // yellow('ret', ret)
  res.send(JSON.stringify(ret))
})

export default router