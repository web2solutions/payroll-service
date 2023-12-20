/*global  describe, it, expect */
const request = require('supertest');
const app = require('../../src/app');

const { client1 } = require('./data');
const inValidUserId = 111111;



describe('/contracts suite', () => {
  it('auth must not works for invalid user', async() => {
    const response = await request(app)
      .get('/contracts')
      .set({ 'profile_id': inValidUserId, Accept: 'application/json' });
    expect(response.statusCode).toBe(401);
  });
  it('client 1 has one active contract', async() => {
    const response = await request(app)
      .get('/contracts')
      .set({ 'profile_id': client1.id, Accept: 'application/json' });
    //console.log(response.body)
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(1);
  });
});
