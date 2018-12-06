import express from 'express'
import { find } from '../db'
import { yellow } from '../logger'

const router = express.Router()

router.get('/', async (req, res) => {
  console.log('searchTerm= ', req.query.searchTerm)
  const searchTerm = req.query.searchTerm.substr(1).slice(0, -1)
  let events=undefined

  try {
    if (req.query.searchTerm.trim() === '""') {
      console.log('in empty search')
      events = await find('events',
      {
        'dates.endDateTime': { $gt: new Date().toISOString() }
      })
    } else {
      console.log('in not empty search')
      events = await find('events',
      {
        $text: { $search: searchTerm, $caseSensitive: false },
        'dates.endDateTime': { $gt: new Date().toISOString() }
      })
    }
    console.log('events after search: ', events)
    res.send(events)
  } catch (e) {
    console.log('error while searching: ', e)
    res.status(400).send(e)
  }
  
})

// let events = await Event.find(
//   { $text: { $search: searchTerm } },
//   { score: { $meta: 'textScore' } }
// ).sort({ score: { $meta: 'textScore' } })
export default router
