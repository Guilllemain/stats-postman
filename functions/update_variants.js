const axios = require('axios');
const { base_uri } = require('../config');

const updateVariants = async (seller_id, page = 1) => {
    try {
        console.log(page)
        const { data: { data: response }, data: { meta: pagination } } = await axios.get(`${base_uri}/v1/catalog/products/variants/offers?context[user_group_id]=1&include=product.variants&filter[seller_id]=${seller_id}&page=${page}`)
        response.forEach(async offer => {
            try {
                const { data: { data: variant } } = await axios.get(`${base_uri}/v1/catalog/products/variants/${offer.product_variant_id}?context[user_group_id]=1`)
                await axios.patch(`${base_uri}/v1/catalog/products/variants/${variant.id}?context[user_group_id]=1`, {
                    weight: variant.weight * 1000
                })
            } catch (error) {
                console.log(error)
            }
        })
        if (pagination.pagination.current_page <= pagination.pagination.total_pages) {
            return updateVariants(seller_id, pagination.pagination.current_page + 1)
        }
    }
    catch (error) {
        console.log(error)
    }
}

module.exports = updateVariants