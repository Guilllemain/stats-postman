const moment = require('moment')

moment.locale('fr')

exports.detail = data => {
    return {
        id: data.id,
        name: data.name,
        email: data.email,
        club_number: data.custom_field_values.data.length > 0 ? data.custom_field_values.data[0].value.data.value : '',
        orders: data.order_sellers.data.length,
        created_at: moment(data.created_at).format('L')
    }
};

exports.headers = [
    { id: 'id', title: 'ID' },
    { id: 'name', title: 'Nom' },
    { id: 'email', title: 'Email' },
    { id: 'club_number', title: 'Numero de club' },
    { id: 'orders', title: 'Nombre de commandes' },
    { id: 'created_at', title: 'Inscrit le' }
]

exports.filename = 'customers.csv'

exports.uri = '/v1/customers?include=order_sellers,custom_field_values.value'