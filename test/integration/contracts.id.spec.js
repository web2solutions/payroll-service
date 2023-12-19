const request = require('supertest');
const app = require("../../src/app");

const { client1, contractor1, contract9, contract1 } = require('./data');

const inValidUserId = 111111;



describe('/contracts/:id suite', () => {
    it('auth must works for valid user', async() => {
        const matchingContractId = 1; // client
        const response = await request(app)
            .get(`/contracts/${matchingContractId}`)
            .set({ 'profile_id': client1.id, Accept: 'application/json' });
        expect(response.statusCode).toBe(200);
    });
    it('auth must not works for invalid user', async() => {
        const response = await request(app)
            .get(`/contracts/${contract9.id}`)
            .set({ 'profile_id': inValidUserId, Accept: 'application/json' });
        expect(response.statusCode).toBe(401);
    });

    it('contract must have correct ownership - client', async() => {
        const response = await request(app)
            .get(`/contracts/${contract1.id}`)
            .set({ 'profile_id': client1.id, Accept: 'application/json' });
        
        const contract = response.body;
        expect(response.statusCode).toBe(200);
        expect(+contract.ClientId).toBe(+client1.id);
    });

    it('contract must have correct ownership - contractor', async() => {
        const response = await request(app)
            .get(`/contracts/${contract1.id}`)
            .set({ 'profile_id': contractor1.id, Accept: 'application/json' });
        
        const contract = response.body;
        expect(response.statusCode).toBe(200);
        expect(+contract.ContractorId).toBe(+contractor1.id);
    });
    
});