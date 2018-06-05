import  Member from  '../models/member'
import { ObjectID } from 'mongodb'

export const twoTestMembers = [
  {
    _id: new ObjectID(),
    firstName: 'Jane',
    lastName: 'Doe',
    comments: ['comment 1', 'comment 2'],
    email: 'jane@doe.com',
    phone: {
      phoneType: 'Mobile',
      phoneNumber: '222-222-2222',
    }
  }, {
    _id: new ObjectID(),
    firstName: 'Jon',
    lastName: 'Snow',
    comments: ['comment 3', 'comment 4'],
    email: 'jon@snow.com',
    phone: {
      phoneType: 'Work',
      phoneNumber: '333-333-3333',
    }
  }
]



export const oneTestMember = [
  {
    _id: new ObjectID(),
    firstName: 'Amy',
    lastName: 'Yi',
    comments: ['comment 1', 'comment 2'],
    email: 'ame@yi.com',
    phone: {
      phoneType: 'Mobile',
      phoneNumber: '113-222-2222',
    }
  }
]


export default { twoTestMembers, oneTestMember }
