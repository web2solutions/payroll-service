
const {
  Op
} = require('../model');
const bestClientsHandler = async (req, res) => {
  try {
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
    // console.log(start, end);
    if (start && end) {
      // console.log(start, end);
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
    
    // console.log(sortedContracts);
    const contractIds = [];
    for(const contractInfo of sortedContracts) {
      const [contractId/*, amount*/] = contractInfo;
      contractIds.push(contractId);
      // console.log(`${contractIds}  - ${limit}`)
    }
  
    const contracts = await Contract.findAll({
      where: {
        id: contractIds,
        // status: 'in_progress',
      }
    });
    // console.log(JSON.parse(JSON.stringify(contracts)));
    
    const bestClientsId = [];
    for(const id of contractIds) {
      let contract = null;
      for(const foundContract of contracts) {
        if(+foundContract.id === +id) {
          contract = foundContract;
          break;
        }
      }
      bestClientsId.push(contract.ClientId);
    }
  
    const clients = await Profile.findAll({
      where: {
        id: bestClientsId
      },
      limit
    });

    // console.log(JSON.parse(JSON.stringify(clients)));
  
    res.json({
      data: clients
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
};

module.exports = bestClientsHandler;
