var latestBitcoinPriceUsd = localStorage.getItem('latestBitcoinPriceUSD');
$('.btc-price-usd').html(latestBitcoinPriceUsd);

var oldPriceUsd = 0;

if ( $('.btc-price-usd').length ) {

    $.get("https://api.gemini.com/v1/pubticker/btcusd", function (data) {
        updateTickerUsd(data.last);

        var ws = new WebSocket("wss://api.gemini.com/v1/marketdata/btcusd?bids=false&offers=false&auctions=false&trades=true");
        ws.onmessage = function (event) {
            var json = JSON.parse(event.data);
            if(json.events.length == 0 || json.events[0].type != "trade") 
                return           
                            
            updateTickerUsd(json.events[0].price);
        };
    });
}

function updateTickerUsd(price) {
    if (price != oldPriceUsd)
        updateDirection(price);
    oldPriceUsd = price;
    var formattedPrice = formatPrice(Math.round(price));
    $('.btc-price-usd').fadeOut(200);
    $('.btc-price-usd').html(formattedPrice);
    $('.btc-price-usd').fadeIn(200);
    $('.updated-time-usd').html(formatTickerDate(new Date));
    localStorage.setItem('latestBitcoinPriceUSD', formattedPrice);
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
    if (newPrice > oldPriceUsd) {
        $('.btc-usd-up').show();
        $('.btc-usd-down').hide();
    }
    else {
        $('.btc-usd-down').show();
        $('.btc-usd-up').hide();
    }
}


