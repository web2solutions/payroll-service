/*global  */
const request = require('supertest');
const app = require('../src/app');



const agent = request(app);

function req () {
  return  agent.get('/jobs/3/pay').set({ 'profile_id': 2, Accept: 'application/json' });
}

async function race () {
  // await app.get('locker').client.connect();
  const r = await Promise.all([ 
    req(), req(), req(), req(), req(), req(), req(), req(), req(), req(), req(), req(), req(), req(), req(), req(), req(), req(), req(), req(), 
    req(), req(), req(), req(), req(), req(), req(), req(), req(), req(), req(), req(), req(), req(), req(), req(), req(), req(), req(), req(), 
    req(), req(), req(), req(), req(), req(), req(), req(), req(), req(), req(), req(), req(), req(), req(), req(), req(), req(), req(), req(), 
  ]);

  console.log(r.map( c => c.body));
  
  // eslint-disable-next-line no-undef
  process.exit(0);
}

race();
