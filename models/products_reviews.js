const moment = require('moment')

exports.detail = data => {
    return {
        product_id: data.recipient_id,
        created_at: moment(data.created_at).format('L'),
        name: data.recipient.data.translations.data[0].name,
        review_id: data.id,
        rating: data.rating,
        review: data.text,
        order_id: data.order_seller_id,
        customer_id: data.author_id
    }
};

exports.headers = [
    { id: 'product_id', title: 'ID produit' },
    { id: 'created_at', title: 'Date' },
    { id: 'name', title: 'Nom' },
    { id: 'review_id', title: 'ID avis' },
    { id: 'rating', title: 'Note' },
    { id: 'review', title: 'Avis' },
    { id: 'order_id', title: 'ID commande' },
    { id: 'customer_id', title: 'ID client' }
]

exports.filename = 'products_reviews.csv'

exports.uri = '/v1/reviews?include=recipient&filter[type]=product'