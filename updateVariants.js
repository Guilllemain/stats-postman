const updateVariants = require('./functions/update_variants')
const getToken = require('./functions/auth')

async function update(seller_id) {
    await getToken()
    await updateVariants(seller_id)
}

update(process.argv[2]) // get the command line argument
