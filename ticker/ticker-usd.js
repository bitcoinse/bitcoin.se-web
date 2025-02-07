import { CRYPTO_SYMBOLS } from './constants.js';

Object.keys(CRYPTO_SYMBOLS).forEach(symbol => {
    var latestPrice = localStorage.getItem(`latest${symbol}PriceUSD`);
    console.log(`Initial load for ${symbol}:`, {
        price: latestPrice,
        elementExists: $(`.${symbol.toLowerCase()}-price-usd`).length > 0
    });
    $(`.${symbol.toLowerCase()}-price-usd`).html(latestPrice);
});

var oldPrices = {};

function initializeTicker(symbol) {
    console.log(`Initializing ticker for ${symbol}`, {
        elementExists: $(`.${symbol.toLowerCase()}-price-usd`).length
    });
    
    if ($(`.${symbol.toLowerCase()}-price-usd`).length) {
        $.get(`https://api.gemini.com/v1/pubticker/${symbol.toLowerCase()}usd`, function (data) {
            console.log(`API response for ${symbol}:`, data);
            updateTicker(symbol, data.last);

            var ws = new WebSocket(`wss://api.gemini.com/v1/marketdata/${symbol.toLowerCase()}usd?bids=false&offers=false&auctions=false&trades=true`);
            ws.onmessage = function (event) {
                var json = JSON.parse(event.data);
                if(json.events.length == 0 || json.events[0].type != "trade") 
                    return;
                                
                updateTicker(symbol, json.events[0].price);
            };
        }).fail(function(error) {
            console.error(`API error for ${symbol}:`, error);
        });
    }
}

function updateTicker(symbol, price) {
    console.log(`Updating ticker for ${symbol}:`, {
        newPrice: price,
        oldPrice: oldPrices[symbol],
        elementSelector: `.${symbol.toLowerCase()}-price-usd`,
        elementExists: $(`.${symbol.toLowerCase()}-price-usd`).length
    });
    if (price != oldPrices[symbol]) {
        updateDirection(symbol, price);
        oldPrices[symbol] = price;
        var oldFormattedPrice = localStorage.getItem(`latest${symbol}PriceUSD`);        
        var formattedPrice = formatPrice(parseFloat(price));
        
        if (oldFormattedPrice != formattedPrice) {
            $(`.${symbol.toLowerCase()}-price-usd`).fadeOut(200);
            $(`.${symbol.toLowerCase()}-price-usd`).html(formattedPrice);
            $(`.${symbol.toLowerCase()}-price-usd`).fadeIn(200);
        }
        
        $(`.updated-time-usd-${symbol.toLowerCase()}`).html(formatTickerDate(new Date));
        localStorage.setItem(`latest${symbol}PriceUSD`, formattedPrice);
    }
}

function formatPrice(x) {
    if (isNaN(x)) return "";

    let n = x.toString().split('.');
    let integerPart = n[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");

    if (x < 0.01) {
        return x.toFixed(6);
    } else if (x < 1) {
        return x.toFixed(4);
    } else if (x < 100) {
        return x.toFixed(2);
    } else {
        return integerPart;
    }
}

function formatTickerDate(date) {
    var tzoffset = (new Date()).getTimezoneOffset() * 60000;
    var localISOTime = (new Date(Date.now() - tzoffset)).toISOString()
    return localISOTime.substr(11, 8);
}

function updateDirection(symbol, newPrice) {
    if (newPrice > oldPrices[symbol]) {
        $(`.${symbol.toLowerCase()}-up`).show();
        $(`.${symbol.toLowerCase()}-down`).hide();
    } else {
        $(`.${symbol.toLowerCase()}-down`).show();
        $(`.${symbol.toLowerCase()}-up`).hide();
    }
}

Object.keys(CRYPTO_SYMBOLS).forEach(symbol => {
    initializeTicker(symbol);
});


