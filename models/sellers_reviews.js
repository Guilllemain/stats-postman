const moment = require('moment')

moment.locale('fr')

exports.detail = data => {
        return {
            seller_id: data.recipient_id,
            created_at: moment(data.created_at).format('L'),
            seller: data.recipient.data.name,
            review_id: data.id,
            rating: data.rating,
            review: data.text,
            order_id: data.order_seller_id,
            customer_id: data.author_id
        }
};

exports.headers = [
    { id: 'seller_id', title: 'ID vendeur' },
    { id: 'created_at', title: 'Date' },
    { id: 'seller', title: 'Vendeur' },
    { id: 'review_id', title: 'ID avis' },
    { id: 'rating', title: 'Note' },
    { id: 'review', title: 'Avis' },
    { id: 'order_id', title: 'ID commande' },
    { id: 'customer_id', title: 'ID client' }
]

exports.filename = 'sellers_reviews.csv'

exports.uri = '/v1/reviews?include=recipient&filter[type]=seller'