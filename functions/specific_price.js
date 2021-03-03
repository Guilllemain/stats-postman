// add specific price rules
const axios = require('axios');
const { base_uri } = require('../config');


const create_specific_price = async (discount_value) => {
    try {
        const response = await axios.post(`${base_uri}/v1/catalog/products/variants/offers/specific_price_rules?context[user_group_id]=1`, {
            impact_on_price_tax_inc: true,
            value_type: 'percentage',
            value: discount_value
        })
        return response.data.data.id
    } catch (error) {
        console.log(error, ' | ', offer_id, ' --- ERROR CREATE SPECIFIC PRICE ---')
    }
}

const add_specific_price = async (offer_id, rule_id) => {
    try {
        const response = await axios.post(`${base_uri}/v1/catalog/products/variants/offers/${offer_id}/specific_price_rules?context[user_group_id]=1`, {
            rules: [
                {
                    id: rule_id
                }
            ]
        })
        console.log(response.status, ' | ', offer_id, ' --- specific price rule added')
    } catch (error) {
        console.log(error, ' | ', offer_id, ' --- ERROR ADD SPECIFIC PRICE ---')
    }
}

const delete_specific_price = async (offer_id, rule_id) => {
    try {
        const response = await axios.delete(`${base_uri}/v1/catalog/products/variants/offers/${offer_id}/specific_price_rules?context[user_group_id]=1`, {
            data : {
                rules: [
                    {
                        id: rule_id
                    }
                ]
            }
        })
        console.log(response.status, ' | ', offer_id, ' --- specific price rule deleted')
    } catch (error) {
        console.log(error.response.data, ' | ', offer_id, ' --- ERROR DELETE SPECIFIC PRICE ---')
    }
}

module.exports = {create_specific_price, add_specific_price, delete_specific_price}