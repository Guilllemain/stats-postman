const cleanFinanceReport = require('./functions/clean_finance_report')
const getToken = require('./functions/auth')

async function clean(reportID) {
    await getToken()
    await cleanFinanceReport(reportID)
}

clean(process.argv[2]) // get the command line argument
