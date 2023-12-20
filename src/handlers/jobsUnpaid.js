const jobsUnpaidHandler = async (req, res) => {
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
  const {
    Job
  } = req.app.get('models');
  const queryJob = {
    where: {
      ContractId: contracts.map(c => c.id),
      paid: null
    }
  };
  const jobs = await Job.findAll(queryJob);

  res.json(jobs);
};

module.exports = jobsUnpaidHandler;
