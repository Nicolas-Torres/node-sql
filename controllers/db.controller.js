const knex = require('knex')

module.exports = class Database {
    constructor(config, table){
        this.Knex = knex(config)
        this.table = table
    }

    async selectAll(){
        try {
            return await this.Knex.from(this.table)
                .select('*')
        } catch (error){
            console.log(error)
        }
    }

    async insertValue(obj){
        try {
            await this.Knex(this.table)
                .insert(obj)
        } catch(error) {
            console.log(error)
        }
    }
}