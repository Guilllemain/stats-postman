const axios = require('axios')
const moment = require('moment')
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const { base_uri } = require('../config');

moment.locale('fr')

const extractDataFromResponse = (response, data_type, final_data, period) => {
    response.forEach(data => {
        if (period && (moment(data.date_order) < moment().subtract(15, 'days').startOf('day'))) {
            final_data['stop_extract'] = true
            return
        }
        final_data.push(data_type(data))
    })
}

const getData = async (uri, filename = 'response.csv', headers, data_type, period = false, page = 1, final_data = []) => {
    try {
        console.log(page)
        final_data['stop_extract'] = false
        const { data: { data: raw_response }, data: { meta: pagination } } = await axios.get(`${base_uri}${uri}&context[user_group_id]=1&page=${page}`)
        extractDataFromResponse(raw_response, data_type, final_data, period)
        if (pagination.pagination.current_page <= pagination.pagination.total_pages && final_data['stop_extract'] === false) {
            return getData(uri, filename, headers, data_type, period, pagination.pagination.current_page + 1, final_data)
        }
        createCsvWriter({
            path: `./stats/${filename}`,
            fieldDelimiter: ';',
            header: headers
        })
            .writeRecords(final_data.flat())
            .then(() => console.log(`The file ${filename} was written successfully`));
    } catch (error) {
        console.error(error)
        if (error.response.status === 401) console.log('You need a new access token')
    }
}

module.exports = getData
