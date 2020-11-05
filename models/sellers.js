const detail = data => {
    let corsica = false
    data.shipping_offers.data.forEach(offer => {
        offer.shipping_offer_zones.data.forEach(zone => {
            if (zone.id_zone === 7) corsica = true
        })
    })
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
        DS_account_number: data.additional_information.dropshipping_waiting_account_number.value,
        MP_account_number: data.additional_information.marketplace_seller_account_number.value,
        reviews_amount: data.reviews.data.length,
        corsica: corsica ? "Oui" : "Non"
    }
};

const headers = [
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
    { id: 'DS_account_number', title: 'Compte DS' },
    { id: 'MP_account_number', title: 'Compte MP' },
    { id: 'reviews_amount', title: 'Nombre avis' },
    { id: 'corsica', title: 'Corse' },
]

const filename = 'sellers.csv'

const uri = '/v1/sellers?include=bank_accounts,reviews,additionnal_information,shipping_offers.shipping_offer_zones'

module.exports = {
    uri,
    models: [
        {
            detail,
            headers,
            filename,
            final_data: []
        }
    ]   
}