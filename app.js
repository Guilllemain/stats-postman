const http = require('http');
const axios = require('axios');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const { base_uri, promotennis_url } = require('./config');

const Sellers = require('./models/sellers')
const Products = require('./models/products')
const Offers = require('./models/offers')
const Orders = require('./models/orders')
const OrderLines = require('./models/orderLines')
const Tickets = require('./models/tickets')
const Reports = require('./models/reports')
const Customers = require('./models/customers')
const SellersReviews = require('./models/sellers_reviews')
const ProductsReviews = require('./models/products_reviews')
const OrigamiVendor = require('./models/origami_vendor')

const sendMail = require('./mail')

const getToken = require('./functions/auth')
const moment = require('moment');


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

async function getFullStats() {
    await getToken()
    // await getData(Sellers.uri, Sellers.filename, Sellers.headers, Sellers.detail)
    // await getData(SellersReviews.uri, SellersReviews.filename, SellersReviews.headers, SellersReviews.detail)
    // await getData(Orders.uri, Orders.filename, Orders.headers, Orders.detail)
    // await getData(OrderLines.uri, OrderLines.filename, OrderLines.headers, OrderLines.detail)
    // await getData(Products.uri, Products.filename, Products.headers, Products.detail)
    await getData(Offers.uri, Offers.filename, Offers.headers, Offers.detail)
    // await getData(ProductsReviews.uri, ProductsReviews.filename, ProductsReviews.headers, ProductsReviews.detail)
    // await getData(Tickets.uri, Tickets.filename, Tickets.headers, Tickets.detail)
    // await getData(Reports.uri, Reports.filename, Reports.headers, Reports.detail)
    // await getData(Customers.uri, Customers.filename, Customers.headers, Customers.detail)
    // await sendMail().catch(console.error);
    server.close(() => {
        console.log('Http server closed.');
    });
}

// getFullStats()


const fetch = require("node-fetch");
// async function getOrigamiVendorCatalog(filename, headers, data_type, page = 1, final_data = []) {
//     const response = await fetch(`http://www.promo-tennis.com/module/origamivendor/api?key=HGAFZEXM2F94DJ8CJP0GDTCASV7WHXT4CXOR647A4G1HQNAS1JUCYF1602078778&method=catalog&page=${page}`)
//     if (response.ok) {
//         const { products, pagination } = await response.json();
//         products.forEach(product => {
//             final_data.push(data_type(product))
//         })

//         if (pagination.page_number < pagination.total_pages) {
//             console.log(pagination.page_number)
//             return getOrigamiVendorCatalog(filename, headers, data_type, pagination.page_number + 1, final_data)
//         }

//         createCsvWriter({
//             path: `./stats/${filename}`,
//             fieldDelimiter: ';',
//             header: headers
//         })
//             .writeRecords(final_data.flat())
//             .then(() => console.log(`The file ${filename} was written successfully`));
//     } else {
//         console.log("HTTP-Error: " + response.status);
//     }
//     server.close(() => {
//         console.log('Http server closed.');
//     });
// }
const updated_offers = []
async function getOrigamiVendorCatalog(filename, headers, data_type, page = 1, final_data = []) {
    const response = await fetch(`${promotennis_url}&page=${page}`)
    if (response.ok) {
        const { products, pagination } = await response.json();
        const active_products = products.filter(product => product.image_default)
        const offers = active_products.map(product => {
            if (product.variants.length === 0) {
                return {
                    id: product.id,
                    reference: product.reference,
                    quantity: product.quantity,
                    price_tax_exc: product.price_tax_exc,
                    old_price_tax_exc: product.old_price_tax_exc,
                    price_tax_inc: product.price_tax_inc,
                    old_price_tax_inc: product.old_price_tax_inc,
                }
            } else {
                return Object.keys(product.variants).map(variant => {
                    return {
                        id: product.variants[variant].id_variant,
                        reference: product.variants[variant].reference,
                        quantity: product.variants[variant].quantity,
                        price_tax_exc: product.variants[variant].price_tax_exc,
                        old_price_tax_exc: product.variants[variant].old_price_tax_exc,
                        price_tax_inc: product.variants[variant].price_tax_inc,
                        old_price_tax_inc: product.variants[variant].old_price_tax_inc,
                    }
                })
            }
        })
        updated_offers.push(offers.flat())
        // products.forEach(product => {
        //     final_data.push(data_type(product))
        // })

        if (pagination.page_number < pagination.total_pages) {
            console.log(pagination.page_number)
            return getOrigamiVendorCatalog(filename, headers, data_type, pagination.page_number + 1, final_data)
        }

        // createCsvWriter({
        //     path: `./stats/${filename}`,
        //     fieldDelimiter: ';',
        //     header: headers
        // })
        //     .writeRecords(final_data.flat())
        //     .then(() => console.log(`The file ${filename} was written successfully`));
    } else {
        console.log("HTTP-Error: " + response.status);
    }
    console.log(updated_offers.flat()) // 2157 offers

    server.close(() => {
        console.log('Http server closed.');
    });
}

getOrigamiVendorCatalog('tiebreak.csv', OrigamiVendor.headers, OrigamiVendor.detail)
