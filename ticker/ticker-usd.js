const CRYPTO_SYMBOLS_USD = {
    BTC: "BTC",
    ETH: "ETH",
    LINK: "LINK",
    DOT: "DOT",
    MATIC: "MATIC",
    USDC: "USDC",
    ALGO: "ALGO",
    UNI: "UNI",
    SOL: "SOL",
    NEAR: "NEAR",
    ADA: "ADA",
    AVAX: "AVAX",
    LDO: "LDO",
    GRT: "GRT",
    USDT: "USDT",
    DOGE: "DOGE",
    SHIB: "SHIB",
    AAVE: "AAVE",
    FTM: "FTM",
    COMP: "COMP",
    LTC: "LTC",
    BCH: "BCH",
    MKR: "MKR",
    SAND: "SAND",
    WIF: "WIF",
    JUP: "JUP",
    SNX: "SNX",
    WOO: "WOO",
    FET: "FET",
    YFI: "YFI",
    OP: "OP",
    ARB: "ARB",
    POPCAT: "POPCAT",
    SUI: "SUI",
    S: "S",
    TRUMP: "TRUMP",
    MELANIA: "MELANIA",
    POL: "POL"
  };

Object.keys(CRYPTO_SYMBOLS_USD).forEach(symbol => {
    try {
        var latestPrice = null;
        try {
            latestPrice = localStorage.getItem(`latest${symbol}PriceUSD`);
        } catch (e) {
            console.warn('localStorage not available:', e);
        }
        
        const selector = `.${symbol.toLowerCase()}-price-usd`;
        const element = $(selector);
        
        console.log(`Initial load for ${symbol}:`, {
            price: latestPrice,
            elementExists: element.length > 0
        });
        
        if (element.length > 0 && latestPrice) {
            element.html(latestPrice);
        }
    } catch (e) {
        console.error(`Error processing ${symbol}:`, e);
    }
});

var oldPrices = {};

function initializeTicker(symbol) {
    if (!symbol) return;
    
    const selector = `.${symbol.toLowerCase()}-price-usd`;
    const element = $(selector);
    
    console.log(`Initializing ticker for ${symbol}`, {
        elementExists: element.length
    });
    
    if (element.length) {
        $.get(`https://api.gemini.com/v1/pubticker/${symbol.toLowerCase()}usd`)
            .done(function (data) {
                if (data && data.last) {
                    console.log(`API response for ${symbol}:`, data);
                    updateTicker(symbol, data.last);
                    
                    setupWebSocket(symbol);
                }
            })
            .fail(function(error) {
                console.error(`API error for ${symbol}:`, error);
            });
    }
}

function setupWebSocket(symbol) {
    const ws = new WebSocket(`wss://api.gemini.com/v1/marketdata/${symbol.toLowerCase()}usd?bids=false&offers=false&auctions=false&trades=true`);
    ws.onmessage = function (event) {
        try {
            const json = JSON.parse(event.data);
            if (json.events && json.events.length > 0 && json.events[0].type === "trade") {
                updateTicker(symbol, json.events[0].price);
            }
        } catch (e) {
            console.error(`WebSocket error for ${symbol}:`, e);
        }
    };
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

Object.keys(CRYPTO_SYMBOLS_USD).forEach(symbol => {
    initializeTicker(symbol);
});


