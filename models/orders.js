const moment = require('moment')
moment.locale('fr')


// orders file
const orders_detail = data => {
    if (data.type === 'cart') return
    return {
        id: data.id,
        reference: data.reference,
        type: data.type === "quote" ? "Devis" : "Commande",
        date: moment(data.date_order).format('L'),
        time: moment(data.date_order).format('LT'),
        quote_validity_date: data.additional_information.quote_validity_date.value,
        total: data.total_tax_inc,
        total_products: data.total_products_tax_inc,
        total_shipping: data.total_shipping_tax_inc,
        commission: data.seller_fees_amount_tax_inc,
        product_lines_count: data.orderLines.data.length,
        tracking_link: data.tracking_number ? data.url_tracking + data.tracking_number : '',
        customer_name: data.customer.data.name,
        customer_email: data.customer.data.email,
        seller: data.seller.data.name,
        state: data.state.data.name,
        transaction_type: data.payment_transactions.data[0] ? getTranslatedPaymentType(data.payment_transactions.data[0].type) : '',
        shipping_name: data.shippingOffer ? data.shippingOffer.data.name : '',
        shipping_type: data.shippingOffer ? data.shippingOffer.data.shipping_type.data.translations.data[0].name : ''
    }
};

const orders_headers = [
    { id: 'id', title: 'ID' },
    { id: 'reference', title: 'Reference' },
    { id: 'type', title: 'Type' },
    { id: 'date', title: 'Date' },
    { id: 'time', title: 'Heure' },
    { id: 'quote_validity_date', title: 'Date de validité' },
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
    { id: 'transaction_type', title: 'Mode de paiement' },
    { id: 'shipping_name', title: 'Nom transport' },
    { id: 'shipping_type', title: 'Type transport' }
]

const orders_filename = 'orders.csv'

const uri = '/v1/orders?include=orderLines,seller,shippingOffer.shipping_type,state,payment_transactions,customer&order[name]=id&order[way]=desc'


// order lines file
const order_lines_detail = data => {
    if (data.type === 'cart') return
    const product_lines = []
    data.orderLines.data.forEach(line => {
        product_lines.push({
            id: data.id,
            seller: data.seller.data.name,
            product_id: line.product_id,
            variant_id: line.product_variant_id,
            name: line.name,
            quantity: line.quantity,
            price: line.unit_price_tax_inc,
            reduction: line.reduction_percent
        })
    })
    return product_lines
}

const order_lines_headers = [
    { id: 'id', title: 'ID' },
    { id: 'seller', title: 'Vendeur' },
    { id: 'product_id', title: 'ID produit' },
    { id: 'variant_id', title: 'ID variante' },
    { id: 'name', title: 'Nom' },
    { id: 'quantity', title: 'Quantite' },
    { id: 'price', title: 'Prix TTC' },
    { id: 'reduction', title: 'Reduction %' }
]

const order_lines_filename = 'order_lines.csv'


module.exports = {
    uri,
    models: [
        {
            detail: orders_detail,
            headers: orders_headers,
            filename: orders_filename,
            final_data: []
        },
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