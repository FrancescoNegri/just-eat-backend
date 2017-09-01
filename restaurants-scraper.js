//MENU RISTORANTE
// var request = require("request");
// var cheerio = require("cheerio");

// request({
//     uri: "https://www.justeat.it/restaurants-alibabakebab3/menu",
//     headers: {
//         //Fondamentale per ricevere statusCode 200 da justeat
//         "User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36"
//      } 
// }, function (error, response, body) {
//     console.log(response.statusCode);
//     var $ = cheerio.load(body);

//     $("#container-menu--card > section:nth-child(2) > div > div:nth-child(1) > h4").each(function () {
//         var link = $(this);
//         var text = link.text();
//         var href = link.attr("href");

//         console.log(text.trim());
//     });
// });




exports.scrapeRestaurants = function scrapeRestaurants() {
    return new Promise((resolve, reject) => {
        var request = require("request-promise-native");
        var cheerio = require("cheerio");

        var restaurants = {};
        request(
            {
                uri: "https://www.justeat.it/area/42121-reggio-emilia/",
                qs: {
                    lat: "44.7004035",
                    long: "10.6301433"
                },
                headers: {
                    //Fondamentale per ricevere statusCode 200 da justeat, altrimenti 500
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36"
                },
                transform: (body) => {
                    return cheerio.load(body);
                }
            }
        )
            .then($ => {
                $("#searchResults > div > div:nth-child(1) section").each(function () {

                    var listingItem = $(this);

                    //Link al menù del ristorante selezionato
                    var href = listingItem.children("a").prop("href");
                    //Logo ristorante
                    var logo = listingItem.children("a").children("div.mediaElement-img.listing-item-img.mediaElement-img--outlined").children("noscript").text();
                    logo = logo.substring(logo.indexOf('src="') + 5, logo.indexOf('"', logo.indexOf('src="') + 5));
                    //Nome del ristorante
                    var name = listingItem.children("a").children("div.mediaElement-content").children("div").children("div.g-col.g-span7.g-span8--wide.g-col--divide").children("header").children("h3").text();
                    //Tipo di cucina
                    var category = listingItem.children("a").children("div.mediaElement-content").children("div").children("div.g-col.g-span7.g-span8--wide.g-col--divide").children("p.infoText.infoText--primary").children("strong").text();
                    //Valutazione utenti JustEat
                    var rating = listingItem.children("a").children("div.mediaElement-content").children("div").children("div.g-col.g-span7.g-span8--wide.g-col--divide").children("div").children("meta:nth-child(3)").prop("content");

                    var key = href.substring(href.indexOf("-") + 1, href.indexOf("/", href.indexOf("-") + 1));

                    var obj = {
                        "NAME": name,
                        "CATEGORY": category,
                        "LOGO": logo,
                        "RATING": rating,
                        "HREF": href
                    }

                    restaurants[key] = obj;
                });

                return resolve(restaurants);
            })
            .catch(err => {
                return reject(err);
            });
    })

}