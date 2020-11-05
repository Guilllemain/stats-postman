const moment = require('moment')

moment.locale('fr')

const headers = [
    { id: 'id', title: 'ID' },
    { id: 'reference_product', title: 'Reference produit' },
    { id: 'variant_id', title: 'ID variante' },
    { id: 'variant_reference', title: 'Reference variante' },
    { id: 'ean', title: 'EAN13' },
    { id: 'name', title: 'Nom' },
    { id: 'link', title: 'Lien' },
    { id: 'available_for_order', title: 'Actif' },
    { id: 'description', title: 'Description longue' },
    { id: 'description_short', title: 'Description courte' },
    { id: 'quantity', title: 'Quantity' },
    { id: 'price_tax_exc', title: 'Prix HT' },
    { id: 'old_price_tax_exc', title: 'Ancien Prix HT' },
    { id: 'price_tax_inc', title: 'Prix TTC' },
    { id: 'old_price_tax_inc', title: 'Ancien Prix TTC' },
    { id: 'tax_rate', title: 'Taxe' },
    { id: 'weight', title: 'Poids (g)' },
    { id: 'image_1', title: 'Image 1' },
    { id: 'image_2', title: 'Image 2' },
    { id: 'image_3', title: 'Image 3' },
    { id: 'image_4', title: 'Image 4' },
    { id: 'image_5', title: 'Image 5' },
    { id: 'category', title: 'Categorie' },
]

const detail = product => {
    const products = []
    const Product = {
        id: product.id,
        reference_product: product.reference,
        name: product.name,
        link: product.link,
        available_for_order: product.available_for_order ? "Oui" : "Non",
        category: Object.keys(product.categories).map(key => product.categories[key].name),
        description: product.description,
        description_short: product.description_short,
        quantity: product.quantity,
        price_tax_exc: product.price_tax_exc,
        old_price_tax_exc: product.old_price_tax_exc,
        price_tax_inc: product.price_tax_inc,
        old_price_tax_inc: product.old_price_tax_inc,
        tax_rate: product.tax_rate,
        ean: product.ean,
        weight: product.weight * 1000,
    }

    if (product.images.length > 0) {
        product.images.forEach((image, index) => {
            Object.defineProperty(Product, `image_${index + 1}`, {
                value: image.url
            });
        })
    }

    if (product.features.length > 0) {
        product.features.forEach((feature) => {
            if (!headers.some(header => header.id === `feature_${feature.id_feature_type}`)) {
                headers.push({ id: `feature_${feature.id_feature_type}`, title: feature.name })
            }
            Object.defineProperty(Product, `feature_${feature.id_feature_type}`, {
                value: feature.value,
                enumerable: true,
                configurable: true
            });
        })
    }
    if (Object.keys(product.variants).length > 0) {
        Object.getOwnPropertyNames(product.variants).forEach(variant_property => {
            
            const Variant = {
                id: product.id,
                reference_product: product.reference,
                variant_id: product.variants[variant_property].id_variant,
                variant_reference: product.variants[variant_property].reference,
                name: product.name,
                link: product.link,
                available_for_order: product.available_for_order ? "Oui" : "Non",
                category: (Object.keys(product.categories).map(key => product.categories[key].name)).join(', '),
                description: product.description,
                description_short: product.description_short,
                quantity: product.variants[variant_property].quantity,
                price_tax_exc: product.variants[variant_property].price_tax_exc,
                old_price_tax_exc: product.variants[variant_property].old_price_tax_exc,
                price_tax_inc: product.variants[variant_property].price_tax_inc,
                old_price_tax_inc: product.variants[variant_property].old_price_tax_inc,
                tax_rate: product.variants[variant_property].tax_rate,
                ean: product.variants[variant_property].ean13,
                weight: product.variants[variant_property].weight * 1000,
            }
            if (product.images.length > 0) {
                product.images.forEach((image, index) => {
                    Object.defineProperty(Variant, `image_${index + 1}`, {
                        value: image.url
                    });
                })
            }
            Object.getOwnPropertyNames(product.variants[variant_property].attributes).forEach(attribute => {
                if (!headers.some(header => header.id === `attribute_${product.variants[variant_property].attributes[attribute].id_attribute_group}`)) {
                    headers.push({ id: `attribute_${product.variants[variant_property].attributes[attribute].id_attribute_group}`, title: product.variants[variant_property].attributes[attribute].name_attribute_group })
                }
                Object.defineProperty(Variant, `attribute_${product.variants[variant_property].attributes[attribute].id_attribute_group}`, {
                    value: product.variants[variant_property].attributes[attribute].name_attribute
                });
            })

            if (product.features.length > 0) {
                product.features.forEach((feature) => {
                    if (!headers.some(header => header.id === `feature_${feature.id_feature_type}`)) {
                        headers.push({ id: `feature_${feature.id_feature_type}`, title: feature.name })
                    }
                    Object.defineProperty(Variant, `feature_${feature.id_feature_type}`, {
                        value: feature.value,
                        enumerable: true,
                        configurable: true
                    });
                })
            }

            products.push(Variant)
        })
    } else {
        products.push(Product)
    }
    return products
};

const filename = 'origami_vendor.csv'
