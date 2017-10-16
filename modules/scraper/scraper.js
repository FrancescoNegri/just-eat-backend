const restaurantsScraper = require("./src/restaurants-scraper.js");
const menuScraper = require("./src/menu-scraper.js");
const clc = require("cli-color");
const fs = require("fs");

const completeScraping = (URL) => {
    return new Promise((resolve, reject) => {
        restaurantsScraper.scrapeRestaurants(URL)
            .then(restaurants => {
                if (Object.keys(restaurants).length == 0) return resolve(restaurants)
                else {
                    var atomicCounter = 0;
                    for (var element in restaurants) {
                        atomicCounter++;
                        menuScraper.scrapeMenu(restaurants[element])
                            .then(restaurant => {
                                restaurants[element] = restaurant;
                                atomicCounter--;
                                if (atomicCounter == 0) return resolve(restaurants);
                            })
                            .catch(err => {
                                return reject(err);
                            });
                    }
                }
            })
            .catch(err => {
                console.log(clc.green("ERROR:", err));
                return reject(err);
            });
    });
}

const selectiveScraping = (restaurants) => {
    return new Promise((resolve, reject) => {
        var atomicCounter = Object.keys(restaurants).length;
        Object.keys(restaurants).forEach((element) => {
            if (!restaurants[element].hasOwnProperty("MENU")) {
                menuScraper.scrapeMenu(restaurants[element])
                    .then(restaurant => {
                        restaurants[element] = restaurant;
                        atomicCounter--;
                        if (atomicCounter == 0) return resolve(restaurants);
                    })
                    .catch(err => {
                        return reject(err);
                    })
            }
            else {
                atomicCounter--;
                if (atomicCounter == 0) return resolve(restaurants);
            }
        });
    });
}

var test = 0;

const scrapingCallback = (restaurants, URL, UPDATE_INTERVAL) => {
    console.log(clc.green("Ristoranti disponibili:", Object.keys(restaurants).length.toString()));
    saveRestaurantsToJSONFile(restaurants);
    var restaurantsUpdateInterval = setInterval(() => {
        restaurantsScraper.scrapeRestaurants(URL)
            .then(newRestaurants => {
                aKey = JSON.stringify(Object.keys(restaurants).sort());
                bKey = JSON.stringify(Object.keys(newRestaurants).sort());
                if (aKey !== bKey) {
                    clearInterval(restaurantsUpdateInterval);
                    Object.keys(restaurants).forEach((item) => {
                        if (newRestaurants[item]) delete newRestaurants[item]
                        else delete restaurants[item];
                    });
                    Object.keys(newRestaurants).forEach((item) => {
                        restaurants[item] = newRestaurants[item];
                    });
                    selectiveScraping(restaurants)
                        .then(restaurants => {
                            scrapingCallback(restaurants, URL, UPDATE_INTERVAL);
                        })
                        .catch(err => {
                            console.log(clc.green(err));
                        });
                }
                else {
                    //console.log("Business as usual");
                }
            })
    }, UPDATE_INTERVAL * 60 * 1000);
}

exports.startScrapingService = (URL, UPDATE_INTERVAL) => {
    return new Promise((resolve, reject) => {
        console.log(clc.green("Servizio di scraping avviato"));
        console.log(clc.green("L'update della lista dei ristoranti disponibili verrà effettuato ogni", UPDATE_INTERVAL, "minuti ..."));
        completeScraping(URL)
            .then(restaurants => {
                scrapingCallback(restaurants, URL, UPDATE_INTERVAL);
                return resolve();
            })
            .catch(err => {
                console.log(clc.green(err));
                return reject(err);
            });
    });
}

const saveRestaurantsToJSONFile = (restaurants) => {
    var json = JSON.stringify(restaurants);
    fs.writeFileSync("output/restaurants.json", json, "utf8", () => {
        console.log(clc.green("Restaurants data successfully stored in a JSON file!"));
    });
}