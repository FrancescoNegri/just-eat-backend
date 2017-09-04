module.exports = function (app) {
    app.get("/test1/", function (req, res) {
        res.send("test1");
    });
}