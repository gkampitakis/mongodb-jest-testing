import { MongoClient, MongoClientOptions, Collection, ObjectId } from 'mongodb';

export function createClient(url: string, options?: MongoClientOptions) {
  return new MongoClient(url, options).connect();
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
    this.createIndex(database);
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

  private createIndex(database: string) {
    return Promise.all([
      this.client
        .db(database)
        .createIndex('users', { email: 1 }, { unique: true }),
      this.client.db(database).createIndex('users', { occupation: 1 })
    ]);
  }
}
