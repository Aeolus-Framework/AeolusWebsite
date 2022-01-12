const http = require('http');
const express = require('express')
const hbs = require('hbs')
const path = require('path')
const userRouter = require('./routes/user-route')

const app = express()

const port = process.env.PORT || 5500

app.use(userRouter)

const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

app.use(express.static(publicDirectoryPath))

app.get('', async (req, res) => {
    res.render('index', {
        title: 'Aeolus'
    })
    
})

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})
