const knex = require('knex')

const TABLA_MENSAJES = 'mensajes'
const TABLA_PRODUCTOS = 'productos'

module.exports = class Database {
    constructor(config){
        this.Knex = knex(config)
    }

    async selectAllMessages(){
        try {
            return await this.Knex.from(TABLA_MENSAJES)
                .select('*')
        } catch (error){
            console.log(error)
        }
    }

    async newMessage(newMsg){
        try {
            await this.Knex(TABLA_MENSAJES)
                .insert(newMsg)
        } catch(error) {
            console.log(error)
        }
    }

    async selectAllProducts(){
        try {
            return await this.Knex.from(TABLA_PRODUCTOS)
                .select('*')
        } catch (error) {
            console.log(error)
        }
    }

    async newProduct(newProd){
        try{
            await this.Knex(TABLA_PRODUCTOS)
            .insert(newProd)
        } catch (error) {
            console.log(error)
        }
    }
}