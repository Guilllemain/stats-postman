const headers = [
    { id: 'id', title: 'ID' },
    { id: 'seller_id', title: 'ID vendeur' },
    { id: 'product_id', title: 'ID produit' },
    { id: 'product_variant_id', title: 'ID variante' },
    { id: 'reference_supplier', title: 'Reference vendeur' },
    { id: 'quantity', title: 'Quantité' },
    { id: 'price_tax_exc', title: 'Prix HT' },
    { id: 'price_tax_inc', title: 'Prix TTC' },
    { id: 'price_tax_exc_with_discount', title: 'Prix HT avec remise' },
    { id: 'price_tax_inc_with_discount', title: 'Prix TTC avec remise' },
    { id: 'minimal_quantity', title: 'Quantite minimum' },
    { id: 'is_active', title: 'Actif' },
]

const detail = offer => {
        return {
            id: offer.id,
            seller_id: offer.seller_id,
            product_id: offer.product_id,
            product_variant_id: offer.product_variant_id,
            reference_supplier: offer.reference_supplier,
            quantity: offer.quantity,
            price_tax_exc: offer.price_tax_exc,
            price_tax_inc: offer.price_tax_inc,
            price_tax_exc_with_discount: offer.price_tax_exc_with_discount,
            price_tax_inc_with_discount: offer.price_tax_inc_with_discount,
            minimal_quantity: offer.minimal_quantity,
            is_active: offer.is_active === 1 ? 'Oui' : 'Non'
        }
};

const filename = 'offers.csv'

const uri = '/v1/catalog/products/variants/offers?context[user_group_id]=1'

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