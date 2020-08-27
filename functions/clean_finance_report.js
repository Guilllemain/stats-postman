// remove all orders from an open payment report
const axios = require('axios');

module.exports = async (base_uri, report_id) => {
    try {
        const { data: { data: response } } = await axios.get(`${base_uri}/v1/payments/reports/${report_id}?include=order_sellers&context[user_group_id]=1`)
        if (response.status === 'close') return // stop the process if the payment report is closed
        response.order_sellers.data.forEach(async order => {
            console.log(order)
            await axios.post(`${base_uri}/v1/payments/reports/${report_id}/order/${order.id}/remove?context[user_group_id]=1`)
        })
    } catch (error) {
        console.error(error)
        if (error.response.status === 401) console.log('You need a new access token')
    }
}