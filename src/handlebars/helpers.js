module.exports = {
    ifeq: function (a, b, options) {
        if (a === b) {
            return options.fn(this);
        }
        return options.inverse(this);
    },
    ifAdmin: function (a, options) {
        if (a === "Admin") {
            return options.fn(this);
        }
        return options.inverse(this);
    }
};
