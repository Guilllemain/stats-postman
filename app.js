const http = require('http');
const axios = require('axios');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const { base_uri } = require('./config');

const Sellers = require('./models/sellers')
const Products = require('./models/products')
const Orders = require('./models/orders')
const OrderLines = require('./models/orderLines')
const Tickets = require('./models/tickets')
const Reports = require('./models/reports')
const Customers = require('./models/customers')
const SellersReviews = require('./models/sellers_reviews')
const ProductsReviews = require('./models/products_reviews')
const ExtremeTennis = require('./models/extreme_tennis')

const sendMail = require('./mail')

const cleanFinanceReport = require('./functions/clean_finance_report')
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
        final_data['stop_extract'] = false
        const { data: { data: raw_response }, data: { meta: pagination } } = await axios.get(`${base_uri}${uri}&context[user_group_id]=1&page=${page}`)
        extractDataFromResponse(raw_response, data_type, final_data, period)
        console.log(final_data['stop_extract'])
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
    // try { 
    //     await axios.post(`${ base_uri }/v1/catalog/products?context[user_group_id]=1`, {
    //     reference: 1920055,
    //     ean13: "",
    //     translations: [{
    //         language_id: 1,
    //         name: 'Cordage Solinco Tour Bite 12m',
    //         description: '',
    //         description_short: ''
    //     }],
    //     features: [
    //         {
    //             feature_type_id: 47,
    //             is_custom: 0,
    //             translations: [
    //                     {
    //                         locale: 'fr',
    //                         default: false,
    //                         language_id: 1,
    //                         value: 'Junior'
    //                     }
    //                 ]
    //         }
    //     ]
    //     })
    //  }
    // catch (error) {
    //     console.log(error)
    // }
    await getToken()
    // await getData(Sellers.uri, Sellers.filename, Sellers.headers, Sellers.detail)
    // await getData(SellersReviews.uri, SellersReviews.filename, SellersReviews.headers, SellersReviews.detail)
    await getData(Orders.uri, Orders.filename, Orders.headers, Orders.detail)
    // await getData(OrderLines.uri, OrderLines.filename, OrderLines.headers, OrderLines.detail)
    // await getData(Products.uri, Products.filename, Products.headers, Products.detail)
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


const rewriteDescription = async(page = 1) => {
    try {
        await getToken()
        console.log(page)
        const { data: { data: response }, data: { meta: pagination } } = await axios.get(`${base_uri}/v1/catalog/products/variants/offers?context[user_group_id]=1&include=product&filter[seller_id]=2717&page=${page}`)
        response.forEach(async offer => {
            if (offer.product.data.translations.data[0].description && offer.product.data.translations.data[0].description.toLowerCase().includes('<h3>notre test')) {
                console.log(offer.product_id)
                const formattedDescription = offer.product.data.translations.data[0].description.substring(0, offer.product.data.translations.data[0].description.toLowerCase().indexOf(`<h3>notre test`))
                console.log(formattedDescription)
                try {
                    await axios.patch(`${base_uri}/v1/catalog/products/${offer.product_id}?context[user_group_id]=1`, {
                        translations: [{
                            language_id: 1,
                            name: offer.product.data.translations.data[0].name,
                            description: formattedDescription,
                        }],
                    })
                } catch (error) {
                    console.log(error.response.data)
                }
            }
        })
        if (pagination.pagination.current_page <= pagination.pagination.total_pages) {
            return rewriteDescription(pagination.pagination.current_page + 1)
        }
        // const raw = response.translations.data[0].description.substring(0, response.translations.data[0].description.toLowerCase().indexOf(`<h2><b>notre test`))
        // console.log(raw)        
    }
    catch (error) {
        console.log(error)
    }
}

rewriteDescription()


// desactivate Wilson, occasion and products without images
const desactivateProducts = async(page = 39) => {
    try {
        await getToken()
        console.log(page)
        const { data: { data: response }, data: { meta: pagination }  } = await axios.get(`${base_uri}/v1/catalog/products/variants/offers?context[user_group_id]=1&include=product&filter[seller_id]=2717&page=${page}`)
        response.forEach(async offer => {
            if (offer.product.data.state_id === 3) {
            // if ((!offer.product.data.image_default || offer.product.data.translations.data[0].name.toLowerCase().includes('wilson') || offer.product.data.translations.data[0].name.toLowerCase().includes('occasion')) && offer.product.data.state_id !== 4) {
                console.log(offer.product.data.id, offer.product.data.translations.data[0].name)
                try {
                    await axios.patch(`${base_uri}/v1/catalog/products/${offer.product.data.id}?context[user_group_id]=1`, {
                    state_id: 2
                })
                } catch (error) {
                    console.log(error)
                }
            }
        })
        if (pagination.pagination.current_page <= pagination.pagination.total_pages) {
            return desactivateProducts(pagination.pagination.current_page + 1)
        }
    }
    catch (error) {
        console.log(error)
    }
}

// desactivateProducts()

// const fetch = require("node-fetch");
// async function getExtremeTennisCatalog(filename, headers, data_type, page = 1, final_data = []) {
//     const response = await fetch(`https://www.extreme-tennis.fr/fr/module/origamivendor/api?key=STXLG5KO4MQ6D1L4333S0NLR0XSPGYXK&method=catalog&page=${page}`)
//     if (response.ok) { 
//         const { products, pagination } = await response.json();
//         products.forEach(product => {
//             final_data.push(data_type(product))
//         })

//         if (pagination.page_number < pagination.total_pages) {
//             console.log(pagination.page_number )
//             return getExtremeTennisCatalog(filename, headers, data_type, pagination.page_number + 1, final_data)
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

// getExtremeTennisCatalog(ExtremeTennis.filename, ExtremeTennis.headers, ExtremeTennis.detail)


// desactivate Wilson, occasion and products without images
const addFeature = async (page = 1) => {
    try {
        await getToken()
        console.log(page)
        const { data: { data: response }, data: { meta: pagination } } = await axios.get(`${base_uri}/v1/catalog/products/variants/offers?context[user_group_id]=1&include=product.features&filter[seller_id]=90&page=${page}`)
        response.forEach(async offer => {
            if (offer.product.data.features.data.some(feature => feature.feature_type_id === 28)) {
                try {
                    await axios.patch(`${base_uri}/v1/catalog/products/${offer.product_id}?context[user_group_id]=1`, {
                        features: [
                            {
                                feature_type_id: 28,
                                feature_value_id: 1686,
                                is_custom: 0
                            }
                        ]
                    })
                } catch (error) {
                    console.log(error)
                }
            }
        })
        if (pagination.pagination.current_page <= pagination.pagination.total_pages) {
            return addFeature(pagination.pagination.current_page + 1)
        }
    }
    catch (error) {
        console.log(error)
    }
}

// addFeature()