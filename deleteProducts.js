const deleteProducts = require('./functions/delete_products')
const getToken = require('./functions/auth')

async function deleteProductsFromSeller() {
    await getToken()
    await deleteProducts.deleteProducts(2717)
}

deleteProductsFromSeller()
