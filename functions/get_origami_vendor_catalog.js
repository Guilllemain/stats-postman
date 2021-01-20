const axios = require('axios')
const moment = require('moment')
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const uploadToFtp = require('./upload_to_ftp')


moment.locale('fr')

const extractDataFromResponse = (response, data_type, final_data) => {
    response.forEach(data => {
        final_data.push(data_type(data))
    })
}
const getData = async (data, page = 1) => {
    try {
        console.log(page)
        const { data: { products: raw_response }, data: { pagination } } = await axios.get(`${data.uri}&page=${page}`)
        console
        data.models.forEach(model => extractDataFromResponse(raw_response, model.detail, model.final_data))

        if (pagination.page_number < pagination.total_pages) {
            return getData(data, pagination.page_number + 1)
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
        console.error(error)
        if (error.response.status === 401) console.log('You need a new access token')
    }
}

module.exports = getData
