export const oneNewEventIn = {
  'category' : 'startup',
  'endDateTime' : '2018-06-12T17:00:00.000Z',
  'imageUrl' : 'https://s3-us-west-2.amazonaws.com/photo-app-tvc/briia.jpg',
  'linkToUrl' : 'http://briia.io',
  'organization' : 'BRIIA',
  'postalCode' : {
    _id: '5b5f6f52222be42bb919c008',
    'postalCode' : '94582',
  },
  'price' : 75,
  'startDateTime' : '2018-06-12T16:00:00.000Z',
  'tags' : [
    'health'
  ],
  'title' : 'BRIIA Investor Demo Day',
  'venueName' : 'Dublin Concert Hall',
}


export const oneNewEventOut = {
  // don't include the _id. It will never match
  category: 'startup',
  cityName: 'San Ramon',
  endDateTime: '2018-06-12T17:00:00.000Z',
  imageUrl: 'https://s3-us-west-2.amazonaws.com/photo-app-tvc/briia.jpg',
  linkToUrl: 'http://briia.io',
  organization: 'BRIIA',
  postalCode: '94582',
  price: 75,
  startDateTime: '2018-06-12T16:00:00.000Z',
  stateCode: 'CA',
  tags: [ 'health' ],
  title: 'BRIIA Investor Demo Day',
  venueName: 'Dublin Concert Hall',
}
