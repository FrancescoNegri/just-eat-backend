module.exports = function (app) {
    app.get("/test2/", function (req, res) {
        res.send("test2");
    });
}