const http = require('http');
const express = require('express')
const hbs = require('hbs')
const path = require('path')

const app = express()

const port = process.env.PORT || 5500

const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

app.use(express.static(publicDirectoryPath))

app.get('', (req, res) => {
    res.render('index', {
        title: 'Aeolus'
    })
})

app.get('/dashboard', (req, res) => {
    res.render('dashboard', {
        title: 'Aeolus - Dashboard',
        consumption: '685' + ' Wh',
        production: '285' + ' Wh',
        buffer: '4620' + ' kWh',
        efficiency: '38' + ' %',
        wind: '4' + ' m/s',
        temperature: '-9' + ' °C',
        price: '3.19' + ' sek'
    })
})

app.get('/admin', (req, res) => {
    res.render('admin', {
        title: 'Aeolus - Admin',
        power: 'Running!' + ' ' + '685' + ' Wh',
        ratio: '2:1' + ' Buffer / Market',
        demand: '???' + ' ???',
        price: '3' + ' kr / watt',
        modelPrice: '2' + ' kr / watt',
        prosumers: '458' + ' online',
        blackout: true
    })
})

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})
