const scraper = require('./modules/scraper/scraper.js');
require("log-timestamp")(function () { return "[" + new Date().toTimeString().substring(0, 8) + "] " + "%s" });;

const express = require("express");
const app = express();

//config.json
const PORT = 8080;
const UPDATE_INTERVAL = 0.05;
const URL = "https://www.justeat.it/area/42121-reggio-emilia/?lat=44.7004035&long=10.6301433";

scraper.startScrapingService(URL, UPDATE_INTERVAL)
    .then(() => {
        console.log("StartUp DONE");
        require("./routes")(app, PORT);
    })
    .catch(err => {
        console.log(err);
    });