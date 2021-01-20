const axios = require('axios');
const { base_uri } = require('../config');

const updateProducts = async products => {
    for (let i = 0; i < products.length; i++) {
        const product = products[i]
        try {
            const response = await axios.patch(`${base_uri}/v1/catalog/products/${product}?context[user_group_id]=1`, {
                additional_information: {
                    on_sale: {
                        value: 1
                    }
                }
            })
            console.log(response.status, ' ------ ', product)
            // const { data: { data: response } } = await axios.get(`${base_uri}/v1/catalog/products/${product.product_id}?context[user_group_id]=1&include=features`)
            // const features = response.features.data.map(feature => {
            //     return {
            //         feature_value_id: feature.id,
            //         feature_type_id: feature.feature_type_id,
            //         is_custom: feature.is_custom
            //     }
            // })
            // features.push({
            //     feature_value_id: product.feature_value_id,
            //     feature_type_id: product.feature_id,
            //     is_custom: 0
            // })
            // try {
            //     const response = await axios.patch(`${base_uri}/v1/catalog/products/${product.product_id}?context[user_group_id]=1`, {
            //         features
            //     })
            //     console.log(response.status, ' | ', product.product_id)
            // } catch (error) {
            //     console.log(error.status)
            // }
        } catch (error) {
            console.log(error.status, ' ----- ERROR ----- ', product)
        }
    }
}



const rewriteDescription = async (page = 1) => {
    try {
        await getToken()
        console.log(page)
        const { data: { data: response }, data: { meta: pagination } } = await axios.get(`${base_uri}/v1/catalog/products/variants/offers?context[user_group_id]=1&include=product&filter[seller_id]=2717&page=${page}`)
        response.forEach(async offer => {
            if (offer.product.data.translations.data[0].description && offer.product.data.translations.data[0].description.toLowerCase().includes('<h3>notre test')) {
                console.log(offer.product_id)
                const formattedDescription = offer.product.data.translations.data[0].description.substring(0, offer.product.data.translations.data[0].description.toLowerCase().indexOf(`<h3>notre test`))
                console.log(formattedDescription)
                try {
                    await axios.patch(`${base_uri}/v1/catalog/products/${offer.product_id}?context[user_group_id]=1`, {
                        translations: [{
                            language_id: 1,
                            name: offer.product.data.translations.data[0].name,
                            description: formattedDescription,
                        }],
                    })
                } catch (error) {
                    console.log(error.response.data)
                }
            }
        })
        if (pagination.pagination.current_page <= pagination.pagination.total_pages) {
            return rewriteDescription(pagination.pagination.current_page + 1)
        }
        // const raw = response.translations.data[0].description.substring(0, response.translations.data[0].description.toLowerCase().indexOf(`<h2><b>notre test`))
        // console.log(raw)        
    }
    catch (error) {
        console.log(error)
    }
}


// try { 
//     await axios.post(`${ base_uri }/v1/catalog/products?context[user_group_id]=1`, {
//     reference: 1920055,
//     ean13: "",
//     translations: [{
//         language_id: 1,
//         name: 'Cordage Solinco Tour Bite 12m',
//         description: '',
//         description_short: ''
//     }],
//     features: [
//         {
//             feature_type_id: 47,
//             is_custom: 0,
//             translations: [
//                     {
//                         locale: 'fr',
//                         default: false,
//                         language_id: 1,
//                         value: 'Junior'
//                     }
//                 ]
//         }
//     ]
//     })
//  }
// catch (error) {
//     console.log(error)
// }


module.exports = updateProducts