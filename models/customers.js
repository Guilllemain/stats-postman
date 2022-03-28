const moment = require('moment')

moment.locale('fr')

const detail = data => {
    return {
        id: data.id,
        name: data.name,
        email: data.email,
        club_number: data.additional_information.club_code.value,
        orders: data.order_sellers.data.length,
        created_at: moment(data.created_at).format('L')
    }
};

const headers = [
    { id: 'id', title: 'ID' },
    { id: 'name', title: 'Nom' },
    { id: 'email', title: 'Email' },
    { id: 'club_number', title: 'Numero de club' },
    { id: 'orders', title: 'Nombre de commandes' },
    { id: 'created_at', title: 'Inscrit le' }
]

const filename = 'customers.csv'

const uri = '/v1/customers?include=order_sellers,custom_field_values.value'

module.exports = {
    uri,
    page_size: 500,
    models: [
        {
            detail,
            headers,
            filename,
            final_data: []
        }
    ]
}