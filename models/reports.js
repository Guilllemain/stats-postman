const detail = data => {
    const orders = []
    if (data.order_sellers.data.length > 0) {
        data.order_sellers.data.forEach(order => {
            orders.push(order.reference)
        })
    }
    orders.join(', ')
    return {
        id: data.id,
        start_date: data.start_date,
        end_date: data.end_date,
        status: data.status,
        total_products_tax_exc: data.total_products_tax_exc,
        total_shipping_tax_exc: data.total_shipping_tax_exc,
        total_shipping_tax_inc: data.total_shipping_tax_inc,
        total_tax_exc: data.total_tax_exc,
        total_paid_tax: data.total_paid_tax,
        total_tax_inc: data.total_tax_inc,
        total_fees_amount_tax_exc: data.total_fees_amount_tax_exc,
        total_fees_amount_tax_inc: data.total_fees_amount,
        total_refunds: data.total_refunds,
        total_refunds_fees: data.total_refunds_fees,
        seller: data.seller.data.name,
        orders
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

const uri = '/v1/payments/reports?include=seller,order_sellers'

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