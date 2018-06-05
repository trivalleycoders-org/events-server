import express from 'express'
const router = express.Router()
import Role from '../models/role'
import { isValidObjectID } from '../db/utils'
import { red, blue } from '../logger'

router.get('/', async (req, res) => {
  try {
    let roles = await Role.find()
    res.send({roles})
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
    let role = await Role.findById(id)
    if (!role) {
      return res.status(404).send()
    }
    res.send(role)
  } catch (e) {
    res.status(400).send(e)
  }
})

router.post('/', async (req, res) => {
  try {
    const b = req.body
    const r = await new Role()
    r.name = b.name
    let doc = await r.save()
    res.send(doc)
  } catch (e) {
    res.status(400).send(e)
  }
})

router.delete('/:id', async (req, res) => {
  const id = req.params.id
  if (!isValidObjectID(id)) {
    return res.status(404).send()
  }
  try {
    let role = await Role.findByIdAndRemove(id)
    if (!role) {
      return res.status(404).send()
    }
    res.send({role})
  } catch (e) {
    res.status(400).send()
  }
})

router.patch('/:id', async (req, res) => {
  try {
    const id = req.params.id
    const body = req.body
    blue('body', body)

    if (!isValidObjectID(id)) {
      return res.status(404).send()
    }
    const role = await Role.findByIdAndUpdate(id, { $set: body }, { new: true })
    if (!role) {
      return res.status(404).send()
    }
    res.send(role)
  } catch (e) {
    res.status(400).send()
  }

})

export default router
