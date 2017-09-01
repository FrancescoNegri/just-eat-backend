var restaurantsscraper = require("./restaurants-scraper.js");
var menuScraper = require("./menu-scraper.js");

//ATOMIC COUNTER VA SCHIFO, pensare ad altre soluzioni
const firstScraping = () => {
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


firstScraping()
    .then(restaurants => {
        console.log(Object.keys(restaurants).length.toString(), "ristoranti disponibili");
    })
    .catch(err => {
        console.log(err);
    });

