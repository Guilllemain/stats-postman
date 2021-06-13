const axios = require('axios')
const { base_uri } = require('./config')
const getToken = require('./functions/auth')

async function runTest() {
    await getToken()
    await getData()
}

const getData = async (page = 1) => {
    try {
        console.log(`<------------- PAGE NUMBER ${page} ---------------->`)
        const { data: { data: raw_response }, data: { meta: pagination } } = await axios.get(`${base_uri}/v1/payments/transactions?context[user_group_id]=1&page=${page}`)
        raw_response.forEach(el => {
            if (el.type == 'DEBIT_AGREEMENT' || el.type == 'SEPA_DIRECT_DEBIT')
            console.log(el.type, ' --- ', el.id)
        });
        if (pagination.pagination.current_page < pagination.pagination.total_pages) {
            return await getData(pagination.pagination.current_page + 1)
        }

    } catch (error) {
        console.error(error)
    }
}

runTest()