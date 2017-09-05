const CONFIG = require("./config.json");
const scraper = require('./modules/scraper/scraper.js');
require("log-timestamp")(function () { return "[" + new Date().toTimeString().substring(0, 8) + "] " + "%s" });;

scraper.startScrapingService(CONFIG.URL, CONFIG.UPDATE_INTERVAL)
    .then(() => {
        console.log("StartUp DONE");
        require("./routes")(CONFIG.EXPRESS_PORT);
    })
    .catch(err => {
        console.log(err);
    });