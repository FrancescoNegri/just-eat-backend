const CONFIG = require("./config.json");
const scraper = require('./modules/scraper/scraper.js');
require("log-timestamp")(function () { return "[" + new Date().toTimeString().substring(0, 8) + "] " + "%s" });;

const express = require("express");
const app = express();

scraper.startScrapingService(CONFIG.URL, CONFIG.UPDATE_INTERVAL)
    .then(() => {
        console.log("StartUp DONE");
        require("./routes")(app, CONFIG.EXPRESS_PORT);
    })
    .catch(err => {
        console.log(err);
    });