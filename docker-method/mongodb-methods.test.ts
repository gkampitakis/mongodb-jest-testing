import { MongoClient, ObjectId } from 'mongodb';
import { UserService, createClient, createUserIndexes } from '../user-service';

// NOTE: this for removing the global mocks
jest.deepUnmock('mongodb');

describe('UserService', () => {
  const database = 'mongodb-testing';
  let client: MongoClient;
  let userService: UserService;

  beforeAll(async () => {
    client = await createClient('mongodb://localhost:27017');
    userService = new UserService(client, database);
  });

  afterAll(async () => {
    await client.close();
  });

  beforeEach(async () => {
    await client.db(database).collection('users').deleteMany({
      name: 'test-user'
    });
  });

  describe('createUserIndexes', () => {
    it('should create needed indexes', async () => {
      const indexes = await createUserIndexes(client, database);

      expect(indexes).toEqual(['email_1', 'occupation_1']);
    });
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const result = await userService.createUser({
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
      const user = await userService.getUser('chef@email.com');

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
      const users = await userService.getUsersByOccupation('engineer');

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
      await userService.createUser({
        age: 17,
        email: 'mock@email.com',
        name: 'test-user',
        occupation: 'engineer'
      });

      const { acknowledged, modifiedCount } = await userService.updateUser(
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
      await userService.createUser({
        age: 17,
        email: 'mock@email.com',
        name: 'test-user',
        occupation: 'engineer'
      });

      const { acknowledged, deletedCount } = await userService.deleteUser(
        'mock@email.com'
      );

      expect(acknowledged).toBe(true);
      expect(deletedCount).toBe(1);
    });
  });
});
