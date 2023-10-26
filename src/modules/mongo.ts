import { MongoClient } from 'mongodb';

import config from '../config';

class MongoProvider {
  private client: MongoClient;

  constructor() {
    this.client = new MongoClient(config.mongoUri);
  }

  async connect() {
    await this.client.connect();
  }

  async disconnect() {
    await this.client.close();
  }

  get db() {
    return this.client.db('expenses');
  }
}

export default new MongoProvider();
