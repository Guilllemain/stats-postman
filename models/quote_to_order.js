const moment = require('moment')

moment.locale('fr')

const detail = data => {
    const mandatory_states = [31, 37]
    const states_id = data.state_logs.data.map(state => state.to_state.data.id)
    const is_order = mandatory_states.every(state => states_id.includes(state))
    return {
        id: data.id,
        is_order
    }
};

const headers = [
    { id: 'id', title: 'ID' },
    { id: 'is_order', title: 'Devis transformé' },
]

const filename = 'quote_to_order.csv'

const uri = '/v1/orders?include=state_logs'

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