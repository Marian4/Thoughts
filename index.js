const express = require('express')
const exphbs = require('express-handlebars')
const session = require('express-session')
const FileStore = require('session-file-store')(session)
const flash = require('express-flash')
const conn = require('./db/conn')
const { cookie } = require('express/lib/response')
const app = express()
const toughtsRouter = require('./routes/toughtsRoutes')
const authRouter = require('./routes/authRoutes')
const ToughtsController = require('./controllers/ToughtsController')
const PORT = 3000

// models

const User = require('./models/User')
const Tought = require('./models/Tought')

// configurações

//engine
const hbs = exphbs.create({
    partialsDir: ['views/partials']
})

app.engine('handlebars', hbs.engine)
app.set('view engine', 'handlebars')
app.use(express.static('public'))

//req.body
app.use(express.urlencoded({
    extended: true
}))
app.use(express.json())

//session
app.use(session({
    name: "session",
    secret: "our_secret",
    resave: false,
    saveUninitialized: false,
    store: new FileStore({
        logFn: function (){},
        path: require('path').join(require('os').tmpdir(), 'sessions')
    }),
    cookie: {
        secure: false,
        maxAge: 3600000,
        expires: new Date(Date.now() + 3600000),
        httpOnly: true
    }
}))

//flash messages
app.use(flash())

//midleware set session to res
app.use((req, res, next) => {
    if(req.session.userid){
        res.locals.session = req.session
    }

    next()
})

app.use('/toughts', toughtsRouter)
app.use('/', authRouter)

app.get('/', ToughtsController.getAllToughts)

conn.sync().then( () => {
    app.listen(3000)
}).catch((err) => {
    console.log(err)
})