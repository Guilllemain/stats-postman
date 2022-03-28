const moment = require('moment')

moment.locale('fr')

const detail = data => {
    return {
        id: data.id,
        subject: data.subject,
        email: data.to,
        type: data.type,
        notifiable_type: data.notifiable_type,
        created_at: moment(data.created_at).format('L')
    }
};

const headers = [
    { id: 'id', title: 'ID' },
    { id: 'subject', title: 'Sujet' },
    { id: 'email', title: 'Email' },
    { id: 'type', title: 'Type' },
    { id: 'notifiable_type', title: 'Cible' },
    { id: 'created_at', title: 'Envoyé le' }
]

const filename = 'notifications.csv'

const uri = '/v1/notifications/logs?filter[type]=mail'

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