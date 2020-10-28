const checkProducts = require('./functions/check_catalog')
const getToken = require('./functions/auth')

async function checkCatalog() {
    await getToken()
    await checkProducts.check_descriptions()
}

checkCatalog()
