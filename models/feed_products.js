const { base_uri } = require('../config');
const axios = require('axios')
const moment = require('moment')
const getCategoryProducts = require('../functions/get_rackets_categories_products')

moment.locale('fr')

const detail = async (feed_id = 349) => {
    try {
        const products = []
        const { data: { data: products } } = await axios.get(`${base_uri}/v1/feeds/products?context[user_group_id]=1&filter[feed_id]=${feed_id}`)

        products.forEach(product => {
            const { data: { data: bo_offer } } = await axios.get(`${base_uri}/v1/catalog/products/variants/offers/${product.product_offer_id}?context[user_group_id]=1`)
            products.push({
                id: product.id,
                feed_quantity: product.quantity,
                offer_id: product.product_offer_id,
                bo_quantity: bo_offer.quantity,
            })
        })
        return products

    } catch (error) {
        console.log(error)
        console.log(error.code)
    }
};

const headers = [
    { id: 'id', title: 'Feed product ID' },
    { id: 'feed_quantity', title: 'Feed stock' },
    { id: 'offer_id', title: 'ID offer' },
    { id: 'bo_quantity', title: 'BO stock' }
]

const filename = 'feed_products.csv'

const uri = '/v1/catalog/products?include=features.feature_type'


//products categories
const rackets = {
    filename: 'raquettes.csv',
    category_id: 5,
    attributes_id: [3, 7],
    features_id: [40, 60, 35, 73, 37, 47, 54, 41, 42, 47],
    products: []
}
const balls = {
    filename: 'balles.csv',
    category_id: 10,
    attributes_id: "",
    features_id: [25, 5, 26],
    products: []
}

// const racket_detail = async(product) => {
//     const rackets_products = []
//     const racket_product = await getCategoryProducts.getProducts(product, rackets)
//     if (racket_product) {
//         racket_product.forEach(racket => rackets_products.push(racket))
//     }
//     return rackets_products
// }

// const ball_detail = async(product) => {
//     const balls_products = []
//     const ball_product = await getCategoryProducts.getProducts(product, balls)
//     if (ball_product) {
//         ball_product.forEach(ball => balls_products.push(ball))
//     }
//     console.log(getCategoryProducts.headers)
//     return balls_products
// }

module.exports = {
    uri,
    page_size: 100,
    models: [
        {
            detail,
            headers,
            filename,
            final_data: []
        }
        // {
        //     detail: racket_detail,
        //     headers: getCategoryProducts.headers,
        //     filename: rackets.filename,
        //     final_data: []
        // },
        // {
        //     detail: ball_detail,
        //     headers: getCategoryProducts.headers,
        //     filename: balls.filename,
        //     final_data: []
        // }
    ]
}