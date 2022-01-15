const express = require('express');
const router = new express.Router();
const fetch = require('node-fetch');
const aeolusAPI = require('../aeolusAPI');

router.get('/', async (req, res) => {
    var jwt = req.session.jwt


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


router.post("/changebuyratio", async (req, res) => {
    var status = req.body.powerStatus === "running";
  
    const apiResponse = await aeolusAPI.fetchData(
      "/simulator/powerplant/status",
      "PUT",
      req.session.jwt,
      { active: status }
    );
  
    if (apiResponse.statusCode === 200) {
      res.redirect(302, "/admin");
    } else {
      res.redirect(302, `/admin?error=1`);
    }
  });

module.exports = router