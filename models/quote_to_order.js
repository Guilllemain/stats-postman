const moment = require('moment')

moment.locale('fr')

exports.detail = data => {
    const mandatory_states = [31, 37]
    const states_id = data.state_logs.data.map(state => state.to_state.data.id)
    const is_order = mandatory_states.every(state => states_id.includes(state))
    return {
        id: data.id,
        is_order
    }
};

exports.headers = [
    { id: 'id', title: 'ID' },
    { id: 'is_order', title: 'Devis transformé' },
]

exports.filename = 'quote_to_order.csv'

exports.uri = '/v1/orders?include=state_logs'