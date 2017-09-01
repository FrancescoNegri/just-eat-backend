var restaurantsscraper = require("./restaurants-scraper.js");
var menuScraper = require("./menu-scraper.js");

//ATOMIC COUNTER VA SCHIFO, pensare ad altre soluzioni
const completeScraping = () => {
    return new Promise((resolve, reject) => {
        restaurantsscraper.scrapeRestaurants()
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

    var updateInterval = setInterval(() => {
        restaurantsscraper.scrapeRestaurants()
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
    }, 2 * 60 * 1000);
}

completeScraping()
.then(restaurants => {
    scrapingCallback(restaurants);
})
.catch(err => {
    console.log(err);
});