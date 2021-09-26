import { MongoClient, MongoClientOptions, Collection, ObjectId } from 'mongodb';

export function createClient(url: string, options?: MongoClientOptions) {
  return new MongoClient(url, options).connect();
}

export function createUserIndexes(client: MongoClient, database: string) {
  return Promise.all([
    client.db(database).createIndex('users', { email: 1 }, { unique: true }),
    client.db(database).createIndex('users', { occupation: 1 })
  ]);
}

interface UserDTO {
  _id: ObjectId;
  name: string;
  email: string;
  age: number;
  occupation: string;
  timestamp: string;
}

export class UserService {
  private collection: Collection;

  constructor(private client: MongoClient, database: string) {
    this.collection = this.client.db(database).collection('users');
  }

  createUser(user: Omit<UserDTO, 'timestamp' | '_id'>) {
    return this.collection.insertOne({
      ...user,
      timestamp: new Date().toISOString()
    });
  }

  getUser(email: string) {
    return this.collection.findOne<UserDTO>({ email });
  }

  getUsersByOccupation(occupation: string) {
    return this.collection.find<UserDTO>({ occupation }).toArray();
  }

  updateUser(
    email: string,
    payload: Partial<Omit<UserDTO, 'timestamp' | '_id'>>
  ) {
    return this.collection.updateOne({ email }, { $set: payload });
  }

  deleteUser(email: string) {
    return this.collection.deleteOne({ email });
  }
}
