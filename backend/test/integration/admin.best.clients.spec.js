/*global  describe, it, expect */
const request = require('supertest');
const app = require('../../src/app');
const { client1 } = require('./data');

// returns the clients the paid the most for jobs in the query time period. limit query parameter should be 
describe('/admin/best-clients?start=<date>&end=<date>&limit=<integer> suite', () => {

  it('end date must be greater than start date', async() => {
    const d = new Date();
    const response = await request(app)
      .get(`/admin/best-clients?start=${d}&end=${d}`)
      .set({ 'profile_id': client1.id, Accept: 'application/json' });
    expect(response.statusCode).toBe(401);
    expect(response.body.error).toBe('please provide a valid date range');
  });

    
  it('check default limit - must return 2 clients if not limit is provided', async() => {
    const start = '2020-08-13T00:00:00';
    const end = '2020-08-18T00:00:00';
    const response = await request(app)
      .get(`/admin/best-clients?start=${start}&end=${end}`)
      .set({ 'profile_id': client1.id, Accept: 'application/json' });
    expect(response.statusCode).toBe(200);
    expect(response.body.data.length).toBe(2);
  });

  it('querying from 2020-08-13 up to 2020-08-18 must return 3 clients when setting limit as 3 ', async() => {
    const start = '2020-08-13T00:00:00';
    const end = '2020-08-18T00:00:00';
    const limit = 3;
    const response = await request(app)
      .get(`/admin/best-clients?start=${start}&end=${end}&limit=${limit}`)
      .set({ 'profile_id': client1.id, Accept: 'application/json' });
    expect(response.statusCode).toBe(200);
    expect(response.body.data.length).toBe(3);
  });

  it('Mr Robot is the best client from 2020-08-13 up to 2020-08-18', async() => {
    const start = '2020-08-13T00:00:00';
    const end = '2020-08-18T00:00:00';
    const response = await request(app)
      .get(`/admin/best-clients?start=${start}&end=${end}`)
      .set({ 'profile_id': client1.id, Accept: 'application/json' });
    expect(response.statusCode).toBe(200);
    expect(response.body.data.length).toBe(2);
    expect(response.body.data[0].firstName).toBe('Mr');
    expect(response.body.data[0].lastName).toBe('Robot');
  });
});
