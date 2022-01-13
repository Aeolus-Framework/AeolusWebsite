const express = require('express')
const User = require('../models/user-model')
const router = new express.Router()

router.get('/dashboard', async (req, res) => {
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

router.get('/admin', async (req, res) => {
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

//Coal power
router.post('/admin/coal', async (req, res) => {})

module.exports = router