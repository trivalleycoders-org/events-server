import passport from 'passport'

import { validPassword } from '../utils'
import { find } from '../db/dbFunctions'

const LocalStrategy = require('passport-local').Strategy

const options = {
  usernameField: 'user[email]',
  passwordField: 'user[password]'
}

const verify = async (username, password, done) => {
  const user = await find('users', { email: username })
  if (!user || !validPassword(password, user.data[0])) {
    return done(null, false, { errors: { 'email or password': 'is invalid' } })
  }
  return done(null, user)
}

passport.use('local', new LocalStrategy(options, verify))
