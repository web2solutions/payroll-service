const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const {
  sequelize
} = require('./model');

const routes = require('./routes');

const locker = require('./service/LockerService');

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.set('sequelize', sequelize);
app.set('locker', locker);
app.set('models', sequelize.models);

routes(app);

module.exports = app;
