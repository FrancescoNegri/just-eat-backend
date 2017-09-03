const restaurantsscraper = require("./restaurants-scraper.js");
const menuScraper = require("./menu-scraper.js");
const clc = require("cli-color");
var scrapingTarget = "";
const updateTime = 2 * 60 * 1000;

var restaurantsData;

//ATOMIC COUNTER VA SCHIFO, pensare ad altre soluzioni
const completeScraping = () => {
    return new Promise((resolve, reject) => {
        restaurantsscraper.scrapeRestaurants(scrapingTarget)
            .then(restaurants => {
                var atomicCounter = 0;
                for (var element in restaurants) {
                    atomicCounter++;
                    menuScraper.scrapeMenu(restaurants[element])
                        .then(restaurant => {
                            restaurants[element] = restaurant;
                            atomicCounter--;
                            if (atomicCounter == 0) return resolve(restaurants);
                        })
                }
            })
            .catch(err => {
                console.log(clc.green("ERROR:", err));
                return reject(err);
            });
    });
}

const scrapingCallback = (restaurants) => {
    // console.log(JSON.stringify(restaurants));
    // console.log("\n");
    console.log(clc.green("Ristoranti disponibili:", Object.keys(restaurants).length.toString()));
    restaurantsData = restaurants;
    var updateInterval = setInterval(() => {
        restaurantsscraper.scrapeRestaurants(scrapingTarget)
            .then(newRestaurants => {
                aKey = JSON.stringify(Object.keys(restaurants).sort());
                bKey = JSON.stringify(Object.keys(newRestaurants).sort());
                if (aKey !== bKey) {
                    clearInterval(updateInterval);
                    restaurants = newRestaurants;
                    completeScraping()
                        .then(restaurants => {
                            scrapingCallback(restaurants);
                        })
                        .catch(err => {
                            console.log(clc.green(err));
                        });
                }
                else {
                    //console.log("Business as usual");
                }
            })
    }, updateTime);
}

exports.startScrapingService = (scrapingUrl) => {
    return new Promise((resolve, reject) => {
        scrapingTarget = scrapingUrl;
        console.log(clc.green("Servizio di scraping avviato"));
        console.log(clc.green("L'update della lista dei ristoranti disponibili verrà effettuato ogni", updateTime / (60 * 1000), "minuti ..."));
        completeScraping()
            .then(restaurants => {
                scrapingCallback(restaurants);
                return resolve();
            })
            .catch(err => {
                console.log(clc.green(err));
                return reject(err);
            });
    });
}

exports.getRestaurantsData = () => {

    return restaurantsData;
}