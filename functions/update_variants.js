const axios = require('axios');
const { base_uri } = require('../config');

const updateVariants = async (page = 60) => {
    try {
        console.log(page)
        const { data: { data: variants }, data: { meta: pagination } } = await axios.get(`${base_uri}/v1/catalog/products/variants?context[user_group_id]=1&page=${page}`)
        for (let i = 0; i < variants.length; i++) {
            const variant = variants[i]
            try {
                const response = await axios.patch(`${base_uri}/v1/catalog/products/variants/${variant.id}?context[user_group_id]=1`, {
                    sort_offers_method: "cheaper"
                })
                console.log(response.status, ' | ', variant.id)
            } catch (error) {
                console.log(error.status, ' | ', variant.id, ' --- ERROR ---')
            }
        }
        if (pagination.pagination.current_page <= pagination.pagination.total_pages) {
            return updateVariants(pagination.pagination.current_page + 1)
        }
    }
    catch (error) {
        console.log(error)
    }
}

module.exports = updateVariants