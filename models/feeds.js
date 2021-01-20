const feed_id = 349

const headers = [
    { id: 'state', title: 'Etat' },
    { id: 'reference', title: 'Reference' },
    { id: 'ean13', title: 'EAN' },
    { id: 'marketplace_reference', title: 'Reference MKP' },
    { id: 'name', title: 'Nom' },
    { id: 'product_offer_id', title: 'Offer ID' },
]

const detail = product => {
        return {
            state: product.state,
            reference: product.reference,
            ean13: product.ean13,
            marketplace_reference: product.marketplace_reference,
            name: product.name,
            product_offer_id: product.product_offer_id,
        }
};

const filename = 'feed_products_ET.csv'

const uri = `/v1/feeds/products?filter[feed_id]=${feed_id}`

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