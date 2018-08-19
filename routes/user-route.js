import passport from 'passport'

import { setPassword, generateJWT } from '../utils'
import { red } from '../logger/'
import { findById, findOneAndUpdate, insertOne } from '../db/dbFunctions'

const router = require('express').Router()

let auth = require('./auth')

const toAuthJSON = function (user) {
  return {
    id: user.id,
    email: user.email,
    token: generateJWT(user.id, user.email)
  }
}

router.get('/user', auth.required, async (req, res, next) => {
  try {
    const user = await findById('users', req.payload.id)
    if (!user) { return res.sendStatus(401) }
    const u = user.data[0]
    u.id = user.data[0]._id
    return res.json(toAuthJSON(u))
  } catch (err) {
    return next(err)
  }
})

router.put('/user', auth.required, async (req, res, next) => {
  try {
    const user = await findById('users', req.payload.id)
    if (!user) { return res.sendStatus(401) }

    const u = user.data[0]
    u.id = user.data[0]._id
    if (typeof req.body.user.password !== 'undefined') {
      const { hash, salt } = setPassword(req.body.user.password)
      u.hash = hash
      u.salt = salt
    }

    const updUser = await findOneAndUpdate('users', u.id, u)
    return res.json(toAuthJSON(updUser.data[0]))
  } catch (err) {
    return next(err)
  }
})

router.post('/users/login', (req, res, next) => {
  if (!req.body.user.email) {
    return res.status(422).json({ errors: { email: 'can\'t be blank' } })
  }

  if (!req.body.user.password) {
    return res.status(422).json({ errors: { password: 'can\'t be blank' } })
  }

  passport.authenticate('local', { session: false }, function (err, user, info) {
    if (err) {
      return next(err)
    }

    if (user) {
      const u = user.data[0]
      u.id = user.data[0]._id
      return res.json(toAuthJSON(u))
    } else {
      return res.status(422).json(info)
    }
  })(req, res, next)
})

router.post('/users', async (req, res, next) => {
  let user = {}

  try {
    user.email = req.body.user.email
    const { hash, salt } = setPassword(req.body.user.password)
    user.hash = hash
    user.salt = salt

    const result = await insertOne('users', user)
    user.id = result.data[0]._id
    return res.json(toAuthJSON(user))
  } catch (e) {
    red('error', e)
    return res.status(400).send(e)
  }
})

module.exports = router