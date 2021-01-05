// remove all orders from an open payment report
const axios = require('axios');
const { base_uri } = require('../config');

module.exports = async (orders, report_id) => {
    for (let i = 0; i < orders.length; i++) {
        try {
            const response = await axios.post(`${base_uri}/v1/payments/reports/${report_id}/order/${orders[i]}/add?context[user_group_id]=1`)
            console.log(`${response.status} --- ${orders[i]}`)
        } catch (error) {
            console.error(error)
            if (error.response.status === 401) console.log('You need a new access token')
        }
    }
}