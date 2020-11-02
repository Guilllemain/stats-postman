const { base_uri, promotennis_url } = require('../config');
const axios = require('axios');
const getToken = require('./auth')

// const fetch = require("node-fetch");
// async function getOrigamiVendorCatalog(filename, headers, data_type, page = 1, final_data = []) {
//     const response = await fetch(`https://www.esprit-tennis.com/module/origamivendor/api?key=C13QTYL4150YAHRIDTG5UZCHDO1124CUT0FD0O919TNAZ61CJSMEDA1602692691&method=catalog&page=${page}`)
//     if (response.ok) {
//         const { products, pagination } = await response.json();
//         products.forEach(product => {
//             final_data.push(data_type(product))
//         })

//         if (pagination.page_number < pagination.total_pages) {
//             console.log(pagination.page_number)
//             return getOrigamiVendorCatalog(filename, headers, data_type, pagination.page_number + 1, final_data)
//         }

//         createCsvWriter({
//             path: `./stats/${filename}`,
//             fieldDelimiter: ';',
//             header: headers
//         })
//             .writeRecords(final_data.flat())
//             .then(() => console.log(`The file ${filename} was written successfully`));
//     } else {
//         console.log("HTTP-Error: " + response.status);
//     }
//     server.close(() => {
//         console.log('Http server closed.');
//     });
// }


const fetched_offers = []
const updateOrigamiVendorCatalog = async (page = 1) => {
    await getToken()
    console.log(page)
    try {
        const { data: { products }, data: { pagination } } = await axios.get(`${promotennis_url}&page=${page}`)
        const active_products = products.filter(product => product.image_default)
        const offers = active_products.map(product => {
            if (product.variants.length === 0) {
                return {
                    id: product.id,
                    reference: `TB${product.id}`,
                    quantity: product.quantity,
                    price_tax_exc: product.price_tax_exc,
                    old_price_tax_exc: product.old_price_tax_exc,
                    price_tax_inc: product.price_tax_inc,
                    old_price_tax_inc: product.old_price_tax_inc,
                }
            } else {
                return Object.keys(product.variants).map(variant => {
                    return {
                        id: product.variants[variant].id_variant,
                        reference: `TB${product.variants[variant].id_variant}`,
                        quantity: product.variants[variant].quantity,
                        price_tax_exc: product.variants[variant].price_tax_exc,
                        old_price_tax_exc: product.variants[variant].old_price_tax_exc,
                        price_tax_inc: product.variants[variant].price_tax_inc,
                        old_price_tax_inc: product.variants[variant].old_price_tax_inc,
                    }
                })
            }
        })
        fetched_offers.push(offers.flat())
        
        if (pagination.page_number < pagination.total_pages) {
            return updateOrigamiVendorCatalog(pagination.page_number + 1)
        }
    } catch (error) {
        console.log(error.status);
    }

    const updated_offers = fetched_offers.flat()
    for (let i = 0; i < updated_offers.length; i++) {
        const offer = updated_offers[i]
        try {
            const { data: { data: response } } = await axios.get(`${base_uri}/v1/catalog/products/variants/offers?filter[reference_supplier]=${offer.reference}&context[user_group_id]=1`)
            if (response.length > 0) {
                try {
                    const patch_offer = await axios.patch(`${base_uri}/v1/catalog/products/variants/offers/${response[0].id}?context[user_group_id]=1`, {
                        price_tax_exc: offer.price_tax_exc,
                        price_tax_inc: offer.price_tax_inc,
                        price_tax_exc_with_discount: offer.old_price_tax_exc,
                        price_tax_inc_with_discount: offer.old_price_tax_inc,
                        quantity: offer.quantity
                    })
                    console.log(patch_offer.status, ' | ', response[0].id)
                } catch (error) {
                    console.log(error.status, ' | ', offer.reference, ' --- ERROR ---')
                }
            }
        } catch (error) {
            console.log(error.status, ' | ', offer.reference, ' --- ERROR ---')
        }
    }
    server.close(() => {
        console.log('Http server closed.');
    });
}

updateOrigamiVendorCatalog()
