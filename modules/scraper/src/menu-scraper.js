const CONFIG = require("../../../config.json");

exports.scrapeMenu = function scrapeMenu(restaurant) {
    return new Promise((resolve, reject) => {
        const request = require("request-promise-native");
        const cheerio = require("cheerio");

        const href = restaurant["HREF"];
        var restaurants = {};

        request(
            {
                uri: "https://www.justeat.it" + href,
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
                restaurant["MENU"] = {};
                $("section", "#menu-container--card").each(function () {
                    var category = $(this);
                    var categoryName = category.prop("data-test-id");
                    var categoryDescription = category.children("div").children("div.menuCard-category-description").text();
                    if (filterDrinksAndMenus(categoryName)) {

                        restaurant["MENU"][normalizeString(categoryName)] = {
                            "NAME": categoryName,
                            "DESCRIPTION": categoryDescription,
                            "PRODUCTS": {}
                        };
                        $("div > div").each(function () {
                            var product = $(this);
                            if (product.parent().parent().prop("data-test-id") == categoryName) {
                                var productName = product.children("h4").text().trim();
                                var productDescription = product.children("div.product-description").text().trim();
                                var productPrice = product.children("div.product-price.u-noWrap").text().trim();

                                var obj = {
                                    "NAME": productName,
                                    "DESCRIPTION": productDescription
                                };

                                var synonymsClass = product.prop("class");
                                if (synonymsClass && synonymsClass.includes("has-synonyms")) {
                                    obj["SYNONYMS"] = [];
                                    $("div.product-synonym-name").each(function () {
                                        var synonym = $(this);
                                        if (synonym.parent().parent().children("h4").text().trim() == productName) {
                                            var synonymName = synonym.text().trim();
                                            var synonymPrice = synonym.parent().first().children("div.product-price.u-noWrap").text().trim();

                                            obj["SYNONYMS"].push({ "NAME": synonymName, "PRICE": synonymPrice });
                                        }
                                    })
                                }
                                else if (productPrice != "") {
                                    obj["PRICE"] = productPrice;
                                }
                                restaurant["MENU"][normalizeString(categoryName)]["PRODUCTS"][normalizeString(productName)] = obj;
                            }
                        })
                    }
                })
                return resolve(restaurant);
            })
            .catch(err => {
                return reject(err);
            });
    })

}

const normalizeString = (str) => {
    str = str.replace(/\s/g, '');
    str = str.toLowerCase();
    return str;
}

const filterDrinksAndMenus = (categoryName) => {
    categoryName = normalizeString(categoryName);
    const containsAny = (str, substrings) => {
        for (var i = 0; i != substrings.length; i++) {
            var substring = substrings[i];
            if (str.indexOf(substring) != - 1) {
                return true;
            }
        }
        return false;
    }
    if (!containsAny(categoryName, CONFIG.DRINKS_AND_MENUS_FILTER)) return true
    else return false;
}