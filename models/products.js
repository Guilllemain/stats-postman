const moment = require('moment')

moment.locale('fr')

const headers = [
    { id: 'id', title: 'ID' },
    { id: 'reference_product', title: 'Reference produit' },
    { id: 'variant_id', title: 'ID variante' },
    { id: 'reference_variant', title: 'Reference variante' },
    { id: 'ean', title: 'EAN13' },
    { id: 'created_at', title: 'Date création' },
    { id: 'updated_at', title: 'Date modification' },
    { id: 'name', title: 'Nom' },
    { id: 'long_description', title: 'Description longue' },
    { id: 'short_description', title: 'Description courte' },
    { id: 'category', title: 'Categorie' },
    { id: 'offers_quantity', title: 'Nombre offres' },
    { id: 'reviews_amount', title: 'Nombre avis' },
    { id: 'url', title: 'Lien' },
    { id: 'state', title: 'Statut' },
]

exports.detail = product => {
    const products = []
    product.variants.data.forEach(variant => {
        const Product = {
            id: product.id,
            reference_product: product.reference,
            variant_id: variant.id,
            reference_variant: variant.reference,
            ean: variant.ean13,
            created_at: moment(product.created_at).format('L'),
            updated_at: moment(product.updated_at).format('L'),
            name: product.translations.data[0].name,
            long_description: product.translations.data[0].description,
            short_description: product.translations.data[0].description_short,
            category: product.categories.data.length > 0 ? product.categories.data[0].translations.data[0].name : '',
            offer_quantity: variant.offers.data.length,
            reviews_amount: product.product_reviews.data.length,
            url: product.url_front,
            state: product.state
        }
        if (variant.attributes.data.length > 0) {
            variant.attributes.data.forEach((attribute) => {
                if (!headers.some(header => header.id === `attribute_${attribute.attribute_type_id}`)) {
                    headers.push({ id: `attribute_${attribute.attribute_type_id}`, title: attribute.attribute_type.data.translations.data[0].name})
                }
                Object.defineProperty(Product, `attribute_${attribute.attribute_type_id}`, {
                    value: attribute.attribute_value.data.translations.data[0].name
                });
            })
        }

        if (product.features.data.length > 0) {
            product.features.data.forEach((feature) => {
                if (!headers.some(header => header.id === `feature_${feature.feature_type.data.id}`)) {
                    headers.push({ id: `feature_${feature.feature_type.data.id}`, title: feature.feature_type.data.translations.data[0].name })
                }
                Object.defineProperty(Product, `feature_${feature.feature_type.data.id}`, {
                    value: feature.translations.data[0].value
                });
            })
        }
        products.push(Product)
    })
    return products
};

exports.headers = headers

exports.filename = 'products.csv'

exports.uri = '/v1/catalog/products?include=variants.attributes,variants.offers,categories,features.feature_type,product_reviews'