const express = require("express");
const router = new express.Router();
const aeolusAPI = require("../aeolusAPI");
const mathutil = require("../utils/math");
const householdValidator = require("../utils/validators/householdForm");

router.get("/", async (req, res) => {
    const requestedHouseholdId = req.query.household;
    const householdRes = await aeolusAPI.fetchData("/simulator/household", "get", req.session.jwt);

    if (householdRes.data?.length === 0) {
        return res.render("dashboard", { profile: req.session.profile });
    }

    const household = householdRes.data.find(h => h._id === requestedHouseholdId) || householdRes.data[0];

    //Get values for dashboard
    const [consumptionRes, productionRes, bufferRes, windspeedRes, priceRes, ratioRes] = await Promise.all([
        aeolusAPI.fetchData(`/simulator/household/${household._id}/latest/Consumption`, "get", req.session.jwt),
        aeolusAPI.fetchData(`/simulator/household/${household._id}/latest/Production`, "get", req.session.jwt),
        aeolusAPI.fetchData(`/simulator/household/${household._id}/latest/Battery`, "get", req.session.jwt),
        aeolusAPI.fetchData("/simulator/windspeed", "get", req.session.jwt),
        aeolusAPI.fetchData("/simulator/market", "get", req.session.jwt),
        aeolusAPI.fetchData(`/simulator/household/${household._id}`, "get", req.session.jwt)
    ]);

    if (
        (consumptionRes.statusCode !== 200 || productionRes.statusCode !== 200 || bufferRes.statusCode !== 200,
        windspeedRes.statusCode !== 200,
        priceRes.statusCode !== 200,
        ratioRes.statusCode !== 200)
    ) {
        return res.status(500).send();
    }

    var consumptionValue = mathutil.round(consumptionRes.data?.consumption, 0);
    var productionValue = mathutil.round(productionRes.data?.production, 0);
    var bufferValue = mathutil.round(bufferRes.data?.energy, 0);
    var windspeedValue = mathutil.round(windspeedRes.data?.windspeed, 0);
    var priceValue = mathutil.round(priceRes.data?.price.value, 2);
    var buyRatioValue = mathutil.round(ratioRes.data?.buyRatioUnderProduction * 100, 1);
    var sellRatioValue = mathutil.round(ratioRes.data?.sellRatioOverProduction * 100, 1);

    //calculate efficiency
    var efficiencyValue = (productionValue / consumptionValue) * 100;
    efficiencyValue = mathutil.round(efficiencyValue, 1);

    res.render("dashboard", {
        profile: req.session.profile,
        title: "Aeolus - Dashboard",
        household: {
            _id: household._id,
            thumbnail: household.thumbnail,
            consumption: consumptionValue + " Wh",
            production: productionValue + " Wh",
            buffer: bufferValue + " J",
            efficiency: efficiencyValue + " %",
            wind: windspeedValue + " m/s",
            price: priceValue + " sek",
            buyRatio: buyRatioValue + " % to buy",
            sellRatio: sellRatioValue + " % to sell"
        },
        households: householdRes.data
    });
});

router.get("/create-household", (req, res) => {
    res.render("create_household", {
        profile: req.session.profile,
        household: {
            name: "",
            area: 120,
            thumbnail: "",

            locationLatitude: 65.61788868204044,
            locationLongitude: 22.13848008165606,

            baseConsumption: 500,
            batteryMaxCapacity: 1000000,
            sellRatioOverProduction: 0.5,
            buyRatioUnderProduction: 0.5,

            windTurbinesActive: 2,
            windTurbinesMaximumProduction: 4000,
            windTurbinesCutinWindspeed: 4,
            windTurbinesCutoutWindspeed: 25,

            consumptionSpikeAmplitudeMean: 2300,
            consumptionSpikeAmplitudeVariance: 400,
            consumptionSpikeDurationMean: 35,
            consumptionSpikeDurationVariance: 10
        }
    });
});

router.post("/create-household", async (req, res) => {
    const formdata = req.body || {};
    const errors = householdValidator.validateForm(formdata);

    const newHousehold = {
        owner: formdata.owner,
        name: formdata.name,
        thumbnail: formdata.thumbnail,
        area: formdata.area,
        location: {
            latitude: formdata.locationLatitude,
            longitude: formdata.locationLongitude
        },
        baseConsumption: formdata.baseConsumption,
        battery: {
            maxCapacity: formdata.batteryMaxCapacity
        },
        sellRatioOverProduction: formdata.sellRatioOverProduction,
        buyRatioUnderProduction: formdata.buyRatioUnderProduction,
        windTurbines: {
            active: formdata.windTurbinesActive,
            maximumProduction: formdata.windTurbinesMaximumProduction,
            cutinWindspeed: formdata.windTurbinesCutinWindspeed,
            cutoutWindspeed: formdata.windTurbinesCutoutWindspeed
        },
        consumptionSpike: {
            AmplitudeMean: formdata.consumptionSpikeAmplitudeMean,
            AmplitudeVariance: formdata.consumptionSpikeAmplitudeVariance,
            DurationMean: formdata.consumptionSpikeDurationMean,
            DurationVariance: formdata.consumptionSpikeDurationVariance
        }
    };

    let response;
    if (!errors?.length) {
        response = await aeolusAPI.fetchData("/simulator/household", "POST", req.session.jwt, newHousehold);
        if (response.statusCode === 400) errors.push(...response.data);
        if (response.statusCode === 500) errors.push("Something went wrong (500)");
    }

    if (!errors.length) {
        res.redirect(`/dashboard?household=${response.data._id}`);
    } else {
        res.render("create_household", {
            profile: req.session.profile,
            household: req.body,
            errors
        });
    }
});

router.post("/change-buy-ratio", async (req, res) => {
    const buyRatio = req.body.buyRatio / 100;
    const householdId = req.body.id;

    const apiResponse = await aeolusAPI.fetchData(`/simulator/household/${householdId}`, "PATCH", req.session.jwt, {
        buyRatioUnderProduction: buyRatio
    });

    if (apiResponse.statusCode === 200) {
        res.redirect(302, `/dashboard?household=${householdId}`);
    } else {
        res.redirect(302, `/dashboard?household=${householdId}&error=${apiResponse.statusCode}`);
    }
});

router.post("/change-sell-ratio", async (req, res) => {
    const sellRatio = req.body.sellRatio / 100;
    const householdId = req.body.id;

    const apiResponse = await aeolusAPI.fetchData(`/simulator/household/${householdId}`, "PATCH", req.session.jwt, {
        sellRatioOverProduction: sellRatio
    });

    if (apiResponse.statusCode === 200) {
        res.redirect(302, `/dashboard?household=${householdId}`);
    } else {
        res.redirect(302, `/dashboard?household=${householdId}&error=${apiResponse.statusCode}`);
    }
});

module.exports = router;
