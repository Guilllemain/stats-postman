const ftp = require("basic-ftp")
const { ftp_host, ftp_user, ftp_password } = require('../config')

module.exports = async (models) => {
    const client = new ftp.Client()
    client.ftp.verbose = true
    try {
        await client.access({
            host: ftp_host,
            user: ftp_user,
            password: ftp_password,
            secure: false
        })
        await client.ensureDir("stats")
        for (let i = 0; i < models.length; i++) {
            await client.uploadFrom(`./${models[i].filename}`, models[i].filename)
        }
    }
    catch (err) {
        console.log(err)
    }
    client.close()
}