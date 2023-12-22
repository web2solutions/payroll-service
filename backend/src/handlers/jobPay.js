let lockedClients = {};
let lockedContractors = {};
let lockedJobs = {};
let lockedContracts = {};

const {
  sequelize
} = require('../model');

function lockContract(id) {
  if (!lockedContracts[`${id}`]) {
    lockedContracts[`${id}`] = true;
  }
}

function unLockContract(id) {
  if (lockedContracts[`${id}`]) {
    delete lockedContracts[`${id}`];
  }
}

function isContractLocked(id) {
  return !!lockedContracts[`${id}`];
}

// -- 


function lockClient(id) {
  if (!lockedClients[`${id}`]) {
    lockedClients[`${id}`] = true;
  }
}

function unLockClient(id) {
  if (lockedClients[`${id}`]) {
    delete lockedClients[`${id}`];
  }
}

function isClientLocked(id) {
  return !!lockedClients[`${id}`];
}

// -- 
function lockContractor(id) {
  if (!lockedContractors[`${id}`]) {
    lockedContractors[`${id}`] = true;
  }
}

function unLockContractor(id) {
  if (lockedContractors[`${id}`]) {
    delete lockedContractors[`${id}`];
  }
}

function isContractorLocked(id) {
  return !!lockedContractors[`${id}`];
}

// --

function lockJob(id) {
  if (!lockedJobs[`${id}`]) {
    lockedJobs[`${id}`] = true;
  }
}

function unLockJob(id) {
  if (lockedJobs[`${id}`]) {
    delete lockedJobs[`${id}`];
  }
}

function isJobLocked(id) {
  return !!lockedJobs[`${id}`];
}

const jobPayHandler = async (req, res) => {
  const { job_id } = req.params;
  const { Profile, Job, Contract } = req.app.get('models');

  let managedClient = undefined;
  let managedContractor = undefined;

  try {
    const { client, contractor, error } = await sequelize.transaction(async (t) => {

      if (isJobLocked(job_id)) return { error: new Error('job locked') };
      
      lockJob(job_id);
      

      const job = await Job.findOne({
        where: { id: job_id }
      }, {
        transaction: t
      });

      lockContract(job.ContractId)

      if (!job) return { error: new Error('job not found') };
      if (job.paid) return { error: new Error('job is already paid') };
    
      // lock contract
      const contract = await Contract.findOne({
        where: { id: job.ContractId, ClientId: req.profile.id }
      }, {
        transaction: t
      });

      if (!contract) return { error: new Error('contract not found') };
      if (contract.status !== 'in_progress') return { error: new Error('can not pay for a inactive contract') };
    
      if (isClientLocked(contract.ClientId)) return { error: new Error('client locked') };
      if (isContractorLocked(contract.ContractorId)) return { error: new Error( 'contractor locked') };
      
      lockClient(contract.ClientId);
      lockContractor(contract.ContractorId);

      const client = await Profile.findOne({
        where: { id: +req.profile.id }
      }, {
        transaction: t
      });

      if (!client) return { error: new Error('client not found') };
      if (client.balance < job.price) return { error: new Error('insufficient funds') };
      
      
      const contractor = await Profile.findOne({
        where: { id: +contract.ContractorId }
      });
      
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

      unLockJob(job_id);
      unLockClient(client.id);
      unLockContractor(contractor.id);

      managedClient = client.id;
      managedContractor = contractor.id;

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
    console.log(error)
    unLockJob(job_id);
    if(managedClient) unLockClient(managedClient.id);
    if(managedContractor) unLockContractor(managedContractor.id);
    const { message } = error;
    const statusCode = httpStatusCodeBasedOnMessage(message) || 500;
    return res.status(statusCode).json({ error: message });
  } 
};

function httpStatusCodeBasedOnMessage(message) {
  let statusCode = 0;
  if(message == 'job not found') statusCode = 404;
  if(message == 'can not pay for a inactive contract') statusCode = 404;
  if(message == 'job is already paid') statusCode = 400;
  if(message == 'insufficient funds') statusCode = 400;
  return statusCode;
}

module.exports = jobPayHandler;
