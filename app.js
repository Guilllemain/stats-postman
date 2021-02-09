const Sellers = require('./models/sellers')
const Products = require('./models/products')
const Offers = require('./models/offers')
const Orders = require('./models/orders')
const QuoteToOrder = require('./models/quote_to_order')
const Tickets = require('./models/tickets')
const Reports = require('./models/reports')
const Customers = require('./models/customers')
const Reviews = require('./models/reviews')
const Catalog = require('./models/origami_vendor')
const Feed = require('./models/feeds')

const getToken = require('./functions/auth')
const getData = require('./functions/get_data')
const getOrigamiVendorCatalog = require('./functions/get_origami_vendor_catalog')



async function getFullStats() {
    await getToken()
    // await getOrigamiVendorCatalog(Catalog)
    await getData(Feed)
    await getData(Sellers)
    await getData(Reviews)
    await getData(Orders)
    await getData(Products)
    await getData(Offers)
    await getData(Tickets)
    await getData(Reports)
    await getData(Customers)
}

getFullStats()