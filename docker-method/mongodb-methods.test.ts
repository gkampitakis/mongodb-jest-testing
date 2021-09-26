import { MongoClient, ObjectId } from 'mongodb';
import { promisify } from 'util';
import { UserService, createClient } from '../user-service';

const database = 'mongodb-testing';
const sleep = promisify(setTimeout);

// NOTE: this for removing the global mocks
jest.deepUnmock('mongodb');

function getIndexes(client: MongoClient, database: string) {
  return client.db(database).collection('users').indexes();
}

describe('UserService', () => {
  let client: MongoClient;

  beforeAll(async () => {
    client = await createClient('mongodb://localhost:27017');
  });

  afterAll(async () => {
    await client.close();
  });

  beforeEach(async () => {
    await client.db(database).collection('users').deleteMany({
      name: 'test-user'
    });
  });

  describe('constructor', () => {
    it('should create needed indexes', async () => {
      new UserService(client, database);
      // NOTE: we need the sleep as an async operation is executed in constructor
      await sleep(150);

      const indexes = await getIndexes(client, database);

      expect(indexes.length).toBe(3);
      expect(indexes[1].key).toEqual({ email: 1 });
      expect(indexes[2].key).toEqual({ occupation: 1 });
    });
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const result = await new UserService(client, database).createUser({
        age: 17,
        email: 'mock@email.com',
        name: 'test-user',
        occupation: 'engineer'
      });

      expect(result.acknowledged).toBe(true);
    });
  });

  describe('getUser', () => {
    it('should return the correct user', async () => {
      const user = await new UserService(client, database).getUser(
        'chef@email.com'
      );

      expect(user).toEqual({
        _id: expect.any(ObjectId),
        name: 'mock-chef',
        email: 'chef@email.com',
        age: 27,
        occupation: 'chef',
        timestamp: '2021-09-29T15:48:13.209Z'
      });
    });
  });

  describe('getUsersByOccupation', () => {
    it('should return all matching users', async () => {
      const users = await new UserService(
        client,
        database
      ).getUsersByOccupation('engineer');

      expect(users).toEqual([
        {
          _id: expect.any(ObjectId),
          name: 'mock-engineer',
          email: 'engineer@email.com',
          age: 17,
          occupation: 'engineer',
          timestamp: '2021-09-26T15:48:13.209Z'
        },
        {
          _id: expect.any(ObjectId),
          name: 'mock-engineer-2',
          email: 'engineer-2@email.com',
          age: 36,
          occupation: 'engineer',
          timestamp: '2021-09-26T15:48:13.209Z'
        }
      ]);
    });
  });

  describe('updateUser', () => {
    it('should update the matched user', async () => {
      const service = new UserService(client, database);
      await service.createUser({
        age: 17,
        email: 'mock@email.com',
        name: 'test-user',
        occupation: 'engineer'
      });

      const { acknowledged, modifiedCount } = await service.updateUser(
        'mock@email.com',
        {
          age: 19
        }
      );

      expect(acknowledged).toBe(true);
      expect(modifiedCount).toBe(1);
    });
  });

  describe('deleteUser', () => {
    it('should delete the matched user', async () => {
      const service = new UserService(client, database);
      await service.createUser({
        age: 17,
        email: 'mock@email.com',
        name: 'test-user',
        occupation: 'engineer'
      });

      const { acknowledged, deletedCount } = await service.deleteUser(
        'mock@email.com'
      );

      expect(acknowledged).toBe(true);
      expect(deletedCount).toBe(1);
    });
  });
});
