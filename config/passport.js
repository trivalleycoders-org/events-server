import passport from 'passport'
const crypto = require('crypto')

import { find } from '../db/dbFunctions'

const LocalStrategy = require('passport-local').Strategy

const options = {
  usernameField: 'email',
  passwordField: 'password'
}

const validPassword = (password, user) => {
  const hash = crypto.pbkdf2Sync(password, user.salt, 10000, 512, 'sha512').toString('hex')
  return hash === user.hash
}

const verify = async (username, password, done) => {
  const user = await find('users', { email: username })
  if (!user || !validPassword(password, user.data[0])) {
    return done(null, false, { errors: { 'email or password': 'is invalid' } })
  }
  return done(null, user)
}

passport.use('local', new LocalStrategy(options, verify))
