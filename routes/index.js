const fs = require("fs");
const clc = require("cli-color");
const path = require("path");
const app = require("express")();

module.exports = function (port) {
    function recursiveRoutes(folderName) {
        var t = fs.readdirSync(folderName);
        t.forEach(function (file) {

            var fullName = path.join(folderName, file);
            var stat = fs.lstatSync(fullName);

            if (stat.isDirectory()) {
                recursiveRoutes(fullName);
            } else if (file.toLowerCase().includes(".js")) {
                if (file == "index.js" && folderName !== "routes") {
                    fullName = fullName.replace(/\\/g, "/");
                    fullName = fullName.substring(fullName.indexOf("/") + 1, fullName.indexOf("index.js"));
                    require('./' + fullName)(app);
                }
                else if (file !== "index.js") {
                    fullName = fullName.replace(/\\/, "/");
                    fullName = fullName.substring(fullName.indexOf("/") + 1, fullName.indexOf("."));
                    require('./' + fullName)(app);
                }
            }
        });
    }
    recursiveRoutes("routes");

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