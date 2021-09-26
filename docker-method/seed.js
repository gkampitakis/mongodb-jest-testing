db = db.getSiblingDB('mongodb-testing');

db.createCollection('users');

db.users.insertMany([
  {
    name: 'mock-engineer',
    email: 'engineer@email.com',
    age: 17,
    occupation: 'engineer',
    timestamp: '2021-09-26T15:48:13.209Z'
  },
  {
    name: 'mock-chef',
    email: 'chef@email.com',
    age: 27,
    occupation: 'chef',
    timestamp: '2021-09-29T15:48:13.209Z'
  },
  {
    name: 'mock-engineer-2',
    email: 'engineer-2@email.com',
    age: 36,
    occupation: 'engineer',
    timestamp: '2021-09-26T15:48:13.209Z'
  },
  {
    name: 'mock-actress',
    email: 'actress@email.com',
    age: 19,
    occupation: 'actress',
    timestamp: '2021-09-26T15:48:13.209Z'
  }
]);
