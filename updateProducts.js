const updateProducts = require('./functions/update_products')
const getToken = require('./functions/auth')

async function update() {
    await getToken()
    await updateProducts(products)
}

const products = [8188, 10415, 10463, 8343, 10181, 9364, 11951, 8116, 7559, 9741, 11949, 7563, 7561, 8103, 8104, 7861, 11571, 11545, 8092, 8088, 8087, 7863, 7862, 7608, 980291, 110040, 110050, 8384, 11549, 11550, 11551, 11552, 9392, 11532, 11635, 11078, 8086, 11581, 11540, 11569]

update()
