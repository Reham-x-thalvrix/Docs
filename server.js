const express = require("express");
const path = require("path");
const cors = require("cors");
const morgan = require("morgan");

const settings = require("./settings.json");

const loadRoutes = require("./core/router");

const app = express();

app.use(express.json());

app.use(express.urlencoded({
    extended: true
}));

if (settings.cors) {
    app.use(cors());
}

app.use(morgan("dev"));

app.use(express.static(path.join(__dirname, "public")));

app.set("views", path.join(__dirname, "views"));

app.set("view engine", "ejs");

loadRoutes(app);

app.use((req, res) => {

    res.status(404).json({

        success: false,

        message: "Route Not Found"

    });

});

app.listen(settings.port, () => {

    console.log("");

    console.log("===================================");

    console.log(`Server Running`);

    console.log(`Port : ${settings.port}`);

    console.log(`URL : —_—:${settings.port}`);

    console.log("===================================");

});
