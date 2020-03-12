exports.detail = data => {
    let product_lines = []
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

exports.headers = [
    { id: 'id', title: 'ID' },
    { id: 'seller', title: 'Vendeur' },
    { id: 'product_id', title: 'ID produit' },
    { id: 'variant_id', title: 'ID variante' },
    { id: 'name', title: 'Nom' },
    { id: 'quantity', title: 'Quantite' },
    { id: 'price', title: 'Prix TTC' },
    { id: 'reduction', title: 'Reduction %' }
]

exports.filename = 'order_lines.csv'

exports.uri = '/v1/orders?include=orderLines'