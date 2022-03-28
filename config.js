const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    base_uri: process.env.BASE_URI,
    access_token: process.env.ACCESS_TOKEN,
    grant_type: process.env.GRANT_TYPE,
    username: process.env.USERNAME,
    password: process.env.PASSWORD,
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    sendgrid_api_key: process.env.SENDGRID_API_KEY,
    mail_from: process.env.MAIL_FROM,
    mail_to: process.env.MAIL_TO,
    HlSportUrl: process.env.HLSPORT_URL,
    extremeTennisUrl: process.env.EXTREME_TENNIS_URL,
    tennisCompagnie: process.env.TENNIS_COMPAGNIE,
    casalUrl: process.env.CASAL_URL,
    ftp_host: process.env.FTP_HOST,
    ftp_user: process.env.FTP_USER,
    ftp_password: process.env.FTP_PASSWORD
};