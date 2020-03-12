const headers = [
    { id: 'id', title: 'ID' },
    { id: 'reference_product', title: 'Reference produit' },
    { id: 'reference_supplier', title: 'Reference vendeur' },
    { id: 'ean', title: 'EAN13' },
    { id: 'created_at', title: 'Date création' },
    { id: 'updated_at', title: 'Date modification' },
    { id: 'name', title: 'Nom' },
    { id: 'long_description', title: 'Description longue' },
    { id: 'short_description', title: 'Description courte' },
    { id: 'category', title: 'Categorie' },
    { id: 'seller', title: 'Vendeur' },
    { id: 'stock', title: 'Stock' },
    { id: 'price', title: 'Prix HT' },
    { id: 'tax', title: 'Taxe' },
    { id: 'url', title: 'Lien' },
    { id: 'state', title: 'Statut' },
]

exports.detail = product => {
    let products = []
    console.log(product)
    product.variants.data.forEach(variant => {
        if (variant.offers.data.length > 0) {
            console.log('VARIANT OFFER')
        }
        const Product = {
            id: product.id,
            reference: variant.reference_supplier ? variant.reference_supplier : variant.reference,
            reference: variant.reference_supplier ? variant.reference_supplier : variant.reference,
            ean: variant.ean13,
            created_at: product.created_at,
            updated_at: product.updated_at,
            name: product.translations.data[0].name,
            long_description: product.translations.data[0].description,
            short_description: product.translations.data[0].description_short,
            category: product.categories.data.length > 0 ? product.categories.data[0].translations.data[0].name : '',
            seller: variant.offers.data.length > 0 ? variant.offers.data[0].seller.data.name : '',
            stock: variant.offers.data.length > 0 ? variant.offers.data[0].quantity : '',
            price: variant.offers.data.length > 0 ? variant.offers.data[0].price_tax_exc : '',
            tax: variant.offers.data.length > 0 ? variant.offers.data[0].tax.data.value : '',
            url: product.url_front,
            state: product.state
        }
        if (variant.attributes.data.length > 0) {
            variant.attributes.data.forEach((attribute, index) => {
                headers.push({ id: `attribute ${index + 1}`, title: attribute.attribute_type.data.translations.data[0].name})
                Object.defineProperty(Product, `attribute ${index + 1}`, {
                    value: attribute.attribute_value.data.translations.data[0].name
                });
            })
        }
        products.push(Product)
    })
    return products
};

exports.headers = headers

exports.filename = 'products.csv'

exports.uri = '/v1/catalog/products?include=variants.offers.seller,variants.offers.tax,variants.attributes,categories,features'