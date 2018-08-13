import express from 'express'
import { yellow } from '../logger'
import { find } from '../db'

const router = express.Router()

router.get('/', async (req, res) => {
  // yellow('search term', req.query.searchTerm)
  const searchTerm = req.query.searchTerm.substr(1).slice(0, -1)
  // const pattern = '.*' + searchTerm.substr(1).slice(0, -1) + '.*'
  try {
    // Example of regular expression Search
    // let events = await Event.find({ 'title': { '$regex': pattern, '$options': 'i' } })
    let events = await find('events',
      { $text: { $search: searchTerm, $caseSensitive: false } })
    res.send(events)
  } catch (e) {
    res.status(400).send(e)
  }
})

export default router
