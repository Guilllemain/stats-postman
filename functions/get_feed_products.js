const { base_uri } = require('../config');
const axios = require('axios')
const getToken = require('./auth')
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const results = []

const getFeedProducts = async (feed_id, page = 1) => {
    await getToken()
    console.log(page)
    try {
        const { data: { data: products }, data: { meta: pagination }  } = await axios.get(`${base_uri}/v1/feeds/products?context[user_group_id]=1&filter[feed_id]=${feed_id}&page=${page}`)
        for (let i = 0; i < products.length; i++) {
            const product = products[i]
            const { data: { data: bo_offer } } = await axios.get(`${base_uri}/v1/catalog/products/variants/offers/${product.product_offer_id}?context[user_group_id]=1`)
            results.push({
                id: product.id,
                feed_quantity: product.quantity,
                offer_id: product.product_offer_id,
                bo_quantity: bo_offer.quantity,
            })
        }

        if (pagination && pagination.pagination.current_page < pagination.pagination.total_pages) {
            return getFeedProducts(349, pagination.pagination.current_page + 1)
        }

        console.log(results)
        
    } catch (error) {
        console.log(error)
        console.log(error.response.data)
    }
    const res = results.flat()
    createCvsOffers(res)
};

const createCvsOffers = data => {
    createCsvWriter({
        path: `./stats/feed_products.csv`,
        fieldDelimiter: ';',
        header: [
            { id: 'id', title: 'Feed product ID' },
            { id: 'feed_quantity', title: 'Feed stock' },
            { id: 'offer_id', title: 'ID offer' },
            { id: 'bo_quantity', title: 'BO stock' }
        ]
    })
        .writeRecords(data)
        .then(() => console.log(`The file was written successfully`));
}

getFeedProducts(349)