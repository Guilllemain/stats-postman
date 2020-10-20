const addOrdersReport = require('./functions/add_orders_report')
const getToken = require('./functions/auth')

const orders = [2862, 3282, 3180, 3308, 2810, 2842, 3090, 2960, 2801, 2984, 2961, 3182, 3018, 3008, 2639, 2880, 3095, 2871]

async function add(reportID) {
    await getToken()
    await addOrdersReport(orders, reportID)
}

add(process.argv[2]) // get the command line argument
