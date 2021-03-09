const detail = data => {
    return {
        id: data.id,
        parent_id: data.parent_id,
        name: data.translations.data[0].name
    }
};

const headers = [
    { id: 'id', title: 'ID' },
    { id: 'parent_id', title: 'ID parent' },
    { id: 'name', title: 'Nom' }
]

const filename = 'categories.csv'

const uri = '/v1/categories?include=""'

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