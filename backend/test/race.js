/*global process  */
const request = require('supertest');
const app = require('../src/app');



const agent = request(app);

function req () {
  return  agent.get('/jobs/3/pay').set({ 'profile_id': 2, Accept: 'application/json' });
}

async function race () {
  const r = await Promise.all([ 
    req(), req(), req(), req(), req(), req(), req(), req(), req(), req(), req(), req(), req(), req(), req(), req(), req(), req(), req(), req(), 
    req(), req(), req(), req(), req(), req(), req(), req(), req(), req(), req(), req(), req(), req(), req(), req(), req(), req(), req(), req(), 
    req(), req(), req(), req(), req(), req(), req(), req(), req(), req(), req(), req(), req(), req(), req(), req(), req(), req(), req(), req(), 
  ]);

  console.log(r.map( c => c.body));
  
  process.exit(0);
}

race();
