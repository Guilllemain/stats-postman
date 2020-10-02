const moment = require('moment')

moment.locale('fr')

exports.detail = data => {
    return {
        id: data.id,
        reference: data.reference,
        type: data.type === "quote" ? "Devis" : "Commande",
        date: moment(data.date_order).format('L'),
        time: moment(data.date_order).format('LT'),
        total: data.total_tax_inc,
        total_products: data.total_products_tax_inc,
        total_shipping: data.total_shipping_tax_inc,
        commission: data.fees_amount_tax_inc,
        product_lines_count: data.orderLines.data.length,
        tracking_link: data.tracking_number ? data.url_tracking + data.tracking_number : '',
        customer_name: data.customer.data.name,
        customer_email: data.customer.data.email,
        seller: data.seller.data.name,
        state: data.state.data.key,
        shipping_name: data.shippingOffer ? data.shippingOffer.data.name : '',
        shipping_type: data.shippingOffer ? data.shippingOffer.data.shipping_type.data.translations.data[0].name : ''
    }
};

exports.headers = [
    { id: 'id', title: 'ID' },
    { id: 'reference', title: 'Reference' },
    { id: 'type', title: 'Type' },
    { id: 'date', title: 'Date' },
    { id: 'time', title: 'Heure' },
    { id: 'total', title: 'Total TTC' },
    { id: 'total_products', title: 'Total produits TTC' },
    { id: 'total_shipping', title: 'Total livraison TTC' },
    { id: 'commission', title: 'Comission TTC' },
    { id: 'product_lines_count', title: 'Nombre lignes' },
    { id: 'tracking_link', title: 'Lien livraison' },
    { id: 'customer_name', title: 'Nom client' },
    { id: 'customer_email', title: 'Email client' },
    { id: 'seller', title: 'Vendeur' },
    { id: 'state', title: 'Etat' },
    { id: 'shipping_name', title: 'Nom transport' },
    { id: 'shipping_type', title: 'Type transport' }
]

exports.filename = 'orders.csv'

exports.uri = '/v1/orders?include=orderLines,seller,shippingOffer.shipping_type,state,customer&order[name]=id&order[way]=desc'