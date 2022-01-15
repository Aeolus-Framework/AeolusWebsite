const express = require("express");
const router = new express.Router();
const fetch = require("node-fetch");
const aeolusAPI = require("../aeolusAPI");

router.get("/", async (req, res) => {
  const [powerplantRes, marketRes, blackoutRes] = await Promise.all([
    aeolusAPI.fetchData("/simulator/powerplant/status", "get", req.session.jwt),
    aeolusAPI.fetchData("/simulator/market", "get", req.session.jwt),
    aeolusAPI.fetchData("/simulator/grid/blackouts", "get", req.session.jwt),
  ]);

  if (
    powerplantRes.statusCode !== 200 ||
    marketRes.statusCode !== 200 ||
    blackoutRes.statusCode !== 200
  ) {
    return res.status(500).send();
  }

  const powerplantStatus = powerplantRes.data.active ? "Running" : "Stopped";
  const powerplantProduction = powerplantRes.data.production.value;
  const marketDemand =
    Math.round((marketRes.data.demand + Number.EPSILON) * 100) / 100;
  const marketPrice = marketRes.data.price.value;
  const isBlackout = blackoutRes.data.length === 0;

  res.render("admin", {
    title: "Aeolus - Admin",
    power: powerplantStatus + " " + powerplantProduction + " kWh",
    ratio: "2:1" + " Buffer / Market",
    demand: marketDemand + " kWh",
    price: marketPrice + " kr / watt",
    modelPrice: marketPrice + " kr / watt",
    prosumers: "458" + " online", //Not implemented
    blackout: isBlackout,
  });
});

router.get("/blackoutlist", async (req, res) => {
  const blackoutResponse = await fetch(`${API_HOST}/simulator/grid/blackouts`);
  const blackoutList = await blackoutResponse.json();
  res.render("blackoutlist", { blackoutList });
});

router.get("/prosumerlist", async (req, res) => {
  //Get all prosumers

  res.render("prosumerlist", {});
});

router.post("/changepowerplant", async (req, res) => {
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

router.post("changeratio", async (req, res) => {

})

module.exports = router;
