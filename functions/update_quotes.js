// remove all orders from an open payment report
const axios = require('axios');
const moment = require('moment')
const { base_uri } = require('../config');
const getToken = require('./auth')

// global variables
// const states_id = [43, 45] //staging
const states_id = [36, 38, 39] // PROD
// const state_validated_by_seller_id = 43 // staging
const state_validated_by_seller_id = 36 // PROD
// const state_expire_quote_id = 50 // staging
const state_expire_quote_id = 45 // PROD

const updateQuotes = async (page = 1) => {
    await getToken()
    try {
        console.log(page)
        const { data: { data: quotes }, data: { meta: pagination } } = await axios.get(`${base_uri}/v1/orders?context[user_group_id]=1&filter[type]=quote&include=state_logs&page=${page}`)
        const filtered_quotes = quotes.filter(quote => {
            return states_id.some(id => id === quote.state_id)
        })
        for (let i = 0; i < filtered_quotes.length; i++) {
            const quote = filtered_quotes[i]
            // get quote validity date value
            const validity_date = quote.additional_information.quote_validity_date.value
            // get the date when the quote has been validated by the seller
            const validated_at = quote.state_logs.data.find(q => q.to_state.data.id === state_validated_by_seller_id) ? quote.state_logs.data.find(q => q.to_state.data.id === state_validated_by_seller_id).created_at : ""
            
            // cancel quote if validity date has passed
            if (validated_at && validity_date) {
                const quote_notifications = quote.additional_information.quote_notifications.value
                if (moment(moment(validated_at).add(validity_date, 'days')).isBefore()) {
                    try {
                        const response = await axios.patch(`${base_uri}/v1/orders/${quote.id}?context[user_group_id]=1`,
                        {
                            state_id: state_expire_quote_id
                        })
                        console.log(response.status, ` ----- quote ${quote.id} expired -----  `)
                    } catch(error) {
                        console.log(error.response.data, ' ----- ERROR EXPIRE----- ', quote.id)
                    }
                }

                // send notification if half of the validity date has passed
                if (!quote_notifications && moment(moment(validated_at).add(validity_date / 2, 'days')).isBefore()) {
                    // console.log(quote.id)
                    // try {
                    //     const response = await axios.patch(`${base_uri}/v1/orders/${quote.id}?context[user_group_id]=1`, {
                    //         additional_information: {
                    //             quote_notifications: '1/2'
                    //         }
                    //     })
                    //     console.log(response.status, ' ----- FIRST NOTIFICATION ----- ', quote.id)
                    // } catch (error) {
                    //     console.log(error, ' ----- ERROR ----- ', quote.id)
                    // }
                }

                // send another notification 72h before expiration
                // const get_notifiable_time = moment(validated_at).subtract(72, 'hours')
                // if (quote_notifications == '1/2' && moment(moment(validated_at).add(get_notifiable_time, 'days')).isBefore()) {
                    // try {
                    //     const response = await axios.patch(`${base_uri}/v1/orders/${quote.id}?context[user_group_id]=1`, {
                    //         additional_information: {
                    //             quote_notifications: '2/2'
                    //         }
                    //     })
                    //     console.log(response.status, ' ----- FIRST NOTIFICATION ----- ', quote.id)
                    // } catch (error) {
                    //     console.log(error, ' ----- ERROR ----- ', quote.id)
                    // }
                // }
            }
        }
        if (pagination.pagination.current_page <= pagination.pagination.total_pages) {
            return updateQuotes(pagination.pagination.current_page + 1)
        }
    } catch (error) {
        console.log(error)
    }
}

updateQuotes()