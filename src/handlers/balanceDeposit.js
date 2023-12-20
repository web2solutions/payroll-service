const balanceDepositHandler = async (req, res) => {
  const {
    userId
  } = req.params;
  const {
    deposit
  } = req.body;
  if (!deposit) {
    return res.status(401).json({
      error: 'please provide a valid deposit'
    });
  }
  if ((+deposit) <= 0) {
    return res.status(401).json({
      error: 'please provide a valid deposit'
    });
  }
  const {
    Profile,
    Job,
    Contract
  } = req.app.get('models');

  const client = await Profile.findOne({
    where: {
      id: userId
    }
  });
  if (!client) {
    return res.status(404).json({
      error: 'client not found'
    });
  }

  const contracts = await Contract.findAll({
    where: {
      ClientId: +userId
    }
  });
  const contractIds = contracts.filter(c => {
    if (c.status === 'in_progress') return true;
    return false;
  }).map(c => c.id);

  const jobs = await Job.findAll({
    where: {
      ContractId: contractIds
    }
  });
  const totalOpen = jobs.filter(j => {
    if (!j.paid) return true;
    return false;
  }).reduce((acc, cur) => {
    return (acc.price | 0) + (cur.price | 0);
  }, 0);

  const maxDeposit = 25 * totalOpen / 100;
  if (deposit > maxDeposit) {
    return res.status(401).json({
      error: 'more than 25%'
    });
  }
  const totalTodeposit = client.balance + deposit;
  const data = await client.update({
    balance: totalTodeposit
  });

  res.status(200).json({
    data
  });
};

module.exports = balanceDepositHandler;
