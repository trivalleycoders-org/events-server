import passport from 'passport'

import { setPassword, generateJWT } from '../utils'
import { red } from '../logger/'
import { findById, findOneAndUpdate, insertOne } from '../db/dbFunctions'

const router = require('express').Router()

const auth = require('./auth')

const toAuthJSON = function (user) {
  return {
    data: {
      user: {
        id: user.id,
        email: user.email,
        token: generateJWT(user.id, user.email)
      }
    }
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

// Update User
router.put('/user', auth.required, async (req, res, next) => {

  try {
    const user = await findById('users', req.payload.id)
    if (!user) { return res.sendStatus(401) }

    const u = user.data[0]
    u.id = user.data[0]._id
    if (typeof req.body.password !== 'undefined') {
      const { hash, salt } = setPassword(req.body.password)
      u.hash = hash
      u.salt = salt
    }
    const updUser = await findOneAndUpdate('users', u.id, u)

    /* setting cookie */
    const token = generateJWT(u.id, u.email)
    console.log('token in update: ', token)
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000')
    if (process.env.NODE_ENV === 'production') {
      res.cookie('token', token, { secure: true, maxAge: 120000, httpOnly: true })
    } else {
      /*
      httpOnly shd be set false to work on localhost.
      Otherwise cookie is not accessible using document.cookie
      in the frontend
      */
      res.cookie('token', token, { maxAge: 120000, httpOnly: false })
    }
    return res.json(toAuthJSON(updUser.data[0]))
  } catch (err) {
    return next(err)
  }
})

// Authentication
router.post('/users/login', (req, res, next) => {

  if (!req.body.email) {
    return res.status(422).json({ errors: { email: 'can\'t be blank' } })
  }

  if (!req.body.password) {
    return res.status(422).json({ errors: { password: 'can\'t be blank' } })
  }

  passport.authenticate('local', { session: false }, function (err, user, info) {
    if (err) {
      return next(err)
    }

    console.log('info in authenticate: ', info)
    if (user) {
      const u = user.data[0]
      u.id = user.data[0]._id

      /* setting cookie */
      const token = generateJWT(u.id, u.email)
      res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000')
      if (process.env.NODE_ENV === 'production') {
        res.cookie('token', token, { secure: true, maxAge: 120000, httpOnly: true })
      } else {
        /*
        httpOnly shd be set false to work on localhost.
        Otherwise cookie is not accessible using document.cookie
        in the frontend
        */
        res.cookie('token', token, { maxAge: 120000, httpOnly: false })
      }

      return res.json(toAuthJSON(u))
    } else {
      return res.status(422).json({ error: info.errors })
    }
  })(req, res, next)
})

// Registration
router.post('/users', async (req, res, next) => {
  let user = {}

  try {
    user.email = req.body.email
    const { hash, salt } = setPassword(req.body.password)
    user.hash = hash
    user.salt = salt

    const result = await insertOne('users', user)
    user.id = result.data[0]._id

    const token = generateJWT(user.id, user.email)

    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000')
    if (process.env.NODE_ENV === 'production') {
      res.cookie('token', token, { secure: true, maxAge: 120000, httpOnly: true })
    } else {
      /*
      httpOnly shd be set false to work on localhost.
      Otherwise cookie is not accessible using document.cookie
      in the frontend
      */
      res.cookie('token', token, { maxAge: 120000, httpOnly: false })
    }
    return res.json(toAuthJSON(user))
  } catch (e) {
    red('error', e)
    return res.status(400).send(e)
  }
})

module.exports = router