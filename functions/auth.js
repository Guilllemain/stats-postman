const axios = require('axios');
const { base_uri, grant_type, username, password, client_id, client_secret } = require('../config');


module.exports = async () => {
    try {
        const { data } = await axios.post(`${base_uri}/oauth/token`, {
            grant_type,
            username,
            password,
            client_id,
            client_secret
        })
        axios.defaults.headers.common = { 'Authorization': `Bearer ${data.access_token}` }
    } catch (error) {
        console.error(error)
    }
}