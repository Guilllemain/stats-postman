// remove all orders from an open payment report
const axios = require('axios');
const { base_uri } = require('../config');
const {create_specific_price, add_specific_price} = require('./specific_price')

module.exports = async (offers) => {
    for (let i = 0; i < offers.length; i++) {
        const offer = offers[i]
        // try {
        //     const { data : { data : response} } = await axios.get(`${base_uri}/v1/catalog/products/variants/offers/${offer}?context[user_group_id]=1`)
        //     if (response.seller_id !== 2717) return
        //     const { data: { data: variant } } = await axios.get(`${base_uri}/v1/catalog/products/variants/${response.product_variant_id}?context[user_group_id]=1&include=offers,product`)
        //     if (variant.offers.data.length > 1) {
        //         console.log(offer)
        //         await axios.delete(`${base_uri}/v1/catalog/products/variants/offers/${offer}?context[user_group_id]=1`)
        //     }
        //     else if ((!variant.ean13 || !variant.product.data.ean13) && variant.product.data.variants_count === 1) {
        //         await axios.delete(`${base_uri}/v1/catalog/products/variants/offers/${offer}?context[user_group_id]=1`)
        //         await axios.patch(`${base_uri}/v1/catalog/products/${variant.product.data.id}?context[user_group_id]=1`, {
        //             state_id: 3
        //         })
        //         console.log(variant.product.data.id)
        //     } else {
        //         console.log(variant.product.data.id, '------- with ean')
        //         await axios.delete(`${base_uri}/v1/catalog/products/variants/offers/${offer}?context[user_group_id]=1`)
        //     }
            
        // } catch (error) {
        //     console.log(error.response.status, offer, ' --- ERROR ---')
        // }
        
        // add specific price rules
        await add_specific_price(offer, 65777)
    }
}