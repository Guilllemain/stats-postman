const detail = data => {
    return {
        id: data.id,
        feature_id: data.feature_type_id,
        value: data.translations.data[0].value
    }
};

const headers = [
    { id: 'id', title: 'ID' },
    { id: 'feature_id', title: 'Feature ID' },
    { id: 'value', title: 'Valeur' }
]

const filename = 'feature_values.csv'

const uri = '/v1/catalog/features/values?include=""'

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