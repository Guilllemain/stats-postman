exports.detail = data => {
    const products_reviews = []
    data.product_reviews.data.forEach(review => {
        products_reviews.push({
            id: data.id,
            name: data.translations.data[0].name,
            review_id: review.id,
            rating: review.rating,
            review: review.text
        })
    })
    return products_reviews
};

exports.headers = [
    { id: 'id', title: 'ID produit' },
    { id: 'name', title: 'Nom' },
    { id: 'review_id', title: 'ID avis' },
    { id: 'rating', title: 'Note' },
    { id: 'review', title: 'Avis' }
]

exports.filename = 'products_reviews.csv'

exports.uri = '/v1/catalog/products?include=product_reviews'