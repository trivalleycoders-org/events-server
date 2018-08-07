import express from 'express'
import Event from '../models/event'
import { red, yellow } from '../logger'

const router = express.Router()

router.get('/', async (req, res) => {
  // yellow('search term', req.query.searchTerm)
  const searchTerm = req.query.searchTerm
  // const pattern = '.*' + searchTerm.substr(1).slice(0, -1) + '.*'
  try {
    // Example of regular expression Search
    // let events = await Event.find({ 'title': { '$regex': pattern, '$options': 'i' } })
    let events = await Event.find(
      { $text: { $search: searchTerm.substr(1).slice(0, -1) } },
      { score: { $meta: 'textScore' } }
    ).sort({ score: { $meta: 'textScore' } })
    res.send({ events })
  } catch (e) {
    res.status(400).send(e)
  }
})

export default router
