const scraper = require('./scraper.js');
require("log-timestamp") (function() { return new Date().toTimeString().substring(0, 9) + '%s' });;

scraper.startScrapingService("https://www.justeat.it/area/40139-bologna/?lat=44.4815163&long=11.3806012")
    .then(() => {
        console.log("StartUp DONE");
    })
    .catch(err => {
        console.log(err);
    });