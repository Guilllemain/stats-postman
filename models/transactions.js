const moment = require('moment')

moment.locale('fr')

const detail = data => {
    if (data.parent || data.psp !== 'hipay') return
    
    let order
    if (data.orders && data.orders.data.length > 0) {
        order = data.orders.data[0].id
    }
    
    return {
        id: data.id,
        type: data.type,
        transaction_id: data.psp_transaction_id,
        amount: data.amount,
        state: data.state,
        order,
        date: moment(data.date).format('L')
    }
};

const headers = [
    { id: 'id', title: 'ID' },
    { id: 'type', title: 'Type' },
    { id: 'transaction_id', title: 'Transaction ID' },
    { id: 'amount', title: 'Montant' },
    { id: 'state', title: 'Etat' },
    { id: 'order', title: 'ID order' },
    { id: 'date', title: 'Date' }
]

const filename = 'transactions.csv'

const uri = '/v1/payments/transactions?include=parent,orders'

module.exports = {
    uri,
    page_size: 500,
    models: [
        {
            detail,
            headers,
            filename,
            final_data: []
        }
    ]
}