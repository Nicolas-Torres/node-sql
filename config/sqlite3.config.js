const sqlite3Config = { 
    client: 'sqlite3',
    connection: {
        filename: './db/ecommerce.sqlite'
    },
    useNullAsDefault: true
 }

module.exports = sqlite3Config
