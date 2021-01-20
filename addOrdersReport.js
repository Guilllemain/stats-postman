const addOrdersReport = require('./functions/add_orders_report')
const getToken = require('./functions/auth')

const orders = [2448, 795, 1575, 1565, 1698, 1572, 1681, 1676, 1726, 1802, 1667, 1870, 1844, 1863, 1134, 1705, 2423, 2373, 2536, 2694, 1860, 2478, 2893, 2483, 2262, 3031, 2751, 2948, 3007, 3072, 3292, 3261, 2731, 3218, 3244, 3255, 3252, 2755, 3298, 3495, 3488, 3202, 3411, 3232, 3311, 3491, 3469, 2971, 3406, 3436, 3651, 2634, 2549, 3396, 2944, 3622, 3143, 3357, 3124, 2932, 2742, 3746, 3208, 3107, 3203, 3020, 3515, 3718, 3687, 3529, 3554, 3550, 3541, 3774, 3787, 3780, 3756, 3837, 3733, 3673, 3564, 3269, 449, 510, 547]


async function add(reportID) {
    await getToken()
    await addOrdersReport(orders, reportID)
}

add(process.argv[2]) // get the command line argument
