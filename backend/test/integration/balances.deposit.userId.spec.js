/*global  describe, it, expect */
const request = require('supertest');
const app = require('../../src/app');

const {
  client1,
  client2,

} = require('./data');

const inValidUserId = 111111;


// Deposits money into the the the balance of a client, a client can't deposit more than 25% his total of jobs to pay. (at the deposit moment)
describe('/balances/deposit/:userId suite', () => {
  it('auth must not works for invalid user', async () => {
    const response = await request(app)
      .post(`/balances/deposit/${client1.id}`)
      .send({
        deposit: 50
      })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set({
        'profile_id': inValidUserId
      });
    expect(response.statusCode).toBe(401);
    // /balances/deposit/:userId
  });
  it('can not do invalid deposit', async () => {
    const response = await request(app)
      .post(`/balances/deposit/${client1.id}`)
      .send({
        depositWrong: 60
      })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set({
        'profile_id': client1.id
      });
    expect(response.statusCode).toBe(401);
  });
  it('can not do deposit more than 25%', async () => {
    const response = await request(app)
      .post(`/balances/deposit/${client1.id}`)
      .send({
        deposit: 60
      })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set({
        'profile_id': client1.id
      });
    expect(response.statusCode).toBe(401);
  });
  it('do deposit', async () => {
    const response = await request(app)
      .post(`/balances/deposit/${client2.id}`)
      .send({
        deposit: 10
      })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set({
        'profile_id': client2.id
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.data.balance).toBe(client2.balance + 10);
  });


});
