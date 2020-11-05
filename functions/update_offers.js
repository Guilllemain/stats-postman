// remove all orders from an open payment report
const axios = require('axios');
const { base_uri } = require('../config');

module.exports = async (offers) => {
    for (let i = 0; i < offers.length; i++) {
        const offer = offers[i]
        try {
            const response = await axios.patch(`${base_uri}/v1/catalog/products/variants/offers/${offer.offer_id}?context[user_group_id]=1`, {
                quantity: offer.stock
            })
            console.log(response.status, ' | ', offer.offer_id)
        } catch (error) {
            console.log(error.status, ' | ', offer.offer_id, ' --- ERROR ---')
        }
    }
}