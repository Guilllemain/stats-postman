const detail = data => {
    return {
        id: data.id,
        name: data.translations.data[0].name
    }
};

const headers = [
    { id: 'id', title: 'ID' },
    { id: 'name', title: 'Nom' }
]

const filename = 'features.csv'

const uri = '/v1/catalog/features/types?include=""'

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