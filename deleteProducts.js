const deleteProducts = require('./functions/delete_products')
const getToken = require('./functions/auth')

async function deleteProductsFromSeller(seller_id) {
    await getToken()
    await deleteProducts.deleteETproducts(seller_id)
}

deleteProductsFromSeller(2717)
