const express = require('express');
const bodyParser = require('body-parser');
const {sequelize} = require('./model')
const {getProfile} = require('./middleware/getProfile')
const app = express();
app.use(bodyParser.json());
app.set('sequelize', sequelize)
app.set('models', sequelize.models)


app.get('/contracts/:id', getProfile ,async (req, res) =>{
    const {Contract} = req.app.get('models')
    const {id} = req.params;
    const query = { where: {  id } }
    if(req.profile.type === 'client') {
        query.where.ClientId = req.profile.id
    } else if(req.profile.type === 'contractor') {
        query.where.ContractorId = req.profile.id
    }
    const contract = await Contract.findOne(query)
    if(!contract) return res.status(404).end()
    res.json(contract)
});


app.get('/contracts', getProfile ,async (req, res) =>{
    const {Contract} = req.app.get('models')
    // const {id} = req.params;
    const query = { where: { status: 'in_progress' } }

    if(req.profile.type === 'client') {
        query.where.ClientId = req.profile.id
    } else if(req.profile.type === 'contractor') {
        query.where.ContractorId = req.profile.id
    }

    const contracts = await Contract.findAll(query)
    
    res.json(contracts)
});



module.exports = app;
