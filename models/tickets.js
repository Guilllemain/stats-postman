const moment = require('moment')

moment.locale('fr')

const detail = data => {
    // get all tags linked to the ticket
    let tags;
    if (data.tags.data.length > 0) {
        tags = data.tags.data.map(tag => tag.name).join(', ')
    }

    return data.messages.data.map(message => {
        return {
            id: data.id,
            status: data.status,
            created_at: moment(data.created_at).format('L'),
            updated_at: moment(data.updated_at).format('L'),
            order_number: data.order_seller?.data.reference,
            from: message.user.data.roles.data[0]?.type,
            subject: data.subject,
            message: message.body,
            message_created_at: moment(message.created_at).format('L'),
            seller: data.seller?.data.name,
            tags: tags ?? ''
        }
    })
}

const headers = [
    { id: 'id', title: 'ID' },
    { id: 'status', title: 'Statut' },
    { id: 'created_at', title: 'Date de creation' },
    { id: 'updated_at', title: 'Date de modification' },
    { id: 'order_number', title: 'Commande' },
    { id: 'from', title: 'De' },
    { id: 'subject', title: 'Sujet' },
    { id: 'message', title: 'Message' },
    { id: 'message_created_at', title: 'Date du message' },
    { id: 'seller', title: 'Vendeur' },
    { id: 'tags', title: 'Tags' }
]

const filename = 'tickets.csv'

const uri = '/v1/tickets?include=messages.user.roles,seller,order_seller,tags'

module.exports = {
    uri,
    page_size: 200,
    models: [
        {
            detail,
            headers,
            filename,
            final_data: []
        }
    ]
}