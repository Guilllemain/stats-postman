const axios = require('axios')
const moment = require('moment')
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const { base_uri } = require('../config');
const uploadToFtp = require('./upload_to_ftp')


moment.locale('fr')

const extractDataFromResponse = async (response, data_type, final_data) => {
    for (let i = 0; i < response.length; i++) {
        try {
            product = await data_type(response[i])
            if (product) {
                final_data.push(product)
            }
        } catch(error) {
            console.log(error)
        }
    }
}
const getData = async (data, page = 1) => {
    try {
        console.log(`<------------- PAGE NUMBER ${page} ---------------->`)
        const { data: { data: raw_response }, data: { meta: pagination } } = await axios.get(`${base_uri}${data.uri}&context[user_group_id]=1&page=${page}`)
        // loop through models to extract data
        for (let i = 0; i < data.models.length; i++) {
            await extractDataFromResponse(raw_response, data.models[i].detail, data.models[i].final_data)
        }
        
        if (pagination && pagination.pagination.current_page < pagination.pagination.total_pages) {
            return await getData(data, pagination.pagination.current_page + 1)
        }
        data.models.forEach(model => {
            createCsvWriter({
                path: `./stats/${model.filename}`,
                fieldDelimiter: ';',
                header: model.headers
            })
            .writeRecords(model.final_data.flat())
            .then(() => console.log(`The file ${model.filename} was written successfully`));
        })

        uploadToFtp(data.models)

    } catch (error) {
        console.error(error.response)
        console.log(error.response.data.errors)
        if (error.response.status === 401) console.log('You need a new access token')
    }
}

module.exports = getData
