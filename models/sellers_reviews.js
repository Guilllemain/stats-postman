exports.detail = data => {
    const sellers_reviews = []
    data.reviews.data.forEach(review => {
        sellers_reviews.push({
            id: data.id,
            seller: data.name,
            review_id: review.id,
            rating: review.rating,
            review: review.text
        })
    })
    return sellers_reviews
};

exports.headers = [
    { id: 'id', title: 'ID vendeur' },
    { id: 'seller', title: 'Vendeur' },
    { id: 'review_id', title: 'ID avis' },
    { id: 'rating', title: 'Note' },
    { id: 'review', title: 'Avis' }
]

exports.filename = 'sellers_reviews.csv'

exports.uri = '/v1/sellers?include=reviews'