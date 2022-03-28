const detail = data => {
    return {
        id: data.id,
        amount: data.amount,
        remaining_amount: data.remaining_amount,
        // code: data.code,
        order_id: data.order_seller.data.id,
        customer_id: data.order_seller.data.customer.data.id,
        customer_name: data.order_seller.data.customer.data.name,
    }
};

const headers = [
    { id: 'id', title: 'ID' },
    { id: 'amount', title: 'Montant' },
    { id: 'remaining_amount', title: 'Montant restant' },
    // { id: 'code', title: 'Code' },
    { id: 'order_id', title: 'ID commande' },
    { id: 'customer_id', title: 'ID client' },
    { id: 'customer_name', title: 'Nom client' },
]

const filename = 'gift_cards.csv'

const uri = '/v1/gift_cards?include=order_seller.customer'

module.exports = {
    uri,
    page_size: 1000,
    models: [
        {
            detail,
            headers,
            filename,
            final_data: []
        }
    ]
}