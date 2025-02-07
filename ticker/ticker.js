const CRYPTO_SYMBOLS = {
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

function initCryptoTicker(symbol) {
    const storageKey = `latest${symbol}Price`;
    const latestPrice = localStorage.getItem(storageKey);
    $(`.${symbol.toLowerCase()}-price`).html(formatPrice(parseInt(latestPrice)));
    $(`.${symbol.toLowerCase()}-price-sek`).html(formatPrice(parseInt(latestPrice)));
    
    window[`old${symbol}Price`] = latestPrice;
    
    fetchCryptoPrice(symbol);
    setInterval(() => fetchCryptoPrice(symbol), 600000);
}

function fetchCryptoPrice(symbol) {
    fetch(`https://app.safello.com/api/prices?interval=DAILY&crypto=${symbol}`)
    .then(function (data) {
        return data.json();
    })
    .then(function (json) {
        if (
            json &&
            json[json.length - 1] !== undefined &&
            json[json.length - 1][1] !== undefined
        ) {
            const lastPrice = json[json.length - 1][1];
            updateTicker(lastPrice, symbol);
        } else {
            console.log(`couldn't read the json from /api/prices for ${symbol}, json: ${JSON.stringify(json)}`);
        }
    })
    .catch(function (err) {
        console.error(err);
    });
}

function updateTicker(price, symbol) {
    const oldPrice = window[`old${symbol}Price`];
    if (price != oldPrice)
        updateDirection(price, oldPrice, symbol);
    
    window[`old${symbol}Price`] = price;
    const formattedPrice = formatPrice(price);
    
    $(`.${symbol.toLowerCase()}-price`).html(formattedPrice);
    $(`.${symbol.toLowerCase()}-price-sek`).html(formattedPrice);
    $('.updated-time').html(formatTickerDate(new Date));

    if ( $('.om-bitcoinkurs').length ) {
        $('.btc-price-sek').html(formattedPrice);
        $('.om-bitcoinkurs strong:first').html(formattedPrice);
        var satoshisPerKrona = (1/(price / 100000000)).toFixed(0);
        $('.om-bitcoinkurs strong:last').html(satoshisPerKrona);
    }

    localStorage.setItem(`latest${symbol}Price`, price);
}

function updateDirection(newPrice, oldPrice, symbol) {
    if (newPrice > oldPrice) {
        $(`.${symbol.toLowerCase()}-up`).show();
        $(`.${symbol.toLowerCase()}-down`).hide();
    }
    else {
        $(`.${symbol.toLowerCase()}-down`).show();
        $(`.${symbol.toLowerCase()}-up`).hide();
    }
}

function formatPrice(x) {
    if (isNaN(x)) return "";

    if (x >= 1000) {
        x = Math.round(x);
    }

    n = x.toString().split('.');
    return n[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ") + (n.length > 1 ? "." + n[1] : "");
}

function formatTickerDate(date) {
    var tzoffset = (new Date()).getTimezoneOffset() * 60000;
    var localISOTime = (new Date(Date.now() - tzoffset)).toISOString()
    return localISOTime.substr(11, 8);
}

Object.values(CRYPTO_SYMBOLS).forEach(symbol => {
    initCryptoTicker(symbol);
});



