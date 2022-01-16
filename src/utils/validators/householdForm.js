const validator = require("validator");

/**
 *
 * @param {{
 *      name: string,
 *      area: number,
 *      thumbnail: string,
 *      locationLatitude: number,
 *      locationLongitude: number,
 *      baseConsumption: number,
 *      batteryMaxCapacity: number,
 *      sellRatioOverProduction: number,
 *      buyRatioUnderProduction: number,
 *      windTurbinesActive: number,
 *      windTurbinesMaximumProduction: number,
 *      windTurbinesCutinWindspeed: number,
 *      windTurbinesCutoutWindspeed: number,
 *      consumptionSpikeAmplitudeMean: number,
 *      consumptionSpikeAmplitudeVariance: number,
 *      consumptionSpikeDurationMean: number,
 *      consumptionSpikeDurationVariance: number
 *  }} formdata Form to validate
 * @returns {string[]} A list of errors. If empty, no errors were found.
 */
function validateForm(formdata) {
    const validName = /^[\w\d\s\:\(\)\[\]]+$/i;
    const errors = [];
    if (!validName.test(formdata.name)) errors.push("Incorrect name");
    if (!validator.isUrl(formdata.thumbnail || "")) errors.push("Invalid thumbnail url");
    if (isNaN(formdata.area)) errors.push("Incorrect area, must be a number");
    if (isNaN(formdata.locationLatitude)) errors.push("Incorrect area, must be a number");
    if (isNaN(formdata.locationLongitude)) errors.push("Incorrect area, must be a number");
    if (isNaN(formdata.baseConsumption)) errors.push("Incorrect baseconsumption, must be a positive number");
    if (isNaN(formdata.batteryMaxCapacity)) errors.push("Incorrect battery max capacity, must be a positive number");
    if (isNaN(formdata.sellRatioOverProduction))
        errors.push("Incorrect sell-ratio during overproduction, must be a positive number");
    if (isNaN(formdata.buyRatioUnderProduction))
        errors.push("Incorrect buy-ratio during underproduction, must be a positive number");
    if (isNaN(formdata.windTurbinesActive))
        errors.push("Incorrect number of active windturbines, must be a positive number");
    if (isNaN(formdata.windTurbinesMaximumProduction))
        errors.push("Incorrect max production, must be a positive number");
    if (isNaN(formdata.windTurbinesCutinWindspeed)) errors.push("Incorrect cutin windspeed, must be a positive number");
    if (isNaN(formdata.windTurbinesCutoutWindspeed))
        errors.push("Incorrect cutout windspeed, must be a positive number");
    if (isNaN(formdata.consumptionSpikeAmplitudeMean))
        errors.push("Incorrect mean consumption amplitude, must be a positive number");
    if (isNaN(formdata.consumptionSpikeAmplitudeVariance))
        errors.push("Incorrect consumption amplitude variance, must be a positive number");
    if (isNaN(formdata.consumptionSpikeDurationMean))
        errors.push("Incorrect mean consumption spike duration, must be a positive number");
    if (isNaN(formdata.consumptionSpikeDurationVariance))
        errors.push("Incorrect consumption spike duration variance, must be a positive number");

    return errors;
}

module.exports = { validateForm };
