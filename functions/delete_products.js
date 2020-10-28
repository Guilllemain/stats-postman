// remove all orders from an open payment report
const axios = require('axios');
const { base_uri } = require('../config');


const deleteProductsWithoutImage = async (seller_id, page = 1) => {
    try {
        console.log(page)
        const { data: { data: offers }, data: { meta: pagination } } = await axios.get(`${base_uri}/v1/catalog/products/variants/offers?filter[seller_id]=${seller_id}&include=product&context[user_group_id]=1&page=${page}`)
        const products_without_images = offers.filter(offer => !offer.product.data.image_default).map(offer => offer.product_id)
        const unique = [...new Set(products_without_images)]
        for (let i = 0; i < unique.length; i++) {
            const product_id = unique[i]
                try {
                    const response = await axios.delete(`${base_uri}/v1/catalog/products/${product_id}?context[user_group_id]=1`)
                    console.log(response.status, ' | ', product_id)
                } catch (error) {
                    console.log(error.status, ' | ', product_id, ' --- ERROR ---')
                }
        }
        if (pagination.pagination.current_page <= pagination.pagination.total_pages) {
            return deleteProductsWithoutImage(seller_id, pagination.pagination.current_page + 1)
        }
    } catch (error) {
        console.error(error)
    }
}


exports.deleteProducts = deleteProductsWithoutImage