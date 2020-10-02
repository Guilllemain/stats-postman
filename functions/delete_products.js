// remove all orders from an open payment report
const axios = require('axios');
const { base_uri } = require('../config');

const deleteETproducts = async (seller_id, page = 1) => {
    try {
        console.log(page)
        let productsIDs = []
        const { data: { data: response }, data: { meta: pagination }   } = await axios.get(`${base_uri}/v1/catalog/products/variants/offers?filter[seller_id]=${seller_id}&context[user_group_id]=1&page=${page}`)
        response.forEach(async offer => {
            if (offer.seller_id != 2717 || offer.product_id === 9391) return
            if (!productsIDs.includes(offer.product_id)) productsIDs.push(offer.product_id)
        })
        productsIDs.forEach(product_id => {
            console.log(product_id)
            try {
                axios.delete(`${base_uri}/v1/catalog/products/${product_id}?context[user_group_id]=1`)
            } catch (error) {
                console.log(error)
            }
        })
        productsIDs = []
        if (pagination.pagination.current_page <= pagination.pagination.total_pages) {
            return deleteETproducts(2717, pagination.pagination.current_page + 1)
        }
    } catch (error) {
        console.error(error)
        if (error.response.status === 401) console.log('You need a new access token')
    }
    console.log(productsIDs)
}

exports.deleteETproducts = deleteETproducts