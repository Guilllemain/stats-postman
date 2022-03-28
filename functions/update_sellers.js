const axios = require('axios');
const { base_uri } = require('../config');

const updateSellers = async (sellers) => {
    const response = await axios.get(`${base_uri}/v1/sellers/34?context[user_group_id]=1`)
    const tos = response.data.data.translations.data[0].tos;
    for (let i = 0; i < sellers.length; i++) {
        const seller = sellers[i]
        try {
            const response = await axios.patch(`${base_uri}/v1/sellers/${seller}?context[user_group_id]=1`, {
                translations: [{
                    language_id: 1,
                    tos
                }]
            })
            console.log(response.status, ' | ', seller)
        }
        catch (error) {
            console.log(error, ' | ', seller, ' --- ERROR ---')
        }
    }
}

module.exports = updateSellers