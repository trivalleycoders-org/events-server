import express from 'express'
const router = express.Router()
import Tag from '../models/tag'
import { isValidObjectID } from '../db/utils'
import { append } from 'ramda'
import { red, blue, yellow } from '../logger'

router.delete('/:id', async (req, res) => {
  const id = req.params.id
  if (!isValidObjectID(id)) {
    return res.status(404).send()
  }
  try {
    let tag = await Tag.findByIdAndRemove(id)
    if (!tag) {
      return res.status(404).send()
    }
    res.send({tag})
  } catch (e) {
    res.status(400).send()
  }
})

router.post('/', async (req, res) => {
  try {
    const tag = req.body
    // yellow('post: tag', tag)
    let nt = new Tag(tag)
    const tagAdded = await nt.save()
    // yellow('tagAdded', tagAdded)
    res.send(tagAdded)
  } catch (e) {
    // red('events.route: post', e)
    red('error', e)
    res.status(400).send(e)
  }
})

// router.get('/', async (req, res) => {
//   try {
//     let events = await Event.find()
//     res.send({events})
//   } catch (e) {
//     res.status(400).send(e)
//   }
// })

// router.get('/:id', async (req, res) => {
//   const id = req.params.id
//   if (!isValidObjectID(id)) {
//     return res.status(404).send()
//   }
//   try {
//     let event = await Event.findById(id)
//     if (!event) {
//       return res.status(404).send()
//     }
//     res.send(event)
//   } catch (e) {
//     res.status(400).send(e)
//   }
// })

// router.patch('/:id', async (req, res) => {
//
//   try {
//     const id = req.params.id
//     yellow('patch: id', id)
//     if (!isValidObjectID(id)) {
//       return res.status(404).send()
//     }
//     const eventSent = req.body.event
//     yellow('patch: body', req.body)
//     const eventToReturn = await Event.findByIdAndUpdate(id, { $set: eventSent }, { new: true })
//     yellow('patch: returned event', eventToReturn)
//     if (!eventToReturn) {
//       return res.status(404).send()
//     }
//     res.send(eventToReturn)
//   } catch (e) {
//     res.status(400).send()
//   }
//
// })


export default router
