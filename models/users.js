const moment = require('moment')

moment.locale('fr')

const detail = data => {
    return {
        id: data.id,
        firstname: data.firstname,
        lastname: data.lastname,
        email: data.email,
        id_crm: data.additional_information.id_crm.value,
        licencie_code: data.additional_information.licencie_code.value,
        created_at: moment(data.created_at).format('L')
    }
};

const headers = [
    { id: 'id', title: 'ID' },
    { id: 'firstname', title: 'Prenom' },
    { id: 'lastname', title: 'Nom' },
    { id: 'email', title: 'Email' },
    { id: 'id_crm', title: 'ID CRM' },
    { id: 'licencie_code', title: 'Numero de licence' },
    { id: 'created_at', title: 'Inscrit le' }
]

const filename = 'users.csv'

const uri = '/v1/users?include=""'

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