const { base_uri } = require('../config');
const axios = require('axios')

const detail = async data => {

    try {
        const { data: { data: report} } = await axios.get(`${base_uri}/v1/payments/reports/${data.id}?context[user_group_id]=1&include=seller,order_sellers`)

        const orders = []
        if (report.order_sellers.data.length > 0) {
            report.order_sellers.data.forEach(order => {
                orders.push(order.id)
            })
        }
        orders.join(', ')
        
        return {
            id: report.id,
            start_date: report.start_date,
            end_date: report.end_date,
            status: report.status,
            total_products_tax_exc: report.total_products_tax_exc,
            total_shipping_tax_exc: report.total_shipping_tax_exc,
            total_shipping_tax_inc: report.total_shipping_tax_inc,
            total_tax_exc: report.total_tax_exc,
            total_paid_tax: report.total_paid_tax,
            total_tax_inc: report.total_tax_inc,
            total_fees_amount_tax_exc: report.total_fees_amount_tax_exc,
            total_fees_amount_tax_inc: report.total_fees_amount,
            total_refunds: report.total_refunds,
            total_refunds_fees: report.total_refunds_fees,
            seller: report.seller.data.name,
            orders
        }
    } catch (error) {
        console.log(error)
    }
    
}

const headers = [
    { id: 'id', title: 'ID' },
    { id: 'start_date', title: 'Debut' },
    { id: 'end_date', title: 'Fin' },
    { id: 'status', title: 'Statut' },
    { id: 'total_products_tax_exc', title: 'Produits HT' },
    { id: 'total_shipping_tax_exc', title: 'Livraison HT' },
    { id: 'total_shipping_tax_inc', title: 'Livraison TTC' },
    { id: 'total_tax_exc', title: 'Total HT' },
    { id: 'total_paid_tax', title: 'Total TVA' },
    { id: 'total_tax_inc', title: 'Total TTC' },
    { id: 'total_fees_amount_tax_exc', title: 'Comission HT' },
    { id: 'total_fees_amount_tax_inc', title: 'Comission TTC' },
    { id: 'total_refunds', title: 'Commandes remboursees TTC' },
    { id: 'total_refunds_fees', title: 'Comissions remboursees TTC' },
    { id: 'seller', title: 'Vendeur' },
    { id: 'orders', title: 'Commandes' }
]

const filename = 'reports.csv'

const uri = '/v1/payments/reports?include=""'

module.exports = {
    uri,
    models: [
        {
            detail,
            headers,
            filename,
            final_data: []
        }
    ]
}