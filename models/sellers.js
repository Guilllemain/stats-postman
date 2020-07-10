exports.detail = data => {
    return {
        id: data.id,
        state: data.is_active,
        name: data.name,
        type: data.seller_type,
        email: data.email,
        address_1: data.address_street1,
        address_2: data.address_street2,
        postcode: data.address_postcode,
        city: data.address_city,
        bank: data.bank_accounts.data[0] ? data.bank_accounts.data[0].bank_name : '',
        iban: data.bank_accounts.data[0] ? data.bank_accounts.data[0].iban : '',
        bic: data.bank_accounts.data[0] ? data.bank_accounts.data[0].bic : '',
        reviews_amount: data.reviews.data.length
    }
};

exports.headers = [
    { id: 'id', title: 'ID' },
    { id: 'state', title: 'Statut' },
    { id: 'name', title: 'Nom' },
    { id: 'type', title: 'Type' },
    { id: 'email', title: 'Email' },
    { id: 'address_1', title: 'Adresse 1' },
    { id: 'address_2', title: 'Adresse 2' },
    { id: 'postcode', title: 'Code postal' },
    { id: 'city', title: 'Ville' },
    { id: 'bank', title: 'Banque' },
    { id: 'iban', title: 'IBAN' },
    { id: 'bic', title: 'BIC' },
    { id: 'reviews_amount', title: 'Nombre avis' },
]

exports.filename = 'sellers.csv'

exports.uri = '/v1/sellers?include=bank_accounts,reviews'