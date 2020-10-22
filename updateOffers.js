const updateOffers = require('./functions/update_offers')
const getToken = require('./functions/auth')

const offers = []

async function update() {
    await getToken()
    await updateOffers.update_offers(offers)
}

update()
