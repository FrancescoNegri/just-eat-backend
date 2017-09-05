module.exports = function (app) {
    app.get("/restaurants/", function (req, res) {
        //VENGONO RESTITUITI I RISTORANTI PRIVATI DEL MENU
        var restaurants = require("./../../output/restaurants.json");
        Object.keys(restaurants).forEach((restaurant) => {
            delete restaurants[restaurant]["MENU"];
        })
        res.json(restaurants);
    });
}