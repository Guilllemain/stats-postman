const http = require('http');
const axios = require('axios');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const { base_uri, access_token, grant_type, username, password, client_id, client_secret } = require('./config');

const Sellers = require('./models/sellers')
const Products = require('./models/products')
const Orders = require('./models/orders')
const OrderLines = require('./models/orderLines')
const Tickets = require('./models/tickets')
const Reports = require('./models/reports')
const Customers = require('./models/customers')
const SellersReviews = require('./models/sellers_reviews')
const ProductsReviews = require('./models/products_reviews')

const sendMail = require('./mail')


const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Hello World');
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});

axios.defaults.headers.common = { 'Authorization': `Bearer ${access_token}` }

const getToken = async() => {
    try {
        const { data } = await axios.post(`${base_uri}/oauth/token`, {
            grant_type,
            username,
            password,
            client_id,
            client_secret
        })
        axios.defaults.headers.common = { 'Authorization': `Bearer ${data.access_token}` }
    } catch(error) {
        console.error(error)
    }
}

const extractDataFromResponse = (response, data_type, variable_name, nested = false) => {
    response.forEach(data => {
        variable_name.push(data_type(data))
    })
}

const getData = async (uri, filename = 'response.csv', headers, data_type, page = 1, final_data = []) => {
    try {
        const { data: { data: raw_response }, data: { meta: pagination } } = await axios.get(`${base_uri}${uri}&context[user_group_id]=1&page=${page}`)
        extractDataFromResponse(raw_response, data_type, final_data)
        if (pagination.pagination.current_page <= pagination.pagination.total_pages) {
            return getData(uri, filename, headers, data_type, pagination.pagination.current_page + 1, final_data)
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
    }
}

async function getFullStats () {
    // await getData(Sellers.uri, Sellers.filename, Sellers.headers, Sellers.detail)
    // await getData(SellersReviews.uri, SellersReviews.filename, SellersReviews.headers, SellersReviews.detail)
    // await getData(Orders.uri, Orders.filename, Orders.headers, Orders.detail)
    // await getData(OrderLines.uri, OrderLines.filename, OrderLines.headers, OrderLines.detail)
    // await getData(Products.uri, Products.filename, Products.headers, Products.detail)
    // await getData(ProductsReviews.uri, ProductsReviews.filename, ProductsReviews.headers, ProductsReviews.detail)
    await getData(Tickets.uri, Tickets.filename, Tickets.headers, Tickets.detail)
    // await getData(Reports.uri, Reports.filename, Reports.headers, Reports.detail)
    // await getData(Customers.uri, Customers.filename, Customers.headers, Customers.detail)
    // await sendMail().catch(console.error);
    server.close(() => {
        console.log('Http server closed.');
    });
}

getFullStats()
