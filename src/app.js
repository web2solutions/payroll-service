const express = require('express');
const bodyParser = require('body-parser');
const {sequelize} = require('./model')
const {getProfile} = require('./middleware/getProfile')
const app = express();
app.use(bodyParser.json());
app.set('sequelize', sequelize)
app.set('models', sequelize.models)

let lockedClients = {};
let lockedContractors = {};
let lockedJobs = {};

function lockClient (id) {
    if(!lockedClients[`${id}`]) {
        lockedClients[`${id}`] = true;
    }
}

function unLockClient (id) {
    if(lockedClients[`${id}`]) {
        delete lockedClients[`${id}`]
    }
}

function isClientLocked (id) {
    return !!lockedClients[`${id}`];
}

// -- 
function lockContractor (id) {
    if(!lockedContractors[`${id}`]) {
        lockedContractors[`${id}`] = true;
    }
}

function unLockContractor (id) {
    if(lockedContractors[`${id}`]) {
        delete lockedContractors[`${id}`]
    }
}

function isContractorLocked (id) {
    return !!lockedContractors[`${id}`];
}

// --

function lockJob (id) {
    if(!lockedJobs[`${id}`]) {
        lockedJobs[`${id}`] = true;
    }
}

function unLockJob (id) {
    if(lockedJobs[`${id}`]) {
        delete lockedJobs[`${id}`]
    }
}

function isJobLocked (id) {
    return !!lockedJobs[`${id}`];
}

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


app.get('/jobs/unpaid', getProfile ,async (req, res) =>{
    const {Contract} = req.app.get('models')
    const query = { where: { status: 'in_progress' } }

    if(req.profile.type === 'client') {
        query.where.ClientId = req.profile.id
    } else if(req.profile.type === 'contractor') {
        query.where.ContractorId = req.profile.id
    }

    const contracts = await Contract.findAll(query);
    const {Job} = req.app.get('models')
    const queryJob = { where: { 
        ContractId: contracts.map(c => c.id),
        paid: null
    } }
    const jobs = await Job.findAll(queryJob)
    
    res.json(jobs)
});


// Pay for a job, a client can only pay if his balance >= the amount to pay. The amount should be moved from the client's balance to the contractor balance.
app.get('/jobs/:job_id/pay', getProfile ,async (req, res) =>{
    const { job_id } = req.params;
    let error = null;

    //
    if(isJobLocked(job_id)) {
        return res.status(401).json({ error: 'job locked'})
    }

    // get job
    const {Job} = req.app.get('models')
    const job = await Job.findOne({ where: {  id: job_id } });
    // check job
    if(!job) {
        return res.status(404).json({ error: 'job not found'})
    }
    if(job.paid) {
        return res.status(401).json({ error: 'job is already paid'})
    }
   
    // get contract
    const {Contract} = req.app.get('models')
    const contract = await Contract.findOne({ where: { id: job.ContractId, ContractorId: req.profile.id } })
    if(!contract) {
        return res.status(404).json({ error: 'job not found'});
    }
    // check contract status
    if(contract.status !== 'in_progress') {
        return res.status(401).json({ error: 'can not pay for a inactive contract'});
    }
    
    // get client
    const {Profile} = req.app.get('models')
    const client = await Profile.findOne({ where: { id: req.profile.id } })
    // check client
    if(!client) {
        return res.status(404).json({ error: 'client not found'});
    }
    if(client.balance < job.price) {
        return res.status(401).json({ error: 'insufficient funds'});
    }
    
    // get contractor
    const contractor = await Profile.findOne({ where: { id:  contract.ContractorId } }) // contract.ContractorId
    if(!contractor) {
        return res.status(404).json({ error: 'contractor not found'});
    }
    
    try {
        lockJob(job_id);
        lockClient(client.id);
        lockContractor(contractor.id)

        const result = await sequelize.transaction(async (t) => {
            const clientDeductedBalance = client.balance - job.price;
            const contractorIncreasedBalance = contractor.balance + job.price;
        
            await client.update({ balance: clientDeductedBalance }, { transaction: t })
            await contractor.update({ balance: contractorIncreasedBalance }, { transaction: t })

            return { client, contractor };
        });
    } catch (err) {
        error = err;
    } finally {
        unLockJob(job_id);
        unLockClient(client.id);
        unLockContractor(contractor.id)
    }

    if(error) {
        return res.statusCode(500).json({ error })
    } 

    res.json({ data: 'paid', error })
});



module.exports = app;
