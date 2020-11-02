const nodemailer = require("nodemailer");
const { sendgrid_user, sendgrid_key, sendgrid_host, sendgrid_port, mail_from, mail_to } = require('./config');

module.exports = async function sendMail() {
    const transporter = nodemailer.createTransport({
        host: sendgrid_host,
        port: sendgrid_port,
        secure: true, // true for 465, false for other ports
        auth: {
            user: sendgrid_user,
            pass: sendgrid_key
        }
    });

    const message = await transporter.sendMail({
        from: mail_from,
        to: mail_to,
        subject: 'Statistiques hebdomadaires',
        text: 'Stats',
        html: '<p>Stats</p>',
        attachments: [
            {   // file on disk as an attachment
                path: './stats/sellers.csv' // stream this file
            },
            {
                path: './stats/sellers_reviews.csv'
            },
            {
                path: './stats/orders.csv'
            },
            {
                path: './stats/order_lines.csv'
            },
            {
                path: './stats/products.csv'
            },
            {
                path: './stats/products_reviews.csv'
            },
            {
                path: './stats/tickets.csv'
            },
            {   
                path: './stats/reports.csv'
            },
            {   
                path: './stats/customers.csv'
            },
            {   
                path: './stats/offers.csv'
            }
        ]
    });

    console.log(`Message sent: ${message.messageId}`);
}