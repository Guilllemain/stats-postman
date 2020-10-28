// remove all orders from an open payment report
const axios = require('axios');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const { base_uri } = require('../config');

const filename = 'products_without_description.csv'
const products_ID = []

const check_descriptions = async (page = 1) => {
    try {
        console.log(page)
        const { data: { data: products }, data: { meta: pagination } } = await axios.get(`${base_uri}/v1/catalog/products?context[user_group_id]=1&page=${page}`)
        const results = products.filter(product => !product.translations.data[0].description && !product.translations.data[0].description_short)
        products_ID.push(results.map(result => {
            return {id: result.id}}))
        console.log(products_ID)
        if (pagination.pagination.current_page <= pagination.pagination.total_pages) {
            return check_descriptions(pagination.pagination.current_page + 1)
        }
    } catch (error) {
        console.error(error)
    }
    createCsvWriter({
        path: `./stats/${filename}`,
        fieldDelimiter: ';',
        header: [{ id: 'id', title: 'product ID' }]
    })
        .writeRecords(products_ID.flat())
        .then(() => console.log(`The file ${filename} was written successfully`));
}


exports.check_descriptions = check_descriptions