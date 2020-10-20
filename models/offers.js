const headers = [
    { id: 'id', title: 'ID' },
    { id: 'seller_id', title: 'ID vendeur' },
    { id: 'product_id', title: 'ID produit' },
    { id: 'product_variant_id', title: 'ID variante' },
    { id: 'reference_supplier', title: 'Reference vendeur' },
    { id: 'ean13', title: 'EAN13' },
    { id: 'quantity', title: 'Quantité' },
    { id: 'price_tax_exc', title: 'Prix HT' },
    { id: 'price_tax_inc', title: 'Prix TTC' },
    { id: 'price_tax_exc_with_discount', title: 'Prix HT avec remise' },
    { id: 'price_tax_inc_with_discount', title: 'Prix TTC avec remise' },
    { id: 'is_active', title: 'Actif' },
]

exports.detail = offer => {
        return {
            id: offer.id,
            seller_id: offer.seller_id,
            product_id: offer.product_id,
            product_variant_id: offer.product_variant_id,
            reference_supplier: offer.reference_supplier,
            ean13: offer.ean13,
            quantity: offer.quantity,
            price_tax_exc: offer.price_tax_exc,
            price_tax_inc: offer.price_tax_inc,
            price_tax_exc_with_discount: offer.price_tax_exc_with_discount,
            price_tax_inc_with_discount: offer.price_tax_inc_with_discount,
            is_active: offer.is_active
        }
};

exports.headers = headers

exports.filename = 'offers.csv'

exports.uri = '/v1/catalog/products/variants/offers?context[user_group_id]=1&filter[seller_id]=90'