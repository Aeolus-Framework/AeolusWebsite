const http = require('http');
const express = require('express')
const hbs = require('hbs')
const path = require('path')

const app = express()

const port = process.env.PORT || 3000

const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')

app.set('view engine', 'hbs')
app.set('views', viewsPath)

app.use(express.static(publicDirectoryPath))

app.get('', (req, res) => {
    res.render('index', {
        title: 'Aeolus'
    })
})

app.get('/dashboard', (req, res) => {
    res.render('dashboard', {
        title: 'Aeolus - Dashboard'
    })
})

app.get('/admin', (req, res) => {
    res.render('admin', {
        title: 'Aeolus - Admin'
    })
})

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})
