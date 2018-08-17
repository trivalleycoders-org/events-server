import passport from 'passport'
const crypto = require('crypto')
const jwt = require('jsonwebtoken')

import { red } from '../logger/'
import { insertOne } from '../db/dbFunctions'

const router = require('express').Router()
const secret = require('../config').secret

let auth = require('./auth')


const setPassword = (password) => {
  const salt = crypto.randomBytes(16).toString('hex')
  const hash = crypto.pbkdf2Sync(password, salt, 10000, 512, 'sha512').toString('hex')
  return { hash, salt }
}

const generateJWT = (id, email) => {
  const today = new Date()
  let exp = new Date(today)
  exp.setDate(today.getDate() + 60)

  return jwt.sign({
    id,
    email,
    exp: parseInt(exp.getTime() / 1000),
  }, secret)
}

// router.get('/user', auth.required, function (req, res, next) {
//   User.findById(req.payload.id).then(function (user) {
//     if (!user) { return res.sendStatus(401) }

//     return res.json({ user: user.toAuthJSON() })
//   }).catch(next)
// })

// router.put('/user', auth.required, function (req, res, next) {
//   User.findById(req.payload.id).then(function (user) {
//     if (!user) { return res.sendStatus(401) }

//     // only update fields that were actually passed...
//     if (typeof req.body.user.username !== 'undefined') {
//       user.username = req.body.user.username
//     }
//     if (typeof req.body.user.email !== 'undefined') {
//       user.email = req.body.user.email
//     }
//     if (typeof req.body.user.bio !== 'undefined') {
//       user.bio = req.body.user.bio
//     }
//     if (typeof req.body.user.image !== 'undefined') {
//       user.image = req.body.user.image
//     }
//     if (typeof req.body.user.password !== 'undefined') {
//       user.setPassword(req.body.user.password)
//     }

//     return user.save().then(function () {
//       return res.json({ user: user.toAuthJSON() })
//     })
//   }).catch(next)
// })

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

    if (user) {
      const id = user.data[0]._id
      const token = generateJWT(id, req.body.email)
      return res.json({ email: req.body.email, token })
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
    res.send({ email: user.email, token: generateJWT(result.data._id, user.email) })
  } catch (e) {
    red('error', e)
    res.status(400).send(e)
  }
})

module.exports = router