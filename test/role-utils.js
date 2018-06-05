import 'babel-polyfill'
import { yellow, blue, green, red } from '../logger/'
import { ObjectID } from 'mongodb'
import Role from '../models/role'

export const fillRole = (model, data) => {
  let m = model
  const d = data
  m.name = d.name
  return m
}

const makeRoles = (num) => {
  let roles = []
  for (let i=0; i<num; i++) {
    let name = `role-${i}`
    let role = {
      _id: new ObjectID(),
      name,
    }
    roles.push(role)
  }
  // blue('1) roles.length', roles.length)
  return roles
}

export const insertRoles = async (num, options = {}) => {
  try {
    const roles = await makeRoles(num)
    let res = await Role.insertMany(roles)
    if (options.idsOnly) {
      const ids = res.map((m) => m._id)
      return ids
    } else {
      return res
    }
  }
  catch (e) {
    console.log('ERROR inserting roles', e)
  }
}

export const getRoles = async (num) => {
  try {
    return makeRoles(num)

  }
  catch (e) {
    console.log('ERROR inserting roles', e)
  }
}

export const clearRoles = async () => {
  try {
    const a = await Role.remove({})
  }
  catch (e) {
    red('ERROR: beforeEach: ', e)
  }
}

export default { fillRole, insertRole, getRole, clearRole }
