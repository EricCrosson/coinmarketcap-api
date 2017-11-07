#!/usr/bin/env node
// Written by Eric Crosson
// 2017-11-07

const _ = require('lodash');
const scraper = require('table-scraper');

const urlMarkets = `https://coinmarketcap.com/currencies/%s/#markets`;
const urlMarketCap = `https://coinmarketcap.com/`;

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

function getMatchingMarketCaps(tableData) {

    var parsedData = {};
    var counter = 0;

    _.each(tableData, function(coinData, key) {
        if (coinData['Name'].toLowerCase().indexOf(coin.toLowerCase()) < 0) {
            return;
        }
        var scrapedData = {};
        scrapedData['Symbol'] = coinData['Name'].replace(/\s.*/, '');
        scrapedData['Currency'] = coinData['Name'].replace(/\S+\s*/, '');
        scrapedData['Market cap'] = coinData['Market Cap'];
        parsedData[counter++] = scrapedData;
    });

    return parsedData;
}

function getMarkets(coin) {
    scraper
        .get(util.format(urlMarkets, coin))
        .then(function(tableData) {
            const coinmarketcapData = tableData[0];
            return getTopExchangesByVolume(coinmarketcapData);
        });
}

function getMarketCap(coin) {
    scraper
        .get(urlMarketCap)
        .then(function(tableData) {
            const coinmarketcapTable = tableData[0];
            return getMatchingMarketCaps(coinmarketcapTable);
        });
}
