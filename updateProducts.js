const updateProducts = require('./functions/update_products')
const getToken = require('./functions/auth')

async function update() {
    await getToken()
    await updateProducts(products)
}

const products = []

update()
