const moment = require('moment')

moment.locale('fr')

const detail = data => {
    return {
        id: data.id,
        seller_id: data.seller_id,
        shipping_method: data.shipping_method,
        name: data.name,
        url_tracking: data.url_tracking,
        is_free: data.is_free === 0 ? 'Non' : 'Oui',
        nb_days_min: data.nb_days_min,
        nb_days_max: data.nb_days_max
    }
};

const headers = [
    { id: 'id', title: 'ID' },
    { id: 'seller_id', title: 'Seller ID' },
    { id: 'shipping_method', title: "Type offre" },
    { id: 'name', title: 'Nom' },
    { id: 'url_tracking', title: 'Url tracking' },
    { id: 'is_free', title: 'Gratuit' },
    { id: 'nb_days_min', title: 'Délai min' },
    { id: 'nb_days_max', title: 'Délai max' }
]

const filename = 'shipping_offers.csv'

const uri = '/v1/shipping/offers?include=""'

module.exports = {
    uri,
    page_size: 1000,
    models: [
        {
            detail,
            headers,
            filename,
            final_data: []
        }
    ]
}