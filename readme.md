# coinmarketcap-api

> An API for querying coinmarketcap.com

## Install

```
$ npm install coinmarketcap-cli-api
```

## API

### getMarkets(currency)

Returns a list maps containing market information by exchange

```
[
{ Exchange: 'Bitfinex',
  Pair: 'BTC/USD',
  'Volume (%)': '11.10%',
  'Volume (24h)': '$252,068,000',
  Price: '$7078.40' },
{ Exchange: 'bitFlyer',
  Pair: 'BTC/JPY',
  'Volume (%)': '5.99%',
  'Volume (24h)': '$136,021,000',
  Price: '$7175.06' },
  ...
]
```

### getMarketCap(currency)

Returns a map

```
{
    Symbol: BTC,
    Currency: Bitcoin,
    Market cap: $100,000,000,000
}
```

## Related

- [coinmarketcap-cli](https://github.com/ericcrosson/coinmarketcap-cli/)
- [discord-coinmarketcap-bot](https://github.com/ericcrosson/discord-coinmarketcap-bot/)

## License

Apache 2.0 © Eric Crosson
