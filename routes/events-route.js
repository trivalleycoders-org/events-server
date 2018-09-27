import express from 'express'
import { omit, merge } from 'ramda'
/* User */
import { find, findById, insertOne, findOneAndDelete, findOneAndUpdate, objectIdFromHexString } from '../db'
/* Dev */
import { red, yellow } from '../logger'




const x = {
  imageUrl: 'https://photo-app-tvc.s3.us-west-2.amazonaws.com/Selection_017-09-21-2018-1537557922736.png',
  title: 'Title',
  organization: 'org',
  dates: {
    startDate: '2018-09-21T19:25:13.977Z',
    endDate: '2018-09-21T19:25:13.988Z'
  },
  venueName: 'ven',
  linkToUrl: 'lin',
  location: {
    _id: '5b5f6f52222be42bb919c008',
    postalCode: '94582',
    cityName: 'San Ramon',
    stateCode: 'CA',
    searchString: '94582 San Ramon California'
  },
  price: '39',
  tags: [ 'one', 'two' ],
  userId: '5b8da331a685965241323678'
}






const router = express.Router()

router.post('/', async (req, res) => {

  try {
    const event = req.body
    yellow('event', event)

    // const postalCodeId = objectIdFromHexString(event.postalCode._id)

    // const cityState = await findById(
    //   'postalCodes',
    //   postalCodeId,
    //   { cityName: 1, stateCode: 1, _id: 0 }
    // )

    // const location = {
    //   cityName: cityState.cityName,
    //   stateCode: cityState.stateCode,
    // }



    // // yellow('postalCodeId', postalCodeId)
    // // yellow('postalData', postalData)
    // // Remove existing postCode and and merge
    // const a = omit(['postalCode_id'], event)
    // const b = merge(a, postalData.data[0])
    const inserted = await insertOne(
      'events',
      event
    )
    res.send(inserted)
  } catch (e) {
    red('error', e)
    res.status(400).send(e)
  }
})

router.get('/', async (req, res) => {
  try {
    const d = new Date()
    const yr = d.getFullYear()
    const mo = d.getMonth()
    const day = d.getDay()
    const today = new Date(yr, mo, day)
    const events = await find('events', { 'dates.startDateTime': { $gt: today.toISOString() }})
    // const events = await find('events', { })
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
