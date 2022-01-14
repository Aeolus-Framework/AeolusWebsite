const jwt = require("./src/utils/jwt")

const token = jwt.createToken("user", "john.doe@example.com", "John doe");

const invalidToken = "";
const res = jwt.verifyToken(invalidToken);