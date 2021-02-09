const addOrdersReport = require('./functions/add_orders_report')
const getToken = require('./functions/auth')

const orders = [3846, 3823, 3806, 3864, 3917, 3790, 3900, 3908, 3997, 4082, 4203, 4100, 4236, 4146, 4216, 4291, 4158, 4210, 4238, 4371, 4315, 4113, 4414, 4432, 4439, 4519, 4306, 4138, 4500, 4107, 4023]


async function add(reportID) {
    await getToken()
    await addOrdersReport(orders, reportID)
}

add(process.argv[2]) // get the command line argument
