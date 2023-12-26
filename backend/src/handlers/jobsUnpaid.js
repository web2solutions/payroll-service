const jobsUnpaidHandler = async (req, res) => {
  try {
    const { Contract, Job } = req.app.get('models');
    const query = { where: { status: 'in_progress'  } };
  
    if (req.profile.type === 'client') {
      query.where.ClientId = req.profile.id;
    } else if (req.profile.type === 'contractor') {
      query.where.ContractorId = req.profile.id;
    }
  
    const contracts = await Contract.findAll(query);

    const queryJob = {
      where: {
        ContractId: contracts.map(c => c.id),
        paid: null
      }
    };
    const jobs = await Job.findAll(queryJob);
  
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ error });
  }
};

module.exports = jobsUnpaidHandler;
