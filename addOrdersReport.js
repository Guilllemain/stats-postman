const addOrdersReport = require('./functions/add_orders_report')
const getToken = require('./functions/auth')

const orders = [1440, 925, 913, 1457, 1404, 1113, 923, 1096, 1104, 908, 949, 935, 1081, 943, 910, 937, 1102, 1103, 1063, 932, 920, 912, 924]

async function add(reportID) {
    await getToken()
    await addOrdersReport(orders, reportID)
}

add(process.argv[2]) // get the command line argument
