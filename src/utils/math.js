/**
 *
 * @param {number} number number to round
 * @param {number} precisoin Number of decimals
 * @returns {number} NUmber with the specified precision
 */
function round(number, precision) {
    const decimals = Math.pow(10, precision);
    return Math.round((number + Number.EPSILON) * decimals) / decimals;
}

module.exports = { round };
