const isNumber  = (num) => {
  return !isNaN(parseFloat(num)) && isFinite(num);
};

const isDepositValid = (num) => {
  if (!num) return false;
  if(!isNumber(num)) return false;
  if ((+num) <= 0) return false;
  return true;
};

const httpStatusCodeBasedOnMessage = (message) => {
  let statusCode = 500;
  if(message === 'client not found') statusCode = 404;
  if(message === 'please provide a valid deposit') statusCode = 400;
  if(message === 'more than 25%') statusCode = 400;
  return statusCode;
};

const balanceDepositHandler = async (req, res) => {
  try {
    const { userId } = req.params;
    const { deposit } = req.body;
    const sequelize = req.app.get('sequelize');
    const { Profile, Job, Contract } = req.app.get('models');
    const { data, error } = await sequelize.transaction(async (t) => {
      
      if(!isDepositValid(deposit)) return { error: new Error('please provide a valid deposit') };

      const client = await Profile.findOne({ where: { id: userId } }, {
        transaction: t
      });
      if (!client) return { error: new Error('client not found') };

      const contracts = await Contract.findAll({ where: { ClientId: +userId, status: 'in_progress' } }, {
        transaction: t
      });
      const contractIds = contracts.map(c => c.id);

      const aggregatedJobsPrice = await Job.findAll({
        where: { ContractId: contractIds, paid: null },
        attributes: ['ContractId', [sequelize.fn('sum', sequelize.col('price')), 'total']],
        group : ['Job.ContractId'],
        raw: true,
        order: sequelize.literal('total DESC')
      }, {
        transaction: t
      });
      
      const totalOpen = aggregatedJobsPrice.reduce((acc, cur) => {
        return (acc.total | 0) + (cur.total | 0);
      }, 0);

      const maxDeposit = 25 * totalOpen / 100;
      if (deposit > maxDeposit) {
        return { error: new Error('more than 25%') };
      }
      const totalToDeposit = client.balance + deposit;
      const data = await client.update({
        balance: totalToDeposit
      }, {
        transaction: t
      });

      return { data };
    });

    if(error) throw error;

    res.status(200).json({ data });
  } catch (error) {
    const statusCode = httpStatusCodeBasedOnMessage(error.message);
    return res.status(statusCode).json({ error: error.message });
  }
};

module.exports = balanceDepositHandler;
