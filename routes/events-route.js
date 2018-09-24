import express from 'express'
import { omit, merge } from 'ramda'
/* User */
import { find, findById, insertOne, findOneAndDelete, findOneAndUpdate, objectIdFromHexString } from '../db'
/* Dev */
import { red, yellow } from '../logger'

const router = express.Router()



/* Merge code from Ramda Repl

const from = {
  "title": "e",
  "organization": "o",
  "dates": {
    "startDate": "2018-09-19T00:37:30.927Z",
    "endDate": "2018-09-19T00:37:30.942Z"
  },
  "venueName": "v",
  "linkToUrl": "l",
  "postalCode": {
    "_id": "5b5f6f52222be42bb919c008",
    "postalCode": "94582",
    "searchString": "94582 San Ramon California"
  },
  "price": "9",
  "tags": [
    "one"
  ]
}

const to = {
  "title": "e",
  "organization": "o",
  "dates": {
    "startDate": "2018-09-19T00:37:30.927Z",
    "endDate": "2018-09-19T00:37:30.942Z"
  },
  "venueName": "v",
  "linkToUrl": "l",
  "location": {
    "postalCode": {
      "_id": "5b5f6f52222be42bb919c008",
      "postalCode": "94582",
      "searchString": "94582 San Ramon California"
    },
    "cityName": "New York",
    "stateCode": "NY",
  },
  "price": "9",
  "tags": [
    "one"
  ]
}

const cityName = "New York" // from db
const stateCode = "NY"  // from db
const postalCode = R.pick(['postalCode'], from)


const r1 = R.omit(['postalCode'], from)



const locationObj = R.mergeAll([
  postalCode,
  {cityName},
  {stateCode}
])

locationObj



const final = R.mergeAll([
  locationObj,
  r1,
])

final




*/


router.post('/', async (req, res) => {

  try {
    const event = req.body

    const postalCodeId = objectIdFromHexString(event.postalCodeId)
    const postalData = await findById(
      'postalCodes',
      postalCodeId,
      { cityName: 1, postalCode: 1, stateCode: 1, _id: 0 }
    )
    // yellow('postalCodeId', postalCodeId)
    // yellow('postalData', postalData)
    // Remove existing postCode and and merge
    const a = omit(['postalCode_id'], event)
    const b = merge(a, postalData.data[0])
    const inserted = await insertOne(
      'events',
      b
    )
    res.send(inserted)
  } catch (e) {
    red('error', e)
    res.status(400).send(e)
  }
})

router.get('/', async (req, res) => {
  try {
    const events = await find('events', {startDateTime: { $gt: new Date().toISOString() } })
    // const events = await find('events', {})
    res.send(events)
  } catch (e) {
    res.status(400).send(e)
  }
})

router.get('/user/:userId', async (req, res) => {

  try {
    const events = await find('events', {userId: req.params.userId})
    // const events = await find('events', {})

    res.send(events)
  } catch (e) {
    res.status(400).send(e)
  }
})



router.get('/:id', async (req, res) => {
  // yellow('get/id')
  const id = req.params.id
  try {
    let event = await findById('events', id)
    if (!event) {
      return res.status(404).send()
    }
    res.send(event)

  } catch (e) {
    res.status(400).send(e)
  }
})

router.delete('/:id', async (req, res) => {
  const id = req.params.id

  try {
    let event = await findOneAndDelete('events', id)
    if (!event) {
      return res.status(404).send()
    }
    res.send(event)
  } catch (e) {
    res.status(400).send()
  }
})

router.patch('/:id', async (req, res) => {

  try {
    const id = req.params.id
    const eventSent = req.body
    const postalCodeId = objectIdFromHexString(eventSent.postalCodeId)
    const postalData = await findById(
      'postalCodes',
      postalCodeId,
      { cityName: 1, postalCode: 1, stateCode: 1, _id: 0 }
    )
    // yellow('postalCodeId', postalCodeId)
    // yellow('postalData', postalData)
    const a = omit(['postalCode_id'], eventSent)
    const b = merge(a, postalData.data[0])
    const eventToReturn = await findOneAndUpdate(
      'events',
      id,
      b,
    )
    // yellow('eventToReturn: ', eventToReturn)
    if (!eventToReturn) {
      return res.status(404).send()
    }
    res.send(eventToReturn)
  } catch (e) {
    red('catch', e)
    res.status(400).send()
  }

})

export default router
