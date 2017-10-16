const config = require("../../config.json");

module.exports = function (app) {
    app.get("/restaurants/", function (req, res) {
        //VENGONO RESTITUITI I RISTORANTI SENZA IL MENU
        var restaurants = JSON.parse(require('fs').readFileSync("./output/restaurants.json", 'utf8'));
        Object.keys(restaurants).forEach((restaurant) => {
            delete restaurants[restaurant]["MENU"];
        })
        var obj = {
            URL: config.URL,
            COUNTER: Object.keys(restaurants).length,
            RESTAURANTS: restaurants
        }
        res.json(obj);
    });
}