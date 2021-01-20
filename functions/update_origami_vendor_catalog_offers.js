const { base_uri, promotennis_url } = require('../config');
const axios = require('axios');
const getToken = require('./auth')

const context = 'context[user_group_id]=1'

const fetched_offers = []
const updateOrigamiVendorCatalog = async (page = 1) => {
    await getToken()
    console.log(page)
    try {
        const { data: { products }, data: { pagination } } = await axios.get(`${promotennis_url}&page=${page}`)
        // get all active products with an image
        const active_products = products.filter(product => product.image_default)
        // remove Wilson products
        const authorized_products = active_products.filter(product => !product.name.toLowerCase().includes('wilson') && !product.name.toLowerCase().includes('luxilon'))
        // get all offers from the selected products
        const offers = authorized_products.map(product => {
            let ean = product.ean
            if (product.ean && product.ean.length === 11) {
                ean = 0 + product.ean
            }

            if (product.variants.length === 0) {
                return {
                    product_id: product.id,
                    reference_supplier: `TB${product.id}`,
                    quantity: product.quantity,
                    old_price_tax_exc: product.old_price_tax_exc,
                    price_tax_exc: product.price_tax_exc,
                    ean
                }
            } else {
                return Object.keys(product.variants).map(variant => {
                    if (product.variants[variant].ean13 && product.variants[variant].ean13.length === 11) {
                        ean = 0 + product.variants[variant].ean13
                    }
                    return {
                        product_id: product.id,
                        variant_id: product.variants[variant].id_variant,
                        reference_supplier: `TBV${product.variants[variant].id_variant}`,
                        quantity: product.variants[variant].quantity,
                        old_price_tax_exc: product.variants[variant].old_price_tax_exc,
                        price_tax_exc: product.variants[variant].price_tax_exc,
                        ean
                    }
                })
            }
        })
        fetched_offers.push(offers.flat())
        
        if (pagination.page_number < pagination.total_pages) {
            return updateOrigamiVendorCatalog(pagination.page_number + 1)
        }
    } catch (error) {
        console.log(error);
    }

    const updated_offers = fetched_offers.flat()
    const catalog_offers = await getOffersCatalog(4219)
    
    // find all online offers that are not in the seller's catalog and desactive them
    let offers_to_disable = catalog_offers.filter(o1 => !updated_offers.some(o2 => o1.reference_supplier === o2.reference_supplier))
    
    if (offers_to_disable.length > 0) {
        for (let i = 0; i < offers_to_disable.length; i++) {
            const offer = offers_to_disable[i]
            await axios.patch(`${base_uri}/v1/catalog/products/variants/offers/${offer.id}?${context}`, {
                is_active: 0
            })
        }
    }


    for (let i = 0; i < updated_offers.length; i++) {
        const offer = updated_offers[i]
        try {
            const { data: { data: response } } = await axios.get(`${base_uri}/v1/catalog/products/variants/offers?filter[reference_supplier]=${offer.reference_supplier}&${context}`)
            // if there is a match and the offer has changed, update it
            if ((response && response.length == 1) && (offer.quantity !== response[0].quantity || offer.price_tax_exc !== response[0].price_tax_exc_with_discount)) {
                try {
                    const patch_offer = await axios.patch(`${base_uri}/v1/catalog/products/variants/offers/${response[0].id}?${context}`, {
                        price_tax_exc: offer.price_tax_exc,
                        quantity: offer.quantity,
                        is_active: 1
                    })
                    console.log(patch_offer.status, ' | ', response[0].id)
                } catch (error) {
                    console.log(error, ' | ', offer.reference_supplier, ' --- ERROR ---')
                }
            } else if (response.length === 0 && offer.ean) { 
                try {
                    const { data: { data: variant } } = await axios.get(`${base_uri}/v1/catalog/products/variants?filter[ean13]=${offer.ean}&${context}&include=product`)
                    if (variant.length > 0) {
                        const new_offer = await axios.post(`${base_uri}/v1/catalog/products/variants/offers?${context}`, {
                            product_id: variant[0].product_id,
                            product_variant_id: variant[0].id,
                            seller_id: 4219,
                            tax_id: 1,
                            reference_supplier: offer.reference_supplier,
                            price_tax_exc: offer.price_tax_exc,
                            quantity: offer.quantity
                        })
                        console.log(new_offer.status, ' --- NEW OFFER --- ', offer.reference_supplier)
                    } else if (variant.length === 0 && offer.ean) {
                        console.log(`Product ${offer.reference_supplier} with ean ${offer.ean} does not appears to be in our catalog`)
                    }
                } catch (error) {
                    console.log(error, '--- ERROR ---', offer.reference_supplier)
                }
            }
        } catch (error) {
            console.log(error.status, ' | ', offer.reference_supplier, ' --- ERROR ---')
        }
    }

}

const getOffersCatalog = async (seller_id, page = 1) => {
    console.log(page)
    const all_offers = []
    const { data: { data: offers }, data: { meta: pagination } } = await axios.get(`${base_uri}/v1/catalog/products/variants/offers?${context}&page=${page}&filter[seller_id]=${seller_id}`)
    all_offers.push(offers)

    if (pagination.pagination.current_page < pagination.pagination.total_pages) {
        return getOffersCatalog(seller_id, pagination.pagination.current_page + 1)
    }
    return all_offers.flat()
}



updateOrigamiVendorCatalog()
