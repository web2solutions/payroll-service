/*global  describe, it, expect */
const request = require('supertest');
const app = require('../../src/app');

const { client1 , client2 } = require('./data');
const inValidUserId = 111111;


// Pay for a job, a clifent can only pay if his balance >= the amount to pay. The amount should be moved from the client's balance to the contractor balance.
describe('/jobs/:job_id/pay suite', () => {
  it('auth must not works for invalid user', async() => {
    const response = await request(app)
      .get('/jobs/0/pay')
      .set({ 'profile_id': inValidUserId, Accept: 'application/json' });
    expect(response.statusCode).toBe(401);
  });

  it('can not pay for non existing job', async() => {
    const response = await request(app)
      .get('/jobs/0/pay')
      .set({ 'profile_id': client1.id, Accept: 'application/json' });
    expect(response.statusCode).toBe(404);
    expect(response.body.error).toBe('job not found');
  });

  it('can not pay for a non active contract', async() => {

    const response = await request(app)
      .get('/jobs/1/pay')
      .set({ 'profile_id': client1.id, Accept: 'application/json' });

    expect(response.statusCode).toBe(404);
    expect(response.body.error).toBe('can not pay for a inactive contract');
  });

  it('can not pay for paid job', async() => {
    const response = await request(app)
      .get('/jobs/7/pay')
      .set({ 'profile_id': client1.id, Accept: 'application/json' });
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe('job is already paid');
  });

  it('client with insufficient funds can not pay for job', async() => {
    const unpaidResponse = await request(app)
      .get('/jobs/unpaid')
      .set({ 'profile_id': 4, Accept: 'application/json' });
    const unpaidJob = unpaidResponse.body[0];
        
    const response = await request(app)
      .get(`/jobs/${unpaidJob.id}/pay`)
      .set({ 'profile_id': 4, Accept: 'application/json' });
        
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe('insufficient funds');
  });

  it('client pay for job', async() => {
    const unpaidResponse = await request(app)
      .get('/jobs/unpaid')
      .set({ 'profile_id': client2.id, Accept: 'application/json' });
        
    const unpaidJob = unpaidResponse.body[0];
        
    let response = await request(app)
      .get(`/jobs/${unpaidJob.id}/pay`)
      .set({ 'profile_id': client2.id, Accept: 'application/json' });
        
    expect(response.statusCode).toBe(200);
    expect(response.body.data).toBe('paid');
  });
});
