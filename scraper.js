const restaurantsscraper = require("./restaurants-scraper.js");
const menuScraper = require("./menu-scraper.js");
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
                console.log("ERROR:", err);
                return reject(err);
            });
    });
}

const scrapingCallback = (restaurants) => {
    // console.log(JSON.stringify(restaurants));
    // console.log("\n");
    console.log(Object.keys(restaurants).length.toString(), "ristoranti disponibili al momento");
    restaurantsData = restaurants;
    var updateInterval = setInterval(() => {
        restaurantsscraper.scrapeRestaurants(scrapingTarget)
            .then(newRestaurants => {
                aKey = JSON.stringify(Object.keys(restaurants).sort());
                bKey = JSON.stringify(Object.keys(newRestaurants).sort());
                if (aKey !== bKey) {
                    console.log("DIVERSO!");
                    clearInterval(updateInterval);
                    restaurants = newRestaurants;
                    completeScraping()
                        .then(restaurants => {
                            scrapingCallback(restaurants);
                        })
                        .catch(err => {
                            console.log(err);
                        });
                }
                else {
                    //console.log("Business as usual");
                }
            })
    }, updateTime);
}

exports.startScrapingService = (scrapingUrl) => {
    scrapingTarget = scrapingUrl;
    console.log("Servizio di scraping avviato");
    console.log("L'update della lista dei ristoranti disponibili verrà effettuato ogni", updateTime / (60 * 1000), "minuti ...");
    completeScraping()
        .then(restaurants => {
            scrapingCallback(restaurants);
        })
        .catch(err => {
            console.log(err);
        });
}

exports.getRestaurantsData = () => {
    return restaurantsData;
}