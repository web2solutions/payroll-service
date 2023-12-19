const request = require('supertest');
const app = require("../src/app");
const { client1 } = require('./data');

// Returns the profession that earned the most money (sum of jobs paid) for any contactor that worked in the query time range.
describe('/admin/best-profession?start=<date>&end=<date> suite', () => {
    it('programmer is the best profession with no date range', async() => {
        const response = await request(app)
            .get(`/admin/best-profession`)
            .set({ 'profile_id': client1.id, Accept: 'application/json' });
        expect(response.statusCode).toBe(200);
        expect(response.body.data).toBe('Programmer');
    });

    it('end date must be greater than start date', async() => {
        const d = new Date();
        const response = await request(app)
            .get(`/admin/best-profession?start=${d}&end=${d}`)
            .set({ 'profile_id': client1.id, Accept: 'application/json' });
        expect(response.statusCode).toBe(401);
        expect(response.body.error).toBe('please provide a valid date range');
    });

    
    it('programmer is the best profession between 2020-08-14 and 2020-08-15', async() => {
        const d = new Date();
        const start = '2020-08-14T00:00:00';
        const end = '2020-08-15T00:00:00';
        const response = await request(app)
            .get(`/admin/best-profession?start=${start}&end=${end}`)
            .set({ 'profile_id': client1.id, Accept: 'application/json' });
        expect(response.statusCode).toBe(200);
        expect(response.body.data).toBe('Programmer');
    });
});