const { base_uri } = require('../config');
const axios = require('axios')
const moment = require('moment')
const getCategoryProducts = require('../functions/get_rackets_categories_products')

moment.locale('fr')

const detail = async product => {
    try {
        const products = []
        const { data: { data: variants } } = await axios.get(`${base_uri}/v1/catalog/products/variants?context[user_group_id]=1&include=attributes&filter[product_id]=${product.id}`)
        
        variants.forEach(variant => {

            // get deepest category level's name
            // let categories_name, categories_id, default_category
            let has_finest_category = false;
            if (product.categories.data.length > 0) {
                const categories_level_5 = product.categories.data.filter(category => category.level_depth === 5)
                if (categories_level_5.length > 0) {
                    has_finest_category = true;
                }
                // categories_name = categories_level_5.map(category => category.translations.data[0].name).join(' / ')
                // categories_id = categories_level_5.map(category => category.id).join(' / ')
            }
            // if (product.default_category_id) {
            //     default_category = product.categories.data.find(cat => cat.id === product.default_category_id).translations.data[0].name
            // }

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
                default_category: product.default_category_id,
                has_finest_category,
                url: product.url_front,
                state: product.state,
                on_sale: product.additional_information.on_sale.value === "1"  ? 'Oui' : "Non",
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
        console.log(error?.code)
    }
};

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
    { id: 'default_category', title: 'Categorie principale' },
    { id: 'has_finest_category', title: 'Categorie niveau 5' },
    { id: 'url', title: 'Lien' },
    { id: 'state', title: 'Statut' },
    { id: 'on_sale', title: 'En soldes' },
    { id: 'meta_title', title: 'Meta title' },
    { id: 'meta_description', title: 'Meta description' },
    { id: 'attribute_value_id', title: 'ID valeur attribut' }
]

const filename = 'products.csv'

const uri = '/v1/catalog/products?include=features.feature_type,categories'


//products categories
const rackets = {
    filename: 'raquettes.csv',
    category_id: 5,
    attributes_id: [3, 7],
    features_id: [40, 60, 35, 73, 37, 47, 54, 41, 42, 47],
    products: []
}
const balls = {
    filename: 'balles.csv',
    category_id: 10,
    attributes_id: "",
    features_id: [25, 5, 26],
    products: []
}

// const racket_detail = async(product) => {
//     const rackets_products = []
//     const racket_product = await getCategoryProducts.getProducts(product, rackets)
//     if (racket_product) {
//         racket_product.forEach(racket => rackets_products.push(racket))
//     }
//     return rackets_products
// }

// const ball_detail = async(product) => {
//     const balls_products = []
//     const ball_product = await getCategoryProducts.getProducts(product, balls)
//     if (ball_product) {
//         ball_product.forEach(ball => balls_products.push(ball))
//     }
//     console.log(getCategoryProducts.headers)
//     return balls_products
// }

module.exports = {
    uri,
    page_size: 100,
    models: [
        {
            detail,
            headers,
            filename,
            final_data: []
        }
        // {
        //     detail: racket_detail,
        //     headers: getCategoryProducts.headers,
        //     filename: rackets.filename,
        //     final_data: []
        // },
        // {
        //     detail: ball_detail,
        //     headers: getCategoryProducts.headers,
        //     filename: balls.filename,
        //     final_data: []
        // }
    ]
}