const updateOffers = require('./functions/update_offers')
const getToken = require('./functions/auth')

const offers = [
  { old_reference: 'TBML123PINK', new_reference: 'TB1360' }, { old_reference: 'TB601355-lot', new_reference: 'TB3415' }, { old_reference: 'TBXS12TEU001-001w', new_reference: 'TB3409' }, { old_reference: 'TBFR0092-001', new_reference: 'TB3528' }, { old_reference: 'TBFR0092-007', new_reference: 'TB3529' }, { old_reference: 'TB5UA1281', new_reference: 'TB3393' }, { old_reference: 'TB5UA1261-1031', new_reference: 'TB3394' }, { old_reference: 'TB54POIGNAGR', new_reference: 'TB3398' }, { old_reference: 'TBT00308-001', new_reference: 'TB3527' }, { old_reference: 'TBT00308-007', new_reference: 'TB3530' }, { old_reference: 'TBADP13N', new_reference: 'TB3141' }, { old_reference: 'TB140243', new_reference: 'TB1260' }, { old_reference: 'TB140418-136', new_reference: 'TB3497' }, { old_reference: 'TB751206-142', new_reference: 'TB3348' }, { old_reference: 'TB283140-NVBL', new_reference: 'TB3438' }, { old_reference: 'TB283140-BKGR', new_reference: 'TB3439' }, { old_reference: 'TB5UA1391-1043', new_reference: 'TB3400' }, { old_reference: 'TB5UA1391-2015', new_reference: 'TB3401' }, { old_reference: 'TB5UA1391-4047', new_reference: 'TB3402' }]

async function update() {
    await getToken()
    await updateOffers(offers)
}

update()
