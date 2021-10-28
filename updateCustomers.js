const updateCustomers = require('./functions/update_customers')
const getToken = require('./functions/auth')

const customers = [{ id_customer: 1090, account_value: "MD50018888" }, { id_customer: 2899, account_value: "MD50038888" }, {id_customer:2666,account_value:"MD50158888"},{id_customer:654,account_value:"MD50268888"},{id_customer:462,account_value:"MD50388888"},{id_customer:3005,account_value:"MD50428888"},{id_customer:581,account_value:"MD50438888"},{id_customer:228,account_value:"MD50698888"},{id_customer:640,account_value:"MD50738888"},{id_customer:639,account_value:"MD50748888"},{id_customer:2545,account_value:"MD51258888"},{id_customer:2547,account_value:"MD51398888"},{id_customer:2043,account_value:"MD51588888"},{id_customer:2546,account_value:"MD51708888"},{id_customer:2549,account_value:"MD51898888"},{id_customer:2548,account_value:"MD51908888"},{id_customer:1657,account_value:"MD52228888"},{id_customer:4418,account_value:"MD52358888"},{id_customer:4554,account_value:"MD52568888"},{id_customer:2741,account_value:"MD53188888"},{id_customer:1157,account_value:"MD53288888"},{id_customer:4392,account_value:"MD53368888"},{id_customer:2045,account_value:"MD53378888"},{id_customer:3941,account_value:"MD53418888"},{id_customer:3179,account_value:"MD53458888"},{id_customer:1904,account_value:"MD55088888"},{id_customer:3034,account_value:"MD55108888"},{id_customer:3337,account_value:"MD55518888"},{id_customer:3336,account_value:"MD55528888"},{id_customer:2990,account_value:"MD55548888"},{id_customer:1316,account_value:"MD55558888"},{id_customer:1396,account_value:"MD55578888"},{id_customer:2709,account_value:"MD55678888"},{id_customer:1941,account_value:"MD55688888"},{id_customer:1717,account_value:"MD55888888"},{id_customer:5779,account_value:"MD56028888"},{id_customer:1530,account_value:"MD56608888"},{id_customer:3662,account_value:"MD56628888"},{id_customer:4709,account_value:"MD56808888"},{id_customer:128,account_value:"MD57758888"},{id_customer:3862,account_value:"MD57778888"},{id_customer:732,account_value:"MD57788888"},{id_customer:1159,account_value:"MD57918888"},{id_customer:4310,account_value:"MD57928888"},{id_customer:3969,account_value:"MD57938888"},{id_customer:2292,account_value:"MD57948888"},{id_customer:1177,account_value:"MD57958888"},{id_customer:1287,account_value:"MD58148888"},{id_customer:1288,account_value:"MD58278888"},{id_customer:5546,account_value:"MD58508888"},{id_customer:160,account_value:"MD58618888"},{id_customer:1289,account_value:"MD58768888"},{id_customer:742,account_value:"MD59168888"},{id_customer:767,account_value:"MD59178888"},{id_customer:684,account_value:"MD59238888"},{id_customer:1139,account_value:"MD59248888"},{id_customer:726,account_value:"MD59338888"},{id_customer:652,account_value:"MD59408888"},{id_customer:730,account_value:"MD59478888"},{id_customer:748,account_value:"MD59648888"},{id_customer:1377,account_value:"MD59798888"},{id_customer:1277,account_value:"MD59868888"},{id_customer:1872,account_value:"MD60098888"},{id_customer:433,account_value:"MD60118888"},{id_customer:1716,account_value:"MD60128888"},{id_customer:2431,account_value:"MD60308888"},{id_customer:1847,account_value:"MD60318888"},{id_customer:660,account_value:"MD60328888"},{id_customer:3818,account_value:"MD60348888"},{id_customer:662,account_value:"MD60468888"},{id_customer:3309,account_value:"MD60488888"},{id_customer:661,account_value:"MD60658888"},{id_customer:3403,account_value:"MD60668888"},{id_customer:3988,account_value:"MD60818888"},{id_customer:663,account_value:"MD60828888"},{id_customer:1785,account_value:"MD61728888"},{id_customer:1026,account_value:"MD61858888"},{id_customer:608,account_value:"MD62048888"},{id_customer:2928,account_value:"MD62058888"},{id_customer:405,account_value:"MD62138888"},{id_customer:876,account_value:"MD62838888"},{id_customer:5461,account_value:"MD62848888"},{id_customer:1321,account_value:"LI50AUVERG"},{id_customer:2550,account_value:"LI51BOURGO"},{id_customer:3142,account_value:"LI52BRETAG"},{id_customer:2802,account_value:"LI53CENTRE"},{id_customer:1030,account_value:"LI54CORSE."},{id_customer:796,account_value:"LI55GRAND."},{id_customer:777,account_value:"LI56HAUTS."},{id_customer:2196,account_value:"LI57ILE.DE"},{id_customer:1291,account_value:"LI58NORMAN"},{id_customer:727,account_value:"LI59NOUVEL"},{id_customer:112,account_value:"LI60OCCITA"},{id_customer:656,account_value:"LI61PAYS.D"},{id_customer:120,account_value:"LI62PROVEN"},{id_customer:6050,account_value:"LI63GUADEL"},{id_customer:1020,account_value:"LI64GUYANE"},{id_customer:4222,account_value:"LI65MARTIN"},{id_customer:1485,account_value:"LI66NOUVEL"},{id_customer:5095,account_value:"LI67REUNIO"}]

async function update() {
    await getToken()
    await updateCustomers(customers)
}

update() // get the command line argument