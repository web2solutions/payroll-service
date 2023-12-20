const contractByIdHandler = async (req, res) => {
  const {
    Contract
  } = req.app.get('models');
  const {
    id
  } = req.params;
  const query = {
    where: {
      id
    }
  };
  if (req.profile.type === 'client') {
    query.where.ClientId = req.profile.id;
  } else if (req.profile.type === 'contractor') {
    query.where.ContractorId = req.profile.id;
  }
  const contract = await Contract.findOne(query);
  if (!contract) return res.status(404).end();
  res.json(contract);
};

module.exports = contractByIdHandler;
