(async () => {
    const knex = require('knex')
    const MariaDBConfig = require('./config/MariaDB.config')
    const sqlite3Config = require('./config/sqlite3.config')

    const TABLA_MENSAJES = 'mensajes'
    const TABLA_PRODUCTOS = 'productos'
    
    try {
        //! tabla mensajes
        let Knex = knex(sqlite3Config)
        const exists1 = await Knex.schema.hasTable(TABLA_MENSAJES)
        console.log('tabla mensajes existe?', exists1)
        if(!exists1){
            await Knex.schema.createTable(TABLA_MENSAJES, tabla => {
                    tabla.increments('id')
                    tabla.string('hora')
                    tabla.string('correo')
                    tabla.string('mensaje')
                })
                .then(() => {console.log('tabla MENSAJES creada')})
        } else {
            console.log('ya existe la tabla MENSAJES')
        }

        //! tabla productos
        Knex = knex(MariaDBConfig)
        const exists2 = await Knex.schema.hasTable(TABLA_PRODUCTOS)
        console.log('tabla productos existe?', exists2)
        if(!exists2){
            await Knex.schema.createTable(TABLA_PRODUCTOS, tabla => {
                    tabla.increments('id')
                    tabla.string('title')
                    tabla.string('price')
                    tabla.string('thumbnail')
                }).then(() => {console.log('tabla PRODUCTOS creada')})
        } else {
            console.log('ya existe la tabla PRODUCTOS')
        }
    } catch (error) {
        console.log('a',error)
    } finally {
        return process.exit()
    }
})();

