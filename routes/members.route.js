import express from 'express'
const router = express.Router()
import Member from '../models/member'
import { isValidObjectID } from '../db/utils'
import { append } from 'ramda'
import { red, blue, yellow } from '../logger'

router.get('/', async (req, res) => {
  try {
    let members = await Member.find()
    res.send({members})
  } catch (e) {
    res.status(400).send(e)
  }
})

router.get('/:id', async (req, res) => {
  const id = req.params.id
  if (!isValidObjectID(id)) {
    return res.status(404).send()
  }
  try {
    let member = await Member.findById(id)
    if (!member) {
      return res.status(404).send()
    }
    res.send(member)
  } catch (e) {
    res.status(400).send(e)
  }
})

router.post('/', async (req, res) => {
  try {
    const member = req.body
    yellow('post: member', member)
    let nm = new Member(member)
    const memberAdded = await nm.save()
    yellow('memberAdded', memberAdded)
    res.send(memberAdded)
  } catch (e) {
    // red('members.route: post', e)
    red('error', e)
    res.status(400).send(e)
  }
})

router.delete('/:id', async (req, res) => {
  const id = req.params.id
  if (!isValidObjectID(id)) {
    return res.status(404).send()
  }
  try {
    let member = await Member.findByIdAndRemove(id)
    if (!member) {
      return res.status(404).send()
    }
    res.send({member})
  } catch (e) {
    res.status(400).send()
  }
})

router.patch('/:id', async (req, res) => {

  try {
    const id = req.params.id
    yellow('patch: id', id)
    if (!isValidObjectID(id)) {
      return res.status(404).send()
    }
    const memberSent = req.body.member
    yellow('patch: body', req.body)
    const memberToReturn = await Member.findByIdAndUpdate(id, { $set: memberSent }, { new: true })
    yellow('patch: returned member', memberToReturn)
    if (!memberToReturn) {
      return res.status(404).send()
    }
    res.send(memberToReturn)
  } catch (e) {
    res.status(400).send()
  }

})


export default router
