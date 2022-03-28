const updateSellers = require('./functions/update_sellers')
const getToken = require('./functions/auth')

async function update() {
    await getToken()
    await updateSellers(sellers)
}

const sellers = [46, 47, 51, 5604, 53, 54, 55, 56, 5543, 5840, 5860, 6542, 6669, 7876, 8141, 8354, 41, 84, 71, 69, 90, 68, 261, 65, 1822, 4045, 2690, 62, 2717, 2756, 83, 3558, 57];

update()
