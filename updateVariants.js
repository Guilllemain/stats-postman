const updateVariants = require('./functions/update_variants')
const getToken = require('./functions/auth')

async function update() {
    await getToken()
    await updateVariants()
}

update() // get the command line argument
