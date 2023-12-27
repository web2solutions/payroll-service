
const redis = require('redis');
class LockerService {
  
  constructor() {
    this.client = redis.createClient({
      host: '127.0.0.1',
      port: 6379,
      database: '3',
      password: 'eYVX7EwVmmxKPCDmwMtyKVge8oLd2t81',
    });
    this.client.on('error', (err) => console.log('Redis Client Error', err));
    // this.client.on('connect', () => console.log('Redis connected'));
    // this.client.on('ready', () => console.log('Redis ready'));
    this.prefix = 'locker__';
    this.connected = false;
  }

  async lock(resourceName, uuid) {
    try {
      const wasAlreadyLocked = await this.isLocked(resourceName, uuid);
      if (wasAlreadyLocked) return { wasAlreadyLocked };
      if(!this.connected) {
        await this.client.connect();
        this.connected = true;
      }
      await this.client.set(`${this.prefix}:${resourceName}:${uuid}`, 'locked');
      return { locked: true };
    } catch (error) {
      // console.log(error);
      return { error };
    }
  }

  async isLocked(resourceName, uuid) {
    try {
      if(!this.connected) {
        await this.client.connect();
        this.connected = true;
      }
      const value = await this.client.get(`${this.prefix}:${resourceName}:${uuid}`);
      return !!value;
    } catch (error) {
      // console.log(error);
      return { error };
    }
  }

  async unlock(resourceName, uuid) {
    try {
      if(!this.connected) {
        await this.client.connect();
        this.connected = true;
      }
      const value = await this.client.del(`${this.prefix}:${resourceName}:${uuid}`);
      return value;
    } catch (error) {
      // console.log(error);
      return { error };
    }
  }

  async quit() {
    try {
      await this.client.quit();
      this.connected = false;
    } catch (error) {
      // console.log(error);
      return { error };
    }
  }
}

const locker = new LockerService();

module.exports = locker;
