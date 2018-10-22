import express from 'express'
import { find } from '../db'
import { yellow } from '../logger'

const router = express.Router()

router.get('/', async (req, res) => {
  const searchTerm = req.query.searchTerm.substr(1).slice(0, -1)
  try {
    let events = await find('events',
      { $text: { $search: searchTerm, $caseSensitive: false } })
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
