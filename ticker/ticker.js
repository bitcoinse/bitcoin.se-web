const CRYPTO_SYMBOLS_SEK = {
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
    console.log(`Fetching price for ${symbol}...`);
    fetch(`https://app.safello.com/api/prices?interval=DAILY&crypto=${symbol}`)
    .then(function (data) {
        console.log(`Received response for ${symbol}:`, data.status);
        return data.json();
    })
    .then(function (json) {
        console.log(`Parsed JSON for ${symbol}:`, json);
        if (
            json &&
            json[json.length - 1] !== undefined &&
            json[json.length - 1][1] !== undefined
        ) {
            const lastPrice = json[json.length - 1][1];
            console.log(`Updating ${symbol} price to: ${lastPrice}`);
            updateTicker(lastPrice, symbol);
        } else {
            console.warn(`Invalid JSON response for ${symbol}:`, json);
        }
    })
    .catch(function (err) {
        console.error(`Error fetching ${symbol} price:`, err);
    });
}

function updateTicker(price, symbol) {
    const oldPrice = window[`old${symbol}Price`];
    console.log(`${symbol} price update - Old: ${oldPrice}, New: ${price}`);
    
    if (price != oldPrice)
        updateDirection(price, oldPrice, symbol);
    
    window[`old${symbol}Price`] = price;
    const formattedPrice = formatPrice(price);
    
    $(`.${symbol.toLowerCase()}-price`).html(formattedPrice);
    $(`.${symbol.toLowerCase()}-price-sek`).html(formattedPrice);
    
    const currentTime = formatTickerDate(new Date());
    console.log(`Updating time for ${symbol} to: ${currentTime}`);
    $(`.updated-time-sek-${symbol.toLowerCase()}`).html(currentTime);

    if (symbol === 'BTC' && $('.om-bitcoinkurs').length) {
        console.log('Found .om-bitcoinkurs element, updating Bitcoin values');
        const btcPrice = window[`oldBTCPrice`];
        console.log(`Current BTC price: ${btcPrice}`);
        
        $('.om-bitcoinkurs strong:first').text(formattedPrice);
        const satoshisPerKrona = Math.round(100000000 / btcPrice);
        console.log(`Calculated satoshis per krona: ${satoshisPerKrona}`);
        $('.om-bitcoinkurs strong:last').text(satoshisPerKrona);
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

    const n = x.toString().split('.');
    return n[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ") + (n.length > 1 ? "." + n[1] : "");
}

function formatTickerDate(date) {
    // Fix timezone handling
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
}

Object.values(CRYPTO_SYMBOLS_SEK).forEach(symbol => {
    initCryptoTicker(symbol);
});



