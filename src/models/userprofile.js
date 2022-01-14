var mongoose = require("mongoose");

var userprofileSchema = new mongoose.Schema(
    {
        firstname: String,
        lastname: String,
        email: String,
        enabled: Boolean,
        disabledUntil: Date,
        dashboard: [Number],
        loginProvider: String,
        role: String
    },
    { versionKey: true }
);

const userprofile = mongoose.model("userprofile", userprofileSchema);

module.exports = userprofile;