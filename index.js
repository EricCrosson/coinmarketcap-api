#!/usr/bin/env node
// Written by Eric Crosson
// 2017-11-07

'use strict';

const _ = require('lodash');
const scraper = require('table-scraper');
const util = require('util');
const cryptocurrencies = require('cryptocurrencies');

const urlMarkets = `https://coinmarketcap.com/currencies/%s/#markets`;
const urlMarketCap = `https://coinmarketcap.com/all/views/all`;

function getTopExchangesByVolume(tableData) {

    var parsedData = [];
    var counter = 0;

    _.each(tableData, function(data, key) {
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

    var parsedData = [];
    var counter = 0;

    _.each(tableData, function(coinData, index) {
        var currency = coin;
        if (isCryptoSymbol(coin)) {
            currency = cryptocurrencies[coin.toUpperCase()];
        }
        // reject non-matches
        if (!(coinData['Name'].toLowerCase().startsWith(coin.toLowerCase()+' ')
              || coinData['Name'].substr(coinData['Name'].indexOf(' ')+1).toLowerCase().trim() === currency.replace(/\s+\/.*$/,'').toLowerCase())) {
            return;
        }
        let scrapedData = {};
        scrapedData['Symbol'] = coinData['Name'].replace(/\s.*/, '');
        scrapedData['Currency'] = coinData['Name'].replace(/^\S+\s*/, '');
        scrapedData['Market cap'] = coinData['Market Cap'];
        scrapedData['Market cap rank'] = index+1;  // 0-indexed
        parsedData[counter++] = scrapedData;
    });

    return parsedData;
}

function getAllMarketCaps(tableData) {

    var parsedData = [];

    _.each(tableData, function(coinData, index) {
        let scrapedData = {};
        scrapedData['Symbol'] = coinData['Name'].replace(/\s.*/, '');
        scrapedData['Currency'] = coinData['Name'].replace(/^\S+\s*/, '');
        scrapedData['Market cap'] = coinData['Market Cap'];
        scrapedData['Market cap rank'] = index+1;  // 0-indexed
        parsedData[index] = scrapedData;
    });

    return parsedData;
}


function isCryptoSymbol(symbol) {
    return cryptocurrencies.symbols().indexOf(symbol.toUpperCase()) > 0
}

function getMarkets(coin) {

    return new Promise(function (resolve, reject) {

        var currency = coin;
        coin = coin.toUpperCase();
        if (isCryptoSymbol(coin)) {
            currency = cryptocurrencies[coin];
        }
        // Special cases not handled well by available APIs
        switch (coin) {
        case "BCH":
            currency = 'Bitcoin Cash';
            break;
        }

        const urlCoinMarket = util.format(urlMarkets, currency.replace(/\s+/, '-'));

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

// Return array of market capitalizations, in order of size.
function getMarketCaps() {

    return new Promise(function (resolve, reject) {

        scraper
            .get(urlMarketCap)
            .then(function(tableData) {
                const coinmarketcapTable = tableData[0];
                resolve(getAllMarketCaps(coinmarketcapTable));
            });
    });
}

module.exports.getMarkets = getMarkets;
module.exports.getMarketCap = getMarketCap;
module.exports.getMarketCaps = getMarketCaps;
