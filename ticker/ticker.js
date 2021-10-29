var latestBitcoinPrice = localStorage.getItem('latestBitcoinPrice');
$('.btc-price').html(formatPrice(parseInt(latestBitcoinPrice)));

var oldPrice = latestBitcoinPrice;

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

function updateTicker(price) {
    if (price != oldPrice)
        updateDirection(price);
    oldPrice = price;
    var formattedPrice = formatPrice(parseInt(price));
    $('.btc-price').html(formattedPrice);
    $('.updated-time').html(formatTickerDate(new Date));

    localStorage.setItem('latestBitcoinPrice', price);
}

function formatPrice(x) {
    if (isNaN(x)) return "";

    n = x.toString().split('.');
    return n[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ") + (n.length > 1 ? "." + n[1] : "");
}

function formatTickerDate(date) {
    var date = date.getHours() + ":" + date.getMinutes();
    return date;
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


