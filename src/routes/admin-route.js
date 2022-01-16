const express = require("express");
const router = new express.Router();
const fetch = require("node-fetch");
const mathutil = require("../utils/math");
const aeolusAPI = require("../aeolusAPI");
const householdValidator = require("../utils/validators/householdForm");
const validator = require("validator");

router.get("/", async (req, res) => {
    const [powerplantRes, marketRes, blackoutRes] = await Promise.all([
        aeolusAPI.fetchData("/simulator/powerplant/status", "get", req.session.jwt),
        aeolusAPI.fetchData("/simulator/market", "get", req.session.jwt),
        aeolusAPI.fetchData("/simulator/grid/blackouts", "get", req.session.jwt)
    ]);

    if (powerplantRes.statusCode !== 200 || marketRes.statusCode !== 200 || blackoutRes.statusCode !== 200) {
        return res.status(500).send();
    }

    const powerplantStatus = powerplantRes.data.active ? "Running" : "Stopped";
    const powerplantProduction = mathutil.round(powerplantRes.data.production.value, 2);
    const marketDemand = mathutil.round(marketRes.data.demand, 2);
    const marketPrice = marketRes.data.price.value;
    const isBlackout = blackoutRes.data.length === 0;

    res.render("admin", {
        profile: req.session.profile,
        title: "Aeolus - Admin",
        power: powerplantStatus + " " + powerplantProduction + " kWh",
        ratio: "2:1" + " Buffer / Market",
        demand: marketDemand + " kWh",
        price: marketPrice + " kr / watt",
        modelPrice: marketPrice + " kr / watt",
        prosumers: "NaN" + " online", //Not implemented
        blackout: isBlackout
    });
});

router.get("/blackouts", async (req, res) => {
    const blackoutResponse = await aeolusAPI.fetchData("/simulator/grid/blackouts", "GET", req.session.jwt);
    if (blackoutResponse.statusCode === 200) {
        return res.render("admin_blackouts", { profile: req.session.profile, blackoutList: blackoutResponse.data });
    }
    return res.status(500).send("Something went wrong");
});

router.post("/changepowerplant", async (req, res) => {
    var status = req.body.powerStatus === "running";

    const apiResponse = await aeolusAPI.fetchData("/simulator/powerplant/status", "PUT", req.session.jwt, {
        active: status
    });

    if (apiResponse.statusCode === 200) {
        return res.redirect(302, "/admin");
    }
    return res.status(500).send("Something went wrong");
});

router.get("/prosumers/", async (req, res) => {
    const prosumerRes = await aeolusAPI.fetchData("/social/users/", "get", req.session.jwt);
    if (prosumerRes.statusCode === 200) {
        return res.render("admin_prosumers", {
            profile: req.session.profile,
            list: prosumerRes
        });
    }
    return res.status(500).send("Something went wrong");
});

router.get("/prosumers/:id", async (req, res) => {
    const userId = req.params.id;
    const userRes = await aeolusAPI.fetchData(`/social/user/${userId}`, "get", req.session.jwt);
    if (userRes.statusCode !== 200) {
        return res.status(500).send("Something went wrong");
    }

    const firstnameValue = userRes.data.firstname;
    const lastnameValue = userRes.data.lastname;
    const profilePictureValue = userRes.data.profilePicture;
    const emailValue = userRes.data.email;
    const enabledValue = userRes.data.enabled;
    const disabledUntilValue = userRes.data.disabledUntil?.split("T")[0];

    const householdRes = await aeolusAPI.fetchData(`/simulator/households/u/${userId}`, "get", req.session.jwt);
    if (householdRes.statusCode !== 200) {
        return res.status(500).send("Something went wrong");
    }

    res.render("admin_singleprosumer", {
        profile: req.session.profile,
        households: householdRes.data,
        prosumer: {
            firstname: firstnameValue,
            lastname: lastnameValue,
            profilePicture: profilePictureValue,
            email: emailValue,
            enabled: enabledValue,
            households: householdRes.data,
            disabledUntil: disabledUntilValue
        }
    });
});

router.post("/prosumers/:id/", async (req, res) => {
    const userID = req.params.id;
    const changes = {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        profilePicture: req.body.profilePicture,
        email: req.body.email,
        enabled: new Boolean(req.body.enabled),
        disabledUntil: new Date(req.body.disabledUntil)
    };

    const apiResponse = await aeolusAPI.fetchData("/social/user/" + userID, "PATCH", req.session.jwt, changes);
    const changeWasSuccesful = apiResponse.statusCode === 200;

    if (changeWasSuccesful) {
        res.redirect(302, `/admin/prosumers/${userID}`);
    } else {
        const errors = apiResponse.statusCode === 400 ? apiResponse.data : ["Something went wrong"];

        res.render("admin_singleprosumer", {
            profile: req.session.profile,
            errors: errors,
            prosumer: changes
        });
    }
});

