const moment = require('moment')
moment.locale('fr')

const detail = data => {
    let name = 'Produit supprimé'
    if (data.recipient) {
        name = data.recipient_type === "seller" ? data.recipient.data.name : data.recipient.data.translations.data[0].name
    } 
    return {
        review_id: data.id,
        rating: data.rating,
        review: data.text,
        created_at: moment(data.created_at).format('L'),
        recipient_type: data.recipient_type,
        recipient_id: data.recipient_id,
        name,
        order_id: data.order_seller_id,
        customer_id: data.author_id
    }
};

const headers = [
    { id: 'review_id', title: 'ID avis' },
    { id: 'rating', title: 'Note' },
    { id: 'review', title: 'Avis' },
    { id: 'created_at', title: 'Date' },
    { id: 'recipient_type', title: 'Type' },
    { id: 'recipient_id', title: 'ID produit' },
    { id: 'name', title: 'Nom' },
    { id: 'order_id', title: 'ID commande' },
    { id: 'customer_id', title: 'ID client' }
]

const filename = 'reviews.csv'

const uri = '/v1/reviews?include=recipient'

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