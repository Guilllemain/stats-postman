const moment = require('moment')

moment.locale('fr')

exports.detail = data => {
    return {
        id: data.id,
        subject: data.subject,
        email: data.to,
        type: data.type,
        notifiable_type: data.notifiable_type,
        created_at: moment(data.created_at).format('L')
    }
};

exports.headers = [
    { id: 'id', title: 'ID' },
    { id: 'subject', title: 'Sujet' },
    { id: 'email', title: 'Email' },
    { id: 'type', title: 'Type' },
    { id: 'notifiable_type', title: 'Cible' },
    { id: 'created_at', title: 'Envoyé le' }
]

exports.filename = 'notifications.csv'

exports.uri = '/v1/notifications/logs?filter[type]=mail'