const fs = require("fs");
const clc = require("cli-color");

module.exports = function (app, port) {
    fs.readdirSync(__dirname).forEach(function (file) {
        if (file == "index.js" || file.substr(file.lastIndexOf('.') + 1) !== "js") return;
        var name = file.substr(0, file.indexOf("."));
        require('./' + name)(app);
    });

    app.use(function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        //console.log(clc.cyan('Request:', req.method, '-', req.url));
        next();
    });

    app.all("*", function (req, res) {
        res.send("Error 404: PAGE NOT FOUND");
    });

    app.listen(port);
    console.log(clc.cyan("Server listening on port:", port.toString()));
}