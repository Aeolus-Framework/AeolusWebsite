const http = require("http");
const express = require("express");
const hbs = require("hbs");
const path = require("path");
const userRouter = require("./routes/user-route");
const oauth = require("./routes/oauth");
//const bodyParser = require("body-parser");
//const redis = require('redis')
const session = require("express-session");

const app = express();
const port = process.env.PORT || 5500;
const publicDirectoryPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

//let RedisStore = require('connect-redis') (session)
//let redisClient = redis.createClient()

// Middleware
app.use(express.urlencoded()); //Parse URL-encoded bodies

app.use(
  session({
    //store: new RedisStore({ client: redisClient }),
    secret: "ProjectAl",
    resave: false,
    saveUninitialized: true,
  })
);

// Routes
app.use(userRouter);
app.use(oauth);
app.use(express.static(publicDirectoryPath));

// Handlebars
hbs.registerPartials(partialsPath);
app.set("view engine", "hbs");
app.set("views", viewsPath);


app.get("", async (req, res) => {
  res.render("index", {
    title: "Aeolus",
  });
});

app.listen(port, () => {
  console.log("Server is up on port " + port);
});
