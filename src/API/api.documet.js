import { API } from 'aws-amplify';
// add new borrow
await API.post('auth', '/api/borrow', {
  headers: { 'Content-Type': 'application/json' },
  body: {
    id: '',
    address: '',
    description: '',
    amount: '',
    currentBalance: '',
    isLocked: '',
    isPublished: '',
    fundedProposal: '',
    createDate: '',
    updateDate: '',
    startDate: '',
  },
});

// get all borrowers
await API.get('auth', '/api/borrow', {});

// get specific borrower
await API.get('auth', `/api/borrow/findOne`, {
  queryStringParameters: { address },
});

// update borrower data
// need to send address and data u need to update
await API.patch('auth', `/api/users/${user.id}`, {
  headers: {},
  body: { address },
});

// back email invitation
await API.post('auth', '/api/borrow/sendBackInvitation', {
  headers: { 'Content-Type': 'application/json' },
  body: {
    sendToMail: 'ebrahim0hamdy@gmail.com',
    title: 'test proposal',
    description: 'proposal desc',
    amount: '100',
    term: '10 years',
    address: '0xB94Fa1D4cA7D22F69Cb3B908A6CF0e078A3227E3',
  },
});
