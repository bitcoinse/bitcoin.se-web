var latestBitcoinPrice = localStorage.getItem('latestBitcoinPrice');
$('.btc-price').html(formatPrice(parseInt(latestBitcoinPrice)));

var oldPrice = latestBitcoinPrice;

fetchBitcoinPriceSek();
setInterval(fetchBitcoinPriceSek, 600000);

function fetchBitcoinPriceSek() {
    fetch("https://app.safello.com/api/prices?interval=DAILY&crypto=BTC")
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
            updateTicker(lastPrice);
        } else {
            console.log("couldn't read the json from /api/prices");
        }
    })
    .catch(function (err) {
        console.error(err);
    });
}

function updateTicker(price) {
    if (price != oldPrice)
        updateDirection(price);
    oldPrice = price;
    var formattedPrice = formatPrice(parseInt(price));
    $('.btc-price').html(formattedPrice);
    $('.updated-time').html(formatTickerDate(new Date));

    if ( $('.om-bitcoinkurs').length ) {
        $('.btc-price-sek').html(formattedPrice);
        $('.om-bitcoinkurs strong:first').html(formattedPrice);
        var satoshisPerKrona = (1/(price / 100000000)).toFixed(0);
        $('.om-bitcoinkurs strong:last').html(satoshisPerKrona);
    }

    localStorage.setItem('latestBitcoinPrice', price);
}

function formatPrice(x) {
    if (isNaN(x)) return "";

    n = x.toString().split('.');
    return n[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ") + (n.length > 1 ? "." + n[1] : "");
}

function formatTickerDate(date) {
    return date.toISOString().substr(11, 8);
}

function updateDirection(newPrice) {
    if (newPrice > oldPrice) {
        $('.btc-up').show();
        $('.btc-down').hide();
    }
    else {
        $('.btc-down').show();
        $('.btc-up').hide();
    }
}


