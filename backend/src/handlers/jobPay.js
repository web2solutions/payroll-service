const { sequelize } = require('../model');

const jobPayHandler = async (req, res) => {
  const { job_id } = req.params;
  const { Profile, Job, Contract } = req.app.get('models');
  const locker = req.app.get('locker');
  let lockedClient = undefined;
  let lockedContractor = undefined;
  let lockedContract = undefined;

  try {
    const { client, contractor, error } = await sequelize.transaction(async (t) => {

      const lockClient = await locker.lock('client', req.profile.id);
      if (lockClient.wasAlreadyLocked) return { error: new Error('client locked') };
      lockedClient = req.profile.id;

      const lockJob = await locker.lock('job', job_id);
      if (lockJob.wasAlreadyLocked) return { error: new Error('job locked') };

      const job = await Job.findOne({
        where: { id: job_id }
      }, { transaction: t });
      if (!job) return { error: new Error('job not found') };
      if (job.paid) return { error: new Error('job is already paid') };
      
      const lockContract = await locker.lock('contract', job.ContractId);
      if (lockContract.wasAlreadyLocked) return { error: new Error('contract locked') };
      lockedContract = job.ContractId;

      const contract = await Contract.findOne({
        where: { id: job.ContractId, ClientId: req.profile.id }
      }, { transaction: t });
      if (!contract) return { error: new Error('contract not found') };
      if (contract.status !== 'in_progress') return { error: new Error('can not pay for a inactive contract') };
    
      const lockContractor = await locker.lock('contractor', contract.ContractorId);
      if (lockContractor.wasAlreadyLocked) return { error: new Error('contractor locked') };
      lockedContractor = contract.ContractorId;
      
      const client = await Profile.findOne({
        where: { id: +req.profile.id }
      }, { transaction: t });
      if (!client) return { error: new Error('client not found') };
      if (client.balance < job.price) return { error: new Error('insufficient funds') };
      
      const contractor = await Profile.findOne({
        where: { id: +contract.ContractorId }
      }, { transaction: t });
      if (!contractor) return { error: new Error('contractor not found') };

      const clientDeductedBalance = client.balance - job.price;
      const contractorIncreasedBalance = contractor.balance + job.price;

      await client.update({
        balance: clientDeductedBalance
      }, {
        transaction: t
      });
      
      await contractor.update({
        balance: contractorIncreasedBalance
      }, {
        transaction: t
      });
      
      await job.update({
        paid: true, paymentDate: (new Date())
      }, {
        transaction: t
      });

      await locker.unlock('job', job_id);
      await locker.unlock('client', req.profile.id);
      await locker.unlock('contract', job.ContractId);
      await locker.unlock('contractor',  contract.ContractorId);

      return { client, contractor };
    });
    
    if(error) throw error;
    
    return res.json({
      data: {
        status: 'paid',
        client,
        contractor,
      }
    });
  } catch (error) {
    // console.log(error);
    (async () => {
      await locker.unlock('client', lockedClient);
      await locker.unlock('job', job_id);
      await locker.unlock('contract', lockedContract);
      await locker.unlock('contractor', lockedContractor);
      const statusCode = httpStatusCodeBasedOnMessage(error.message);
      return res.status(statusCode).json({ error: error.message });
    })();    
  } 
};

function httpStatusCodeBasedOnMessage(message) {
  let statusCode = 500;
  if(message == 'job not found') statusCode = 404;
  if(message == 'can not pay for a inactive contract') statusCode = 404;
  if(message == 'job is already paid') statusCode = 400;
  if(message == 'insufficient funds') statusCode = 400;
  return statusCode;
}

module.exports = jobPayHandler;
