const moment = require('moment')

moment.locale('fr')

const headers = [
    { id: 'id', title: 'ID' },
    { id: 'name', title: 'Nom' },
    { id: 'full_name', title: 'Nom complet' }
]

const detail = category => {
    return {
        id: category.id_category,
        name: category.name,
        full_name: category.full_name,
    }
};

const filename = 'origami_vendor_categories.csv'
