const {
  getProfile
} = require('./middleware/getProfile');

const contractsHandler = require('./handlers/contracts');
const contractByIdHandler = require('./handlers/contractById');
const jobsUnpaidHandler = require('./handlers/jobsUnpaid');
const balanceDepositHandler = require('./handlers/balanceDeposit');
const jobPayHandler = require('./handlers/jobPay');
const bestProfessionHandler = require('./handlers/bestProfession');

const routes = function (app) {
  app.get('/contracts/:id', getProfile, contractByIdHandler);
  app.get('/contracts', getProfile, contractsHandler);
  app.get('/jobs/unpaid', getProfile, jobsUnpaidHandler);
  app.post('/balances/deposit/:userId', getProfile, balanceDepositHandler);
  app.get('/jobs/:job_id/pay', getProfile, jobPayHandler);
  app.get('/admin/best-profession', getProfile, bestProfessionHandler);
};

module.exports = routes;
