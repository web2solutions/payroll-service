const express = require('express');
const bodyParser = require('body-parser');
const {sequelize, Op} = require('./model');
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

// Deposits money into the the the balance of a client, a client can't deposit more than 25% his total of jobs to pay. (at the deposit moment)
app.post('/balances/deposit/:userId', getProfile, async (req, res) => {
    const { userId } = req.params;
    const { deposit } = req.body;
    if(!deposit) {
        return res.status(401).json({  error: 'please provide a valid deposit' })
    }
    if((+deposit) <= 0) {
        return res.status(401).json({  error: 'please provide a valid deposit' })
    }
    const { Profile, Job, Contract } = req.app.get('models');
    
    const client = await Profile.findOne({ where: { id: userId } })
    if(!client) {
        return res.status(404).json({ error: 'client not found'});
    }

    const contracts = await Contract.findAll({ where: { ClientId: +userId  } });
    const contractIds = contracts.filter(c => {
        if(c.status === 'in_progress') return true;
        return false;
    }).map(c => c.id);

    const jobs = await Job.findAll({ where: { ContractId: contractIds  } });
    const totalOpen = jobs.filter(j => {
        if(!j.paid) return true;
        return false;
    }).reduce((acc, cur) => {
        return (acc.price | 0) + (cur.price | 0)
    }, 0);

    const maxDeposit = 25 * totalOpen / 100;
    if(deposit >  maxDeposit) {
        return res.status(401).json({  error: 'more than 25%' })
    }
    const totalTodeposit = client.balance + deposit;
    const data = await client.update({ balance: totalTodeposit })

    res.status(200).json({ data })
});

// Pay for a job, a client can only pay if his balance >= the amount to pay. The amount should be moved from the client's balance to the contractor balance.
app.get('/jobs/:job_id/pay', getProfile ,async (req, res) =>{
    const { job_id } = req.params;
    let error = null;
    
    const { Profile, Job, Contract } = req.app.get('models')

    if(isJobLocked(job_id)) {
        return res.status(401).json({ error: 'job locked'})
    }

    // get job
    const job = await Job.findOne({ where: {  id: job_id } });
    if(!job) {
        return res.status(404).json({ error: 'job not found'})
    }
    if(job.paid) {
        return res.status(401).json({ error: 'job is already paid'})
    }
    
   
    // get contract
    
    const contract = await Contract.findOne({ where: { id: job.ContractId, ClientId: req.profile.id } })
    if(!contract) {
        return res.status(404).json({ error: 'contract not found'});
    }
    if(contract.status !== 'in_progress') {
        return res.status(401).json({ error: 'can not pay for a inactive contract'});
    }

    if(isClientLocked(contract.ClientId)) {
        return res.status(401).json({ error: 'client locked'})
    }
    if(isContractorLocked(contract.ContractorId)) {
        return res.status(401).json({ error: 'contractor locked'})
    }
    
    // get client
    const client = await Profile.findOne({ where: { id: +req.profile.id } })
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
            await job.update({ paid: true, paymentDate: (new Date()) }, { transaction: t })

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
        return res.status(500).json({ error })
    } 

    res.json({ data: 'paid' })
});

// 
app.get('/admin/best-profession', getProfile ,async (req, res) =>{
    const { start, end } = req.query;
    const { Job, Contract, Profile } = req.app.get('models')
    const query = { where: { paid: true } }
    if(start && end) {
        const startDate = new Date(start);
        const endDate = new Date(end);
        if(startDate.getTime() >= endDate.getTime()) {
            return res.status(401).json({  error: 'please provide a valid date range' })
        }
        query.where.paymentDate = query.where.paymentDate || {};
        query.where.paymentDate[Op.between] = [startDate, endDate];
    }
    const amountPerContract = new Map();
    const jobs = await Job.findAll(query)
    for(const job of jobs) {
        const totalAmount =  (amountPerContract.get(job.ContractId) || 0) + job.price;
        amountPerContract.set(job.ContractId, totalAmount)
    }
    
    let maxAmount = 0;
    let contractIdMaxAmount = null;
    for( const [key, value] of amountPerContract ) {
        if(value > maxAmount) {
            maxAmount = value;
            contractIdMaxAmount = key;
        }
    }

    const contract = await Contract.findOne({ where: { id: contractIdMaxAmount }});
    const contractor = await Profile.findOne({ where: { id: contract.ContractorId }});
    
    res.json({ data: contractor.profession });
});

module.exports = app;
