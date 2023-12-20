let lockedClients = {};
let lockedContractors = {};
let lockedJobs = {};

const {
  sequelize
} = require('../model');

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
  const {
    job_id
  } = req.params;
  let error = null;

  const {
    Profile,
    Job,
    Contract
  } = req.app.get('models');

  if (isJobLocked(job_id)) {
    return res.status(401).json({
      error: 'job locked'
    });
  }

  // get job
  const job = await Job.findOne({
    where: {
      id: job_id
    }
  });
  if (!job) {
    return res.status(404).json({
      error: 'job not found'
    });
  }
  if (job.paid) {
    return res.status(401).json({
      error: 'job is already paid'
    });
  }


  // get contract

  const contract = await Contract.findOne({
    where: {
      id: job.ContractId,
      ClientId: req.profile.id
    }
  });
  if (!contract) {
    return res.status(404).json({
      error: 'contract not found'
    });
  }
  if (contract.status !== 'in_progress') {
    return res.status(401).json({
      error: 'can not pay for a inactive contract'
    });
  }

  if (isClientLocked(contract.ClientId)) {
    return res.status(401).json({
      error: 'client locked'
    });
  }
  if (isContractorLocked(contract.ContractorId)) {
    return res.status(401).json({
      error: 'contractor locked'
    });
  }

  // get client
  const client = await Profile.findOne({
    where: {
      id: +req.profile.id
    }
  });
  // check client
  if (!client) {
    return res.status(404).json({
      error: 'client not found'
    });
  }
  if (client.balance < job.price) {
    return res.status(401).json({
      error: 'insufficient funds'
    });
  }

  // get contractor
  const contractor = await Profile.findOne({
    where: {
      id: contract.ContractorId
    }
  }); // contract.ContractorId
  if (!contractor) {
    return res.status(404).json({
      error: 'contractor not found'
    });
  }

  try {
    lockJob(job_id);
    lockClient(client.id);
    lockContractor(contractor.id);

    await sequelize.transaction(async (t) => {
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
        paid: true,
        paymentDate: (new Date())
      }, {
        transaction: t
      });

      return {
        client,
        contractor
      };
    });
  } catch (err) {
    error = err;
  } finally {
    unLockJob(job_id);
    unLockClient(client.id);
    unLockContractor(contractor.id);
  }

  if (error) {
    return res.status(500).json({
      error
    });
  }

  res.json({
    data: 'paid'
  });
};

module.exports = jobPayHandler;
