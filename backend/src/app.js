const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const {
  sequelize,
  Sequelize,
} = require('./model');
const routes = require('./routes');
const locker = require('./service/LockerService');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.set('Sequelize', Sequelize);
app.set('sequelize', sequelize);
app.set('locker', locker);
app.set('models', sequelize.models);

routes(app);

module.exports = app;
