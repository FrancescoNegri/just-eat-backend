module.exports = function (app) {
    app.get("/restaurants/", function (req, res) {
        //VENGONO RESTITUITI I RISTORANTI PRIVATI DEL MENU
        var restaurants = JSON.parse(require('fs').readFileSync("./output/restaurants.json", 'utf8'));
        Object.keys(restaurants).forEach((restaurant) => {
            delete restaurants[restaurant]["MENU"];
        })
        res.json(restaurants);
    });
}