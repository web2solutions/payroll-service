const profileByNameHandler = async (req, res) => {
  const {
    Profile
  } = req.app.get('models');
  const {
    firstName,
    lastName,
  } = req.body;
  const profile = await Profile.findOne({ where: { firstName, lastName} });
  if ((+profile) <= 0) {
    return res.status(401).json({
      error: 'Profile not found'
    });
  }
  res.json({ data: profile });
};

module.exports = profileByNameHandler;
