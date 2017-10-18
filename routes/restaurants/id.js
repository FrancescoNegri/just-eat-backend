module.exports = function (app) {
    app.get("/restaurants/:id", function (req, res) {
        var restaurants = JSON.parse(require('fs').readFileSync("./output/restaurants.json", 'utf8'));
        if (restaurants.hasOwnProperty(req.params["id"])) {
            res.json(restaurants[req.params["id"]]);
        }
        else {
            res.status(404);
            res.json({MESSAGE: "Id not found"});
        }
    });
}