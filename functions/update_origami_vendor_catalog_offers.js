const { base_uri, promotennis_url } = require('../config');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const axios = require('axios');
const getToken = require('./auth')

const context = 'context[user_group_id]=1'

const seller_id = 5604
const fetched_offers = []
const products_not_in_catalog = []

const updateOrigamiVendorCatalog = async (page = 1) => {
    await getToken()
    console.log(page)
    try {
        const { data: { products }, data: { pagination } } = await axios.get(`${promotennis_url}&page=${page}`)
        // get all active products with an image
        const active_products = products.filter(product => product.image_default)
        // remove Wilson products
        const authorized_products = active_products.filter(product => !product.name.toLowerCase().includes('wilson') && !product.name.toLowerCase().includes('luxilon') && !product.name.toLowerCase().includes('nike'))
        // get all offers from the selected products
        const offers = authorized_products.map(product => {
            let ean = product.ean
            
            if (product.ean && product.ean.length === 12) {
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
                    if (product.variants[variant].ean13 && product.variants[variant].ean13.length === 12) {
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
    const catalog_offers = await getOffersCatalog(seller_id)

    
    // find all online offers that are not in the seller's catalog and desactive them
    const offers_not_in_seller_catalog = catalog_offers.filter(o1 => !updated_offers.some(o2 => o1.reference_supplier === o2.reference_supplier))
    const offers_to_disable = offers_not_in_seller_catalog.filter(offer => offer.quantity !== 0)
    console.log(`${offers_to_disable.length} offers to disable`)

    if (offers_to_disable.length > 0) {
        for (let i = 0; i < offers_to_disable.length; i++) {
            const offer = offers_to_disable[i]
            try {
                const response = await axios.patch(`${base_uri}/v1/catalog/products/variants/offers/${offer.id}?${context}`, {
                    quantity: 0
                })
                console.log(`${response.status} --- offer ID ${offer.id} has been disabled`)
            } catch(error) {
                console.log(error)
            }
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
            } else if (response.length == 0 && offer.ean) { 
                try {
                    const { data: { data: variant } } = await axios.get(`${base_uri}/v1/catalog/products/variants?filter[ean13]=${offer.ean}&${context}&include=product`)
                    if (variant.length > 0) {
                        const new_offer = await axios.post(`${base_uri}/v1/catalog/products/variants/offers?${context}`, {
                            product_id: variant[0].product_id,
                            product_variant_id: variant[0].id,
                            seller_id,
                            tax_id: 1,
                            reference_supplier: offer.reference_supplier,
                            price_tax_exc: offer.price_tax_exc,
                            quantity: offer.quantity
                        })
                        console.log(new_offer.status, ' --- NEW OFFER --- ', offer.reference_supplier, ' --- ', offer.ean)
                    } else {
                        products_not_in_catalog.push({product_id: offer.product_id, variant_id: offer.variant_id ? offer.variant_id : ''})
                    }
                } catch (error) {
                    console.log(error.data.errors, '--- ERROR ---', offer.reference_supplier)
                }
            } else if (response.length == 0) {
                products_not_in_catalog.push({ product_id: offer.product_id, variant_id: offer.variant_id ? offer.variant_id : '' })
            }
        } catch (error) {
            console.log(error.status, ' | ', offer.reference_supplier, ' --- ERROR ---')
        }
    }
    
    createCvsOffers(products_not_in_catalog)
}

const all_offers = []
const getOffersCatalog = async (seller_id, page = 1) => {
    console.log(page)
    const { data: { data: offers }, data: { meta: pagination } } = await axios.get(`${base_uri}/v1/catalog/products/variants/offers?${context}&page=${page}&filter[seller_id]=${seller_id}`)
    all_offers.push(offers)

    if (pagination.pagination.current_page < pagination.pagination.total_pages) {
        return getOffersCatalog(seller_id, pagination.pagination.current_page + 1)
    }
    return all_offers.flat()
}


const createCvsOffers = data => {
    createCsvWriter({
        path: `./stats/TB_offers_to_create.csv`,
        fieldDelimiter: ';',
        header: [
            { id: 'product_id', title: 'Product ID' },
            { id: 'variant_id', title: 'Variant ID' },
        ]
    })
    .writeRecords(data)
    .then(() => console.log(`The file was written successfully`));
}



updateOrigamiVendorCatalog()
