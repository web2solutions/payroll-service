const request = require('supertest');
const app = require("../../src/app");

const { client1, client2, contractor1, contract9, contract1 } = require('./data');
const inValidUserId = 111111;



describe('/jobs/unpaid suite', () => {
    it('auth must not works for invalid user', async() => {
        const response = await request(app)
            .get(`/jobs/unpaid`)
            .set({ 'profile_id': inValidUserId, Accept: 'application/json' });
        expect(response.statusCode).toBe(401);
    });
    it('client 2 has 2 unpaid jobs', async() => {
        const response = await request(app)
            .get(`/jobs/unpaid`)
            .set({ 'profile_id': client2.id, Accept: 'application/json' });
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(2);
    });
});