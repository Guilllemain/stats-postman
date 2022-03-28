const moment = require('moment')
moment.locale('fr')

// order lines file
const order_lines_detail = data => {
    if (data.type === 'cart') return
    return {
        id: data.id,
        order_id: data.order_seller_id,
        product_id: data.product_id,
        variant_id: data.product_variant_id,
        name: data.name,
        quantity: data.quantity,
        price: data.unit_price_tax_inc,
        reduction: data.reduction_percent
    }
}

const order_lines_headers = [
    { id: 'id', title: 'ID' },
    { id: 'order_id', title: 'ID order' },
    { id: 'product_id', title: 'ID produit' },
    { id: 'variant_id', title: 'ID variante' },
    { id: 'name', title: 'Nom' },
    { id: 'quantity', title: 'Quantite' },
    { id: 'price', title: 'Prix TTC' },
    { id: 'reduction', title: 'Reduction %' }
]

const uri = '/v1/orders/lines?include=""'

const order_lines_filename = 'order_lines.csv'


module.exports = {
    uri,
    page_size: 1000,
    models: [
        {
            detail: order_lines_detail,
            headers: order_lines_headers,
            filename: order_lines_filename,
            final_data: []
        },
    ]
}

const getTranslatedPaymentType = payment_type => {
    if (payment_type === 'BANK_WIRE') {
        return 'Virement'
    } else if (payment_type === 'PAYIN') {
        return 'Carte bancaire'
    } else if (payment_type === 'SEPA_DIRECT_DEBIT') {
        return 'Prélèvement'
    } else if (payment_type === 'GIFT_CARD_PAYIN') {
        return 'Carte cadeau'
    }
}