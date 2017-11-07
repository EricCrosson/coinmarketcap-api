#!/usr/bin/env node
// Written by Eric Crosson
// 2017-11-07

const _ = require('lodash');
const scraper = require('table-scraper');
const util = require('util');
const cryptocurrencies = require('cryptocurrencies');

const urlMarkets = `https://coinmarketcap.com/currencies/%s/#markets`;
const urlMarketCap = `https://coinmarketcap.com/all/views/all`;

function getTopExchangesByVolume(tableData) {

    var parsedData = {};
    var counter = 0;

    _.each(tableData, function(data, key) {
        volume = parseFloat(data['Volume (%)'].split("%")[0]);
        if (volume < 1) {
            return;
        }
        var scrapedData = {};
        scrapedData['Exchange'] = data['Source'];
        scrapedData['Pair'] = data['Pair'];
        scrapedData['Volume (%)'] = data['Volume (%)'];
        scrapedData['Volume (24h)'] = data['Volume (24h)'];
        scrapedData['Price'] = data['Price'];
        parsedData[counter++] = scrapedData;
    });

    return parsedData;
}

function getMatchingMarketCaps(coin, tableData) {

    var parsedData = {};
    var counter = 0;

    _.each(tableData, function(coinData, key) {
        if (coinData['Name'].toLowerCase().indexOf(coin.toLowerCase()) < 0) {
            return;
        }
        var scrapedData = {};
        scrapedData['Symbol'] = coinData['Name'].replace(/\s.*/, '');
        scrapedData['Currency'] = coinData['Name'].replace(/^\S+\s*/, '');
        scrapedData['Market cap'] = coinData['Market Cap'];
        parsedData[counter++] = scrapedData;
    });

    return parsedData;
}

function getMarkets(coin) {

    return new Promise(function (resolve, reject) {

        console.log('Coin is currently')
        console.log(coin)
        var currency = coin;
        console.log(currency)
        coin = coin.toUpperCase();
        if (cryptocurrencies.symbols().indexOf(coin) > 0) {
            currency = cryptocurrencies[coin];
        }
        // Special cases not handled well by available APIs
        switch (coin) {
        case "BCH":
            currency = 'Bitcoin Cash';
            break;
        }

        console.log(`Currency is ${currency}`)

        const urlCoinMarket = util.format(urlMarkets, currency.replace(/\s+/, '-'));
        console.log(`Using url ${urlCoinMarket}`);

        scraper
            .get(urlCoinMarket)
            .then(function(tableData) {
                const coinmarketData = tableData[0];
                resolve(getTopExchangesByVolume(coinmarketData));
            });
    });
}

function getMarketCap(coin) {

    return new Promise(function (resolve, reject) {

        scraper
            .get(urlMarketCap)
            .then(function(tableData) {
                const coinmarketcapTable = tableData[0];
                resolve(getMatchingMarketCaps(coin, coinmarketcapTable));
            });
    });
}

module.exports.getMarkets = getMarkets;
module.exports.getMarketCap = getMarketCap;
