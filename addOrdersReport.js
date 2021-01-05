const addOrdersReport = require('./functions/add_orders_report')
const getToken = require('./functions/auth')

const orders = []


async function add(reportID) {
    await getToken()
    await addOrdersReport(orders, reportID)
}

add(process.argv[2]) // get the command line argument
