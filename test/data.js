const data = {
    client1: {
        id: 1,
        firstName: 'Harry',
        lastName: 'Potter',
        profession: 'Wizard',
        balance: 1150,
        type:'client'
    },
    client2: {
        id: 2,
        firstName: 'Mr',
        lastName: 'Robot',
        profession: 'Hacker',
        balance: 231.11,
        type:'client'
    },
    client4: {
        id: 4,
        firstName: 'Ash',
        lastName: 'Kethcum',
        profession: 'Pokemon master',
        balance: 1.3,
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
    contractor5: {
        id: 5,
        firstName: 'John',
        lastName: 'Lenon',
        profession: 'Musician',
        balance: 64,
        type:'contractor'
    },
    contractor8: {
        id: 8,
        firstName: 'Aragorn',
        lastName: 'II Elessar Telcontarvalds',
        profession: 'Fighter',
        balance: 314,
        type:'contractor'
    },
    contractor7: {
        id: 7,
        firstName: 'Alan',
        lastName: 'Turing',
        profession: 'Programmer',
        balance: 22,
        type:'contractor'
      },
    contractor6: {
        id: 6,
        firstName: 'Linus',
        lastName: 'Torvalds',
        profession: 'Programmer',
        balance: 1214,
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