const moment = require('moment')

moment.locale('fr')

exports.detail = data => {
    const lines = []
    const tags = []
    if (data.tags.data.length > 0) {
        data.tags.data.forEach(tag => {
            tags.push(tag.name)
        })
        tags.join(', ')
    }
    data.messages.data.forEach(message => {
        lines.push({
            id: data.id,
            status: data.status,
            created_at: moment(data.created_at).format('L'),
            updated_at: moment(data.updated_at).format('L'),
            order_number: data.order_seller ? data.order_seller.data.reference : '',
            subject: message.subject,
            message: message.body,
            message_created_at: moment(message.created_at).format('L'),
            seller: data.seller ? data.seller.data.name : '',
            tags
        })
    })
    return lines
}

exports.headers = [
    { id: 'id', title: 'ID' },
    { id: 'status', title: 'Statut' },
    { id: 'created_at', title: 'Date de creation' },
    { id: 'updated_at', title: 'Date de modification' },
    { id: 'order_number', title: 'Commande' },
    { id: 'subject', title: 'Sujet' },
    { id: 'message', title: 'Message' },
    { id: 'message_created_at', title: 'Date du message' },
    { id: 'seller', title: 'Vendeur' },
    { id: 'tags', title: 'Tags' }
]

exports.filename = 'tickets.csv'

exports.uri = '/v1/tickets?include=messages,seller,order_seller,tags'