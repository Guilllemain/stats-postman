const deleteOffers = require('./functions/delete_offers')
const getToken = require('./functions/auth')

const offers = []

async function delOffers() {
    await getToken()
    await deleteOffers(offers)
}

delOffers()