//deletes a user
// TODO Change route, currently identical to the route above
router.post("/prosumers/:id/delete", async (req, res) => {
    const userID = req.params.id;

    const apiResponse = await aeolusAPI.fetchData("/social/user/" + userID, "DELETE", req.session.jwt);

    if (apiResponse.statusCode === 204) {
        res.redirect(301, "/admin/prosumers/");
    } else {
        res.redirect(302, `/admin/prosumers/${userID}?error=1`);
    }
});

router.get("/household/:id", async (req, res) => {
    const householdID = req.params.id;

    const householdRes = await aeolusAPI.fetchData(`/simulator/household/${householdID}`, "get", req.session.jwt);
    if (householdRes.statusCode !== 200) {
        return res.status(500).send("Something went wrong");
    }

    res.render("admin_edithousehold", {
        profile: req.session.profile,
        household: {
            _id: householdRes.data._id,
            owner: householdRes.data.owner,
            name: householdRes.data.name,
            thumbnail: householdRes.data.thumbnail,
            area: householdRes.data.area,
            locationLatitude: householdRes.data.location.latitude,
            locationLongitude: householdRes.data.location.longitude,
            blackout: householdRes.data.blackout,
            baseConsumption: householdRes.data.baseConsumption,
            heatingEfficiency: householdRes.data.heatingEfficiency,
            batteryMaxCapacity: householdRes.data.battery.maxCapacity,
            sellRatioOverProduction: householdRes.data.sellRatioOverProduction,
            buyRatioUnderProduction: householdRes.data.buyRatioUnderProduction,
            windTurbinesActive: householdRes.data.windTurbines.active,
            windTurbinesMaximumProduction: householdRes.data.windTurbines.maximumProduction,
            windTurbinesCutinWindspeed: householdRes.data.windTurbines.cutinWindspeed,
            windTurbinesCutoutWindspeed: householdRes.data.windTurbines.cutoutWindspeed,
            consumptionSpikeAmplitudeMean: householdRes.data.consumptionSpike.AmplitudeMean,
            consumptionSpikeAmplitudeVariance: householdRes.data.consumptionSpike.AmplitudeVariance,
            consumptionSpikeDurationMean: householdRes.data.consumptionSpike.DurationMean,
            consumptionSpikeDurationVariance: householdRes.data.consumptionSpike.DurationVariance
        }
    });
});

router.post("/household/:id", async (req, res) => {
    const householdID = req.params.id;
    const formdata = req.body || {};
    const errors = householdValidator.validateForm(formdata);
    if (validator.isMongoId(formdata.owner)) errors.push("Invalid owner");

    formdata.blackout = new Boolean(formdata?.blackout);

    // new fields: owner, blackout
    const apiResponse = await aeolusAPI.fetchData(
        `/simulator/household/${householdID}`,
        "PATCH",
        req.session.jwt,
        formdata
    );

    if (apiResponse.statusCode === 200) {
        res.redirect(302, "/household/:id");
    } else {
        res.redirect(302, `/household/:id?error=1`);
    }
});

router.get("/household/:id/market", async (req, res) => {
    const householdID = req.params.id;

    const householdRes = await aeolusAPI.fetchData(`/simulator/household/${householdID}`, "get", req.session.jwt);
    if (householdRes.statusCode !== 200) {
        return res.status(500).send("Something went wrong");
    }

    var sellLimitValue = householdRes.data.sellLimit;

    res.render("admin_marketlimit", {
        sellLimit: sellLimitValue
    });
});

router.post("/household/:id/market", async (req, res) => {
    const householdID = req.params.id;

    if (!validator.isDate(req.body.start) || !validator.isDate(req.body.end)) {
        res.render("admin_marketlimit", {
            sellLimit: { start: req.body.start, end: req.body.end },
            error: "Must be a Date!"
        });
    } else {
        const apiResponse = await aeolusAPI.fetchData("/simulator/household/" + householdID, "PATCH", req.session.jwt, {
            sellLimit: {
                start: req.body.start,
                end: req.body.end
            }
        });

        if (apiResponse.statusCode === 200) {
            res.redirect(302, "/household/:id/market");
        } else {
            res.redirect(302, `/household/:id/market?error=1`);
        }
    }
});

module.exports = router;
