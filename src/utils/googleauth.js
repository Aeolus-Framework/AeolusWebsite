const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client("828947200728-berqofeu3s3fn0eq4fjqq66c3g7o0sop.apps.googleusercontent.com", "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", "https://aeolus.se/signin-google");

async function verify(token) {
    let ticket;
    try {
        ticket = await client.verifyIdToken({
            idToken: token,
            audience: "828947200728-berqofeu3s3fn0eq4fjqq66c3g7o0sop.apps.googleusercontent.com"
        });
    } catch (error) {
        return { validToken: false };
    }

    const payload = ticket.getPayload();
    const email = payload["email"];
    const username = email.substring(0, email.indexOf("@"));

    return {
        validToken: true,
        username,
        email
    };
}

module.exports = { verify };