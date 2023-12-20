const contractsHandler = async (req, res) => {
  const {
    Contract
  } = req.app.get('models');
  const query = {
    where: {
      status: 'in_progress'
    }
  };

  if (req.profile.type === 'client') {
    query.where.ClientId = req.profile.id;
  } else if (req.profile.type === 'contractor') {
    query.where.ContractorId = req.profile.id;
  }

  const contracts = await Contract.findAll(query);

  res.json(contracts);
};

module.exports = contractsHandler;
