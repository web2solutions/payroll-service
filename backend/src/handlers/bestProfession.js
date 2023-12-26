
const Sequelize = require('sequelize');
const {
  Op
} = require('../model');

const httpStatusCodeBasedOnMessage = (message) => {
  let statusCode = 500;
  if(message === 'There is no jobs in the given date range') statusCode = 404;
  if(message === 'There is no contract in the given date range') statusCode = 404;
  if(message === 'There is no contractor in the given date range') statusCode = 404;
  if(message === 'please provide a valid date range') statusCode = 400;
  return statusCode;
};

const bestProfessionHandler = async (req, res) => {
  try {
    const { start, end } = req.query;
    const { Job, Contract, Profile } = req.app.get('models');
    const query = { where: { paid: true } };
    
    if (start && end) {
      const startDate = new Date(start);
      const endDate = new Date(end);
      if (startDate.getTime() >= endDate.getTime()) throw new Error('please provide a valid date range');
      query.where.paymentDate = query.where.paymentDate || {};
      query.where.paymentDate[Op.between] = [startDate, endDate];
    }

    const aggregatedJobsPrice = await Job.findAll({
      where: query.where,
      attributes: ['ContractId', [Sequelize.fn('sum', Sequelize.col('price')), 'total']],
      group : ['Job.ContractId'],
      raw: true,
      order: Sequelize.literal('total DESC')
    });
    if(!aggregatedJobsPrice[0]) throw new Error('There is no jobs in the given date range');
    
    const contract = await Contract.findOne({
      where: {
        id: aggregatedJobsPrice[0].ContractId
      },
      include: [ { model: Profile, as: 'Contractor' } ]
    });
    // if(!contract) throw new Error('There is no contract in the given date range');
    // if(!contract.Contractor) throw new Error('There is no contractor in the given date range');

    return res.json({
      data: contract.Contractor.profession
    });
  } catch (error) {
    console.log(error);
    const statusCode = httpStatusCodeBasedOnMessage(error.message);
    return res.status(statusCode).json({ error: error.message });
  }
};

module.exports = bestProfessionHandler;
