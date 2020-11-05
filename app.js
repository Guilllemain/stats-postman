const http = require('http');

const Sellers = require('./models/sellers')
const Products = require('./models/products')
const Offers = require('./models/offers')
const Orders = require('./models/orders')
const QuoteToOrder = require('./models/quote_to_order')
const Tickets = require('./models/tickets')
const Reports = require('./models/reports')
const Customers = require('./models/customers')
const Reviews = require('./models/reviews')

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
    await getData(Sellers)
    await getData(Reviews)
    await getData(Orders)
    await getData(Products)
    await getData(Offers)
    await getData(Tickets)
    await getData(Reports)
    await getData(Customers)
    server.close(() => {
        console.log('Http server closed.');
    });
}

getFullStats()