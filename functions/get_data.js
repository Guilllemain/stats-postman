const axios = require('axios')
const moment = require('moment')
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const { base_uri } = require('../config');
const uploadToFtp = require('./upload_to_ftp')


moment.locale('fr')

const extractDataFromResponse = (response, data_type, final_data, period) => {
    response.forEach(data => {
        final_data.push(data_type(data))
    })
}
const getData = async (data, page = 1) => {
    try {
        console.log(page)
        const { data: { data: raw_response }, data: { meta: pagination } } = await axios.get(`${base_uri}${data.uri}&context[user_group_id]=1&page=${page}`)
        
        data.models.forEach(model => extractDataFromResponse(raw_response, model.detail, model.final_data))
        if (pagination.pagination.current_page <= pagination.pagination.total_pages) {
            return getData(data, pagination.pagination.current_page + 1)
        }
        
        data.models.forEach(model => {
            createCsvWriter({
                path: `./${model.filename}`,
                fieldDelimiter: ';',
                header: model.headers
            })
            .writeRecords(model.final_data.flat())
            .then(() => console.log(`The file ${model.filename} was written successfully`));
        })

        uploadToFtp(data.models)

    } catch (error) {
        console.error(error)
        if (error.response.status === 401) console.log('You need a new access token')
    }
}

module.exports = getData
