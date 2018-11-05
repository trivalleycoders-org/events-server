import express from 'express'
import { yellow } from '../logger'
import { find } from '../db'

const router = express.Router()

router.get('/', async (req, res) => {
  // yellow('search term', req.query.searchTerm)
  const searchTerm = req.query.searchTerm.substr(1).slice(0, -1)
  // const pattern = '.*' + searchTerm.substr(1).slice(0, -1) + '.*'
  try {
    console.log('search substr: ', searchTerm)
    // Example of regular expression Search
    // let events = await Event.find({ 'title': { '$regex': pattern, '$options': 'i' } })
    let events = await find('events',
      {
        $text: { $search: searchTerm, $caseSensitive: false },
        'dates.endDateTime': { $gt: new Date().toISOString() }
      })
    res.send(events)
  } catch (e) {
    console.log('error while searching: ', e)
    res.status(400).send(e)
  }
  console.log('after search')
})

// let events = await Event.find(
//   { $text: { $search: searchTerm } },
//   { score: { $meta: 'textScore' } }
// ).sort({ score: { $meta: 'textScore' } })
export default router
