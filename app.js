const http = require('http');

const Sellers = require('./models/sellers')
const Products = require('./models/products')
const Offers = require('./models/offers')
const Orders = require('./models/orders')
const OrderLines = require('./models/orderLines')
const QuoteToOrder = require('./models/quote_to_order')
const Tickets = require('./models/tickets')
const Reports = require('./models/reports')
const Customers = require('./models/customers')
const SellersReviews = require('./models/sellers_reviews')
const ProductsReviews = require('./models/products_reviews')
const OrigamiVendor = require('./models/origami_vendor')
const updateOrigamiVendorCatalog = require('./functions/update_origami_vendor_catalog_offers')

const sendMail = require('./mail')

const getToken = require('./functions/auth')
const getData = require('./functions/get_data')


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


async function getFullStats() {
    await getToken()
    await getData(Sellers.uri, Sellers.filename, Sellers.headers, Sellers.detail)
    await getData(SellersReviews.uri, SellersReviews.filename, SellersReviews.headers, SellersReviews.detail)
    await getData(Orders.uri, Orders.filename, Orders.headers, Orders.detail)
    await getData(OrderLines.uri, OrderLines.filename, OrderLines.headers, OrderLines.detail)
    await getData(QuoteToOrder.uri, QuoteToOrder.filename, QuoteToOrder.headers, QuoteToOrder.detail)
    await getData(Products.uri, Products.filename, Products.headers, Products.detail)
    await getData(Offers.uri, Offers.filename, Offers.headers, Offers.detail)
    await getData(ProductsReviews.uri, ProductsReviews.filename, ProductsReviews.headers, ProductsReviews.detail)
    await getData(Tickets.uri, Tickets.filename, Tickets.headers, Tickets.detail)
    await getData(Reports.uri, Reports.filename, Reports.headers, Reports.detail)
    await getData(Customers.uri, Customers.filename, Customers.headers, Customers.detail)
    await sendMail().catch(console.error);
    server.close(() => {
        console.log('Http server closed.');
    });
}

getFullStats()

// updateOrigamiVendorCatalog()
