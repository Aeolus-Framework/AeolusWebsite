const express = require('express')
const User = require('../models/user-model')
const router = new express.Router()
const fetch = require('node-fetch')
const aeolusAPI = require('../aeolusAPI')

const API_HOST = "http://www.aeolus.se";

router.get('/dashboard', async (req, res) => {
    var ID = req.session.id


    //household
    // const householdResponse = await fetch(`${API_HOST}/simulator/household/${ID}`);
    // const household = await householdResponse.json();
    // const currentConsumption = household.

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
    
    //powerplant
    const powerplantResponse = await aeolusAPI.fetchData("/simulator/powerplant/status", "get", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImpvaG4uZG9lQGV4YW1wbGUuY29tIiwiZXhwIjo1NjQyMTU1MjY5LCJpYXQiOjE2NDIxNTE2NjksImlzcyI6Im5vbmUiLCJyb2xlIjoiYWRtaW4iLCJuYW1lIjoiSm9obiBkb2UiLCJzdWIiOiI2MWRhZTViMGRjNzk0YjQ2OTJjZGYxMTEifQ.0il6Zt2J5oWxHbQm2VAh07yKw8DLZgH7mT-TDOJ98Ps");
    const powerplantStatus = powerplantResponse.data.active;
    const powerplantProduction = powerplantResponse.data.production.value;

    //demand and price
    const market = await aeolusAPI.fetchData("/simulator/market", "get", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImpvaG4uZG9lQGV4YW1wbGUuY29tIiwiZXhwIjo1NjQyMTU1MjY5LCJpYXQiOjE2NDIxNTE2NjksImlzcyI6Im5vbmUiLCJyb2xlIjoiYWRtaW4iLCJuYW1lIjoiSm9obiBkb2UiLCJzdWIiOiI2MWRhZTViMGRjNzk0YjQ2OTJjZGYxMTEifQ.0il6Zt2J5oWxHbQm2VAh07yKw8DLZgH7mT-TDOJ98Ps");
    const marketDemand = market.data.demand;
    const marketPrice = market.data.price.value

    //Blackouts
    const blackoutList = await aeolusAPI.fetchData("/simulator/grid/blackouts", "get", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImpvaG4uZG9lQGV4YW1wbGUuY29tIiwiZXhwIjo1NjQyMTU1MjY5LCJpYXQiOjE2NDIxNTE2NjksImlzcyI6Im5vbmUiLCJyb2xlIjoiYWRtaW4iLCJuYW1lIjoiSm9obiBkb2UiLCJzdWIiOiI2MWRhZTViMGRjNzk0YjQ2OTJjZGYxMTEifQ.0il6Zt2J5oWxHbQm2VAh07yKw8DLZgH7mT-TDOJ98Ps");
    var isBlackout = true;
    if (blackoutList.data.length === 0) {
        isBlackout = false;
    }
    
    res.render('admin', {
        title: 'Aeolus - Admin',
        power: powerplantStatus + ' ' + powerplantProduction + ' kWh',
        ratio: '2:1' + ' Buffer / Market',
        demand: marketDemand + ' kWh',
        price: marketPrice + ' kr / watt',
        modelPrice: marketPrice + ' kr / watt',
        prosumers: '458' + ' online', //Not implemented
        blackout: isBlackout
    })
})

router.get('/admin/blackoutlist', async (req, res) => {
    const blackoutResponse = await fetch(`${API_HOST}/simulator/grid/blackouts`);
    const blackoutList = await blackoutResponse.json();
    res.render('blackoutlist', { blackoutList })
})

router.get('/admin/prosumerlist', async (req, res) => {
    //Get all prosumers

    res.render('prosumerlist', {})
})

router.post('/admin/changepowerplant', async (req, res) => {
    var status = false;
    
    if (req.body.powerStatus === 'running') {
        status = true;
    }

    // const res = await aeolusAPI.fetchData(
    //     '/simulator/powerplant/status', 
    //     'PUT', 
    //     "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImpvaG4uZG9lQGV4YW1wbGUuY29tIiwiZXhwIjo1NjQyMTU1MjY5LCJpYXQiOjE2NDIxNTE2NjksImlzcyI6Im5vbmUiLCJyb2xlIjoiYWRtaW4iLCJuYW1lIjoiSm9obiBkb2UiLCJzdWIiOiI2MWRhZTViMGRjNzk0YjQ2OTJjZGYxMTEifQ.0il6Zt2J5oWxHbQm2VAh07yKw8DLZgH7mT-TDOJ98Ps",
    //     {status}
    // );

    if(res.statusCode === 200){
        res.redirect(302,"/admin")
    } else {
        res.redirect(302, `/admin?error=1`)
    }
})

module.exports = router