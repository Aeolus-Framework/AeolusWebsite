const { OAuth2Client } = require("google-auth-library");

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) throw new Error("Google client id and client secret must be non-empty");

const client = new OAuth2Client(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET);

async function verify(token) {
    let ticket;
    try {
        ticket = await client.verifyIdToken({
            idToken: token,
            audience: GOOGLE_CLIENT_ID
        });
    } catch (error) {
        return { validToken: false };
    }

    const payload = ticket.getPayload();
    const email = payload["email"];
    const firstname = payload["given_name"];
    const lastname = payload["family_name"];
    const profilePicture = payload["picture"];

    return {
        validToken: true,
        email,
        firstname,
        lastname,
        profilePicture
    };
}

module.exports = { verify, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET };
