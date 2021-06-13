const axios = require('axios');
const { base_uri } = require('../config');

const updateCustomers = async (customers) => {
    for (let i = 0; i < customers.length; i++) {
        const customer = customers[i]
        try {
            const response = await axios.patch(`${base_uri}/v1/customers/${customer.id_customer}?context[user_group_id]=1`, {
                additional_information: {
                    club_code: customer.account_value
                }
            })
            console.log(response.status, ' | ', customer.id_customer)
        }
        catch (error) {
            console.log(error.status, ' | ', customer.id_customer, ' --- ERROR ---')
        }
    }
}

module.exports = updateCustomers