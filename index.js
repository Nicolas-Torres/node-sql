const express = require('express')
const handlebars = require("express-handlebars")
const { Server: HTTPServer } = require('http')
const { Server: SocketServer } = require('socket.io')

const MariaDBConfig = require('./config/MariaDB.config')
const sqlite3Config = require('./config/sqlite3.config')

const Database = require('./controllers/db.controller')

const dbMensajes = new Database(sqlite3Config)
const dbProductos = new Database(MariaDBConfig)

//! SERVER
const app = express()
const PORT = process.env.PORT || 8081

const httpServer = new HTTPServer(app)
const io = new SocketServer(httpServer)

//! MIDDLEWARES
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

//! HANDLEBARS FRONTEND
app.engine('hbs', handlebars.engine({
    extname: "hbs",
    layoutsDir: __dirname + "/views/layouts",
    partialsDir: __dirname + '/views/partials/',
    defaultLayout: "index"
}))

app.set('view engine', 'hbs')
app.set('views', './views')

app.use(express.static('views'))

app.get('/', (req, res) => {
    res.render('main', {
        docTitle: "Desafio"
    })
})

io.on('connection', async socket => {
    //! CONECTADO
    console.log(`conectado: ${socket.id}`)
    
    //! ENVIA PRODUCTOS Y MENSAJES DE LA DB
    try {
        const allProducts = await dbProductos.selectAllProducts()
        const allMessages = await dbMensajes.selectAllMessages()
        socket.emit('productos', allProducts)
        socket.emit('mensajes', allMessages)
    } catch (err) {
        console.log(`Error get all messages from db: ${err.message}`)
    }

    //! RECIBE NUEVO PRODUCTO Y ENVIA A TODOS LOS SOCKETS
    socket.on('nuevo_producto', async data => {
        const { title, price, thumbnail } = data
        try {
            await dbProductos.newProduct({ title, price, thumbnail})
            const allProducts = await dbProductos.selectAllProducts()
            io.sockets.emit('productos', allProducts)
        } catch (error) {
            console.log(error)
        }
    })

    //! RECIBE NUEVO MENSAJE Y ENVIA A TODOS LOS SOCKETS
    socket.on('nuevo_mensaje',  async msg => {
        try {
            const { correo, mensaje, hora } = msg
            await dbMensajes.newMessage({ correo, mensaje, hora})
            const  allMessages = await dbMensajes.selectAllMessages()
            io.sockets.emit('mensajes', allMessages)
        } catch (err) {
            console.log(`Error get all messages from db: ${err.message}`)
        }
    })
})

const server = httpServer.listen(PORT, () => {
    console.log(`Server express, Websockets y handlebars iniciado - PORT: ${PORT}`)
})

server.on('error', error => {
    console.log(error.message)
})


