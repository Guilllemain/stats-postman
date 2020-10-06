// remove all orders from an open payment report
const axios = require('axios');
const { base_uri } = require('../config');

module.exports = async (orders, report_id) => {
    try {
        orders.forEach(order => {
            console.log(order)
            axios.post(`${base_uri}/v1/payments/reports/${report_id}/order/${order}/add?context[user_group_id]=1`)
        })
    } catch (error) {
        console.error(error)
        if (error.response.status === 401) console.log('You need a new access token')
    }
}