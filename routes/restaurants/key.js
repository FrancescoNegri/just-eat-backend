module.exports = function (app) {
    app.get("/restaurants/:key", function (req, res) {
        var restaurants = JSON.parse(require('fs').readFileSync("./output/restaurants.json", 'utf8'));
        if (restaurants.hasOwnProperty(req.params["key"])) {
            res.json(restaurants[req.params["key"]]);
        }
        else {
            res.status(404);
            res.json({MESSAGE: "Key not found"});
        }
    });
}