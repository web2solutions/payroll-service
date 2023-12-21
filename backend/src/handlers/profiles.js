const profilesHandler = async (req, res) => {
  try {
    const {
      Profile
    } = req.app.get('models');
    const profiles = await Profile.findAll();
    res.json(profiles);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error });
  }
};

module.exports = profilesHandler;
