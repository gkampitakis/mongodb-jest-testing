import { UserService, createClient } from '../user-service';
import { MongodbSpies, mockClient, insertOneSpy } from './__mocks__/mongodb';

jest.mock('mongodb');

describe('User', () => {
  const {
    constructorSpy,
    collectionSpy,
    createIndexSpy,
    databaseSpy,
    deleteOneSpy,
    findSpy,
    findOneSpy,
    insertOneSpy,
    updateOneSpy
  }: MongodbSpies = jest.requireMock('mongodb');

  beforeEach(() => {
    constructorSpy.mockClear();
    collectionSpy.mockClear();
    createIndexSpy.mockClear();
    databaseSpy.mockClear();
    deleteOneSpy.mockClear();
    findSpy.mockClear();
    findOneSpy.mockClear();
    insertOneSpy.mockClear();
    updateOneSpy.mockClear();
  });

  describe('createClient', () => {
    it('should connect and return a client', async () => {
      const url = 'mongodb://localhost:27017';
      const options = { keepAlive: true };
      const client = await createClient(url, options);

      expect(client).toBe('mock-client');
      expect(constructorSpy).toHaveBeenCalledWith(url, options);
    });
  });

  describe('User', () => {
    describe('constructor', () => {
      it('should reference \'users\' collection', async () => {
        new UserService(mockClient, 'mock-database');

        expect(collectionSpy).toHaveBeenCalledWith('users');
        expect(databaseSpy).toHaveBeenCalledWith('mock-database');
      });

      it('should create needed indexes', async () => {
        new UserService(mockClient, 'mock-database');

        expect(createIndexSpy).toHaveBeenCalledWith('user', { email: 1 }, { unique: true });
        expect(createIndexSpy).toHaveBeenCalledWith('user', { occupation: 1 }, undefined);
      });
    });

    describe('createUser', () => {
      it('should call insertOne with correct params', async () => {
        const user = new UserService(mockClient, 'mock-database');

        await user.createUser({
          age: 10,
          email: 'mock@email.com',
          name: 'mock-name',
          occupation: 'engineer'
        });

        expect(insertOneSpy).toHaveBeenCalledWith({
          age: 10,
          email: 'mock@email.com',
          name: 'mock-name',
          occupation: 'engineer',
          timestamp: expect.any(String)
        });
      });
    });

    describe('getUser', () => {
      it('should call findOne with correct params', async () => {
        const user = new UserService(mockClient, 'mock-database');

        await user.getUser('mock@email.com');

        expect(findOneSpy).toHaveBeenCalledWith({
          email: 'mock@email.com'
        });
      });
    });

    describe('getUsersByOccupation', () => {
      it('should call find with correct params', async () => {
        const user = new UserService(mockClient, 'mock-database');

        await user.getUsersByOccupation('engineer');

        expect(findSpy).toHaveBeenCalledWith({
          occupation: 'engineer'
        });
      });
    });

    describe('updateUser', () => {
      it('should call updateOne with correct params', async () => {
        const user = new UserService(mockClient, 'mock-database');

        await user.updateUser('mock@email.com', {
          name: 'mock-email'
        });

        expect(updateOneSpy).toHaveBeenCalledWith({
          email: 'mock@email.com'
        },
          {
            $set: {
              name: 'mock-email'
            }
          });
      });
    });

    describe('deleteUser', () => {
      it('should call deleteOne with correct params', async () => {
        const user = new UserService(mockClient, 'mock-database');

        await user.deleteUser('mock@email.com');

        expect(deleteOneSpy).toHaveBeenCalledWith({
          email: 'mock@email.com'
        });
      });
    });
  });
});
