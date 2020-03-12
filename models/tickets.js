const moment = require('moment')

moment.locale('fr')

exports.detail = data => {
    return {
        id: data.id,
        created_at: data.created_at,
        updated_at: data.updated_at,
        status: data.status,
        seller: data.seller.data.name,
    }
};

exports.headers = [
    { id: 'id', title: 'ID' },
    { id: 'reference', title: 'Reference' },
    { id: 'date', title: 'Date' },
    { id: 'time', title: 'Heure' },
    { id: 'total', title: 'Total TTC' },
    { id: 'total_products', title: 'Total produits TTC' },
    { id: 'total_shipping', title: 'Total livraison TTC' },
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

exports.uri = '/v1/orders?include=orderLines,seller,shippingOffer.shipping_type,state,customer'