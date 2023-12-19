const request = require('supertest');
const app = require("../src/app");

const validUserId = 1;
const inValidUserId = 111111;

const validContractId = 9;

describe('/contracts/:id suite', () => {
    it('auth must works for valid user', async() => {
        const response = await request(app)
            .get(`/contracts/${validContractId}`)
            .set({ 'profile_id': validUserId, Accept: 'application/json' });
        expect(response.statusCode).toBe(200);
    });
    it('auth must not works for invalid user', async() => {
        const response = await request(app)
            .get(`/contracts/${validContractId}`)
            .set({ 'profile_id': inValidUserId, Accept: 'application/json' });
        expect(response.statusCode).toBe(401);
    });

    it('auth must not works for invalid user', async() => {
        const response = await request(app)
            .get(`/contracts/${validContractId}`)
            .set({ 'profile_id': validUserId, Accept: 'application/json' });
        
        const contract = response.body;
        console.log(contract)
        expect(response.statusCode).toBe(200);
    });
    
});