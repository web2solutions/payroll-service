
const {
  Op
} = require('../model');
const bestClientsHandler = async (req, res) => {
  const {
    start,
    end,
    limit = 2,
  } = req.query;
  const {
    Job,
    Contract,
    Profile
  } = req.app.get('models');
  const query = {
    where: {
      paid: true
    }
  };
  if (start && end) {
    const startDate = new Date(start);
    const endDate = new Date(end);
    if (startDate.getTime() >= endDate.getTime()) {
      return res.status(401).json({
        error: 'please provide a valid date range'
      });
    }
    query.where.paymentDate = query.where.paymentDate || {};
    query.where.paymentDate[Op.between] = [startDate, endDate];
  }
  const amountPerContract = new Map();
  const jobs = await Job.findAll(query);
  for (const job of jobs) {
    const totalAmount = (amountPerContract.get(job.ContractId) || 0) + job.price;
    amountPerContract.set(job.ContractId, totalAmount);
  }
  
  const sortedContracts = [...amountPerContract.entries()].sort(function (a, b) {
    if(a[1] > b[1]) return -1;
    if(a[1] < b[1]) return 1;
    return 0;
  });
  
  
  const contractIds = [];
  let added = 0;
  for(const contractInfo of sortedContracts) {
    const [contractId/*, amount*/] = contractInfo;
    contractIds.push(contractId);
    added += 1;
    if(added >= limit) {
      break;
    }
  }

  const contracts = await Contract.findAll({
    where: {
      id: contractIds
    }
  });

  

  const clients = await Profile.findAll({
    where: {
      id: contracts.map(c => c.ClientId)
    }
  });

  res.json({
    data: clients
  });
};

module.exports = bestClientsHandler;
