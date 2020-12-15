// remove all orders from an open payment report
const axios = require('axios');
const { base_uri } = require('../config');

module.exports = async (report_id) => {
    try {
        const { data: { data: report } } = await axios.get(`${base_uri}/v1/payments/reports/${report_id}?include=order_sellers&context[user_group_id]=1`)
        if (report.status === 'close') return // stop the process if the payment report is closed
        for (let i = 0; i < report.order_sellers.data.length; i++) {
            const order = report.order_sellers.data[i]
            console.log(order.id)
            try {
                await axios.post(`${base_uri}/v1/payments/reports/${report_id}/order/${order.id}/remove?context[user_group_id]=1`)
            } catch (error) {
                console.log(error.status)
            }
        }
    } catch (error) {
        console.error(error)
        if (error.response.status === 401) console.log('You need a new access token')
    }
    
}