/*global  describe, it, expect */
const request = require('supertest');
const app = require('../../src/app');
const { client1, client2 } = require('./data');

// Returns the profession that earned the most money (sum of jobs paid) for any contactor that worked in the query time range.
describe('/admin/best-profession?start=<date>&end=<date> suite', () => {
  it('programmer is the best profession with no date range', async() => {
    const response = await request(app)
      .get('/admin/best-profession')
      .set({ 'profile_id': client1.id, Accept: 'application/json' });
    expect(response.statusCode).toBe(200);
    expect(response.body.data).toBe('Programmer');
  });

  it('end date must be greater than start date', async() => {
    const d = new Date();
    const response = await request(app)
      .get(`/admin/best-profession?start=${d}&end=${d}`)
      .set({ 'profile_id': client1.id, Accept: 'application/json' });
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe('please provide a valid date range');
  });


  it('should not have found jobs between 2023-08-14 and 2023-08-15', async() => {
    const start = '2023-08-14T00:00:00';
    const end = '2023-08-18T00:00:00';
    const response = await request(app)
      .get(`/admin/best-profession?start=${start}&end=${end}`)
      .set({ 'profile_id': client2.id, Accept: 'application/json' });
    console.log(response.body);
    expect(response.statusCode).toBe(404);
    expect(response.body.error).toBe('There is no jobs in the given date range');
  });


  it('should not have found jobs between 2023-08-14 and 2023-08-15', async() => {
    const start = '2023-08-14T00:00:00';
    const end = '2023-08-18T00:00:00';
    const response = await request(app)
      .get(`/admin/best-profession?start=${start}&end=${end}`)
      .set({ 'profile_id': client2.id, Accept: 'application/json' });
    console.log(response.body);
    expect(response.statusCode).toBe(404);
    expect(response.body.error).toBe('There is no jobs in the given date range');
  });

    
  fit('programmer is the best profession between 2020-08-14 and 2020-08-15', async() => {
    const start = '2020-08-14T00:00:00';
    const end = '2020-08-18T00:00:00';
    const response = await request(app)
      .get(`/admin/best-profession?start=${start}&end=${end}`)
      .set({ 'profile_id': client2.id, Accept: 'application/json' });
    console.log(response.body);
    expect(response.statusCode).toBe(200);
    expect(response.body.data).toBe('Programmer');
  });
});
