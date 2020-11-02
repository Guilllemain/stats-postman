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
    sendgrid_user: process.env.SENDGRID_USER,
    sendgrid_key: process.env.SENDGRID_KEY,
    sendgrid_port: process.env.SENDGRID_PORT,
    sendgrid_host: process.env.SENDGRID_HOST,
    mail_from: process.env.MAIL_FROM,
    mail_to: process.env.MAIL_TO,
    promotennis_url: process.env.PROMOTENNIS_URL
};