const data = {
    client1: {
        id: 1,
        firstName: 'Harry',
        lastName: 'Potter',
        profession: 'Wizard',
        balance: 1150,
        type:'client'
    },
    contractor1: {
        id: 5,
        firstName: 'John',
        lastName: 'Lenon',
        profession: 'Musician',
        balance: 64,
        type:'contractor'
    },
    contract1: {
        id:1,
        terms: 'bla bla bla',
        status: 'terminated',
        ClientId: 1,
        ContractorId:5
    },
    contract9: {
        id:9,
        terms: 'bla bla bla',
        status: 'in_progress',
        ClientId: 4,
        ContractorId: 8
    }
}

module.exports = data;