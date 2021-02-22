const { base_uri } = require('../config');
const axios = require('axios')
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
    { id: 'reviews_amount', title: 'Nombre avis' },
    { id: 'url', title: 'Lien' },
    { id: 'state', title: 'Statut' },
    { id: 'meta_title', title: 'Meta title' },
    { id: 'meta_description', title: 'Meta description' },
    { id: 'attribute_value_id', title: 'ID valeur attribut' }
]

const detail = async product => {
    try {
        const products = []
        const { data: { data: variants } } = await axios.get(`${base_uri}/v1/catalog/products/variants?context[user_group_id]=1&include=attributes&filter[product_id]=${product.id}`)
        
        variants.forEach(variant => {

            // get deepest category level's name
            let categories
            if (product.categories.data.length > 0) {
                const categories_level_5 = product.categories.data.filter(category => category.level_depth === 5)
                categories = categories_level_5.map(category => category.translations.data[0].name).join(' / ')
            } 

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
                category: categories,
                reviews_amount: product.product_reviews.data.length,
                url: product.url_front,
                state: product.state,
                meta_title: product.translations.data[0].meta_title,
                meta_description: product.translations.data[0].meta_description
            }
            if (variant.attributes.data.length > 0) {
                variant.attributes.data.forEach((attribute) => {
                    if (!headers.some(header => header.id === `attribute_${attribute.attribute_type_id}`)) {
                        headers.push({ id: `attribute_${attribute.attribute_type_id}`, title: attribute.attribute_type.data.translations.data[0].name })
                    }
                    Object.defineProperty(Product, `attribute_${attribute.attribute_type_id}`, {
                        value: attribute.attribute_value.data.translations.data[0].name
                    });
                    Product.attribute_value_id = attribute.attribute_value.data.id
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

    } catch (error) {
        console.log(error)
        console.log(error.code)
    }
};

const filename = 'products.csv'

const uri = '/v1/catalog/products?include=categories,features.feature_type,product_reviews'

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