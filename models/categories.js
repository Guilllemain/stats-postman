const detail = data => {
    return {
        id: data.id,
        parent_id: data.parent_id,
        depth: data.level_depth,
        name: data.translations.data[0].name,
        image: data.cover_image_url ? 'Yes' : 'No',
    }
};

const headers = [
    { id: 'id', title: 'ID' },
    { id: 'parent_id', title: 'ID parent' },
    { id: 'depth', title: 'Niveau' },
    { id: 'name', title: 'Nom' },
    { id: 'image', title: 'Image' },
]

const filename = 'categories.csv'

const uri = '/v1/catalog/categories?include=""'

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