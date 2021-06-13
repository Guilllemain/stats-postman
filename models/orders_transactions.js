const moment = require('moment')
moment.locale('fr')


// orders file
const detail = data => {
    if (data.type === 'cart') return
    const orders_transactions = []
    data.payment_transactions.data.forEach(tr => {
        if (tr.type === 'TRANSFER_OPERATOR' || tr.type === 'TRANSFER_SHOP') return
        let psp_transaction_id = tr.psp_transaction_id
        let transaction_parent_id
        if (tr.parent) {
            // if (tr.type === 'BANK_WIRE' && tr.parent.data.psp_transaction_extra_info.virtual_iban.iban == 'FR7617789009990290001976666') {
            //     console.log(data.id)
            // }
            psp_transaction_id = tr.parent.data.psp_transaction_id
            transaction_parent_id = tr.parent.data.id
        }
        orders_transactions.push({
            order_id: data.id,
            order_reference: data.reference,
            type: data.type,
            total: data.total,
            transaction_id: tr.id,
            transaction_parent_id: transaction_parent_id,
            transaction_type: tr.type,
            transaction_amount: tr.amount,
            transaction_state: tr.state,
            transaction_psp_transaction_id: psp_transaction_id,

        })
    })
    return orders_transactions
};

const headers = [
    { id: 'order_id', title: 'Order ID' },
    { id: 'order_reference', title: 'Order reference' },
    { id: 'type', title: 'Order type' },
    { id: 'total', title: 'Order total' },
    { id: 'transaction_id', title: 'Transaction ID' },
    { id: 'transaction_parent_id', title: 'Transaction parent ID' },
    { id: 'transaction_type', title: 'Transaction type' },
    { id: 'transaction_amount', title: 'Montant transaction' },
    { id: 'transaction_state', title: 'Etat transaction' },
    { id: 'transaction_psp_transaction_id', title: 'Transaction HiPay ID' }
]

const filename = 'orders_transactions.csv'

const uri = '/v1/orders?include=payment_transactions.parent&order[name]=id&order[way]=desc'


module.exports = {
    uri,
    models: [
        {
            detail,
            headers,
            filename,
            final_data: []
        }
    ]
}