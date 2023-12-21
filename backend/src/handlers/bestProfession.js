
const {
  Op
} = require('../model');
const bestProfessionHandler = async (req, res) => {
  const {
    start,
    end
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

  let maxAmount = 0;
  let contractIdMaxAmount = null;
  for (const [key, value] of amountPerContract) {
    if (value > maxAmount) {
      maxAmount = value;
      contractIdMaxAmount = key;
    }
  }
  if(!contractIdMaxAmount) {
    return res.json({
      data: 'There is no jobs in the given date range'
    });
  }
  const contract = await Contract.findOne({
    where: {
      id: contractIdMaxAmount
    }
  });
  if(!contract) {
    return res.json({
      data: 'There is no contract in the given date range'
    });
  }
  const contractor = await Profile.findOne({
    where: {
      id: contract.ContractorId
    }
  });

  if(!contract) {
    return res.json({
      data: 'There is no contractor in the given date range'
    });
  }

  res.json({
    data: contractor.profession
  });
};

module.exports = bestProfessionHandler;
