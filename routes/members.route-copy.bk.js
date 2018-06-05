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
    const members = req.body
    // yellow('post: body', req.body)

    // let  = []
    // blue('members.length', members.length)
    // if (Array.isArray(members)) {
    //   append(members, membersToAdd)
    // } else {
    //   append(members, membersToAdd)
    // }
    yellow('membersToAdd-pre', membersToAdd)
    yellow('post: members', members)
    const membersToAdd = append(members, [])
    yellow('membersToAdd-post', membersToAdd)

    const membersAdded = await Promise.all(membersToAdd.map(async (m) => {
      // blue('m', m)
      let nm = new Member()
      yellow('phones?', m.phones && 'yes')
      nm.firstName = m.firstName
      nm.lastName = m.lastName
      nm.email = m.email
      nm.comments = m.comments
      m.phones && nm.phones.push(...m.phone)
      m.roles && nm.roles.push(...m.roles)
      nm.exempt = m.exempt
      // blue('nm', nm)
      yellow('nm', nm)
      let doc = await nm.save()
      // blue('doc', doc)
      return nm
    }))

    // blue('BEFORE SEND: membersAdded.length', membersAdded)
    res.send(membersAdded)
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
