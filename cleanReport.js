const cleanFinanceReport = require('./functions/clean_finance_report')
const getToken = require('./functions/auth')

async function clean(reportID) {
    getToken()
    cleanFinanceReport(reportID)
}
