var mongoose = require("mongoose");

var userprofileSchema = new mongoose.Schema(
    {
        firstname: { type: String, required: true, trim: true },
        lastname: { type: String, required: true, trim: true },
        profilePicture: { type: String, required: true, trim: true },
        role: { type: String, required: true },
        email: { type: String, required: true, trim: true },
        enabled: { type: Boolean, required: true },
        disabledUntil: Date,
        dashboard: { type: [Number], required: true, default: [0, 1, 2, 3, 4] },
        loginProvider: { type: String, required: true }
    },
    { versionKey: false }
);

const userprofile = mongoose.model("userprofile", userprofileSchema);

module.exports = userprofile;
