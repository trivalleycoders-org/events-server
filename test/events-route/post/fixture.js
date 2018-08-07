// this is shape out from EventForm
export const eventToPost = {
  category: 'startup',
  cityName: 'San Ramon',
  endDateTime: '2018-06-12T17:00:00.000Z',
  imageUrl: 'https://s3-us-west-2.amazonaws.com/photo-app-tvc/briia.jpg',
  linkToUrl: 'http://briia.io',
  organization: 'BRIIA',
  postalCode_id: '5b5f6f52222be42bb919c008',
  price: 75,
  stateCode: 'CA',
  startDateTime: '2018-06-12T16:00:00.000Z',
  tags: [ 'health' ],
  title: 'BRIIA Investor Demo Day',
  venueName: 'Dublin Concert Hall',
}

// This is how the post route will put it in the database
export const eventAfter = {
  // _id: '5b673573d63a2d4c54bb7351',
  category: 'startup',
  cityName: 'San Ramon',
  endDateTime: '2018-06-12T17:00:00.000Z',
  imageUrl: 'https://s3-us-west-2.amazonaws.com/photo-app-tvc/briia.jpg',
  linkToUrl: 'http://briia.io',
  organization: 'BRIIA',
  postalCode: '94582',
  price: 75,
  stateCode: 'CA',
  startDateTime: '2018-06-12T16:00:00.000Z',
  tags: [ 'health' ],
  title: 'BRIIA Investor Demo Day',
  venueName: 'Dublin Concert Hall',
}