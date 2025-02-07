async function fetchPriceUsd(cryptoSymbol = 'BTC') {  
    const storageKey = `latest${cryptoSymbol}PriceUSD`;
    const latestPrice = localStorage.getItem(storageKey);
    if (latestPrice) {
        $(`.${cryptoSymbol.toLowerCase()}-price-usd`).html(formatPrice(Number(latestPrice)));
    }

    try {
        const response = await fetch(`https://api.gemini.com/v1/pubticker/${cryptoSymbol.toLowerCase()}usd`);
        const data = await response.json();
        updateTickerUsd(Number(data.last), cryptoSymbol);

        const ws = new WebSocket(`wss://api.gemini.com/v1/marketdata/${cryptoSymbol.toLowerCase()}usd?bids=false&offers=false&auctions=false&trades=true`);
        ws.onmessage = function(event) {
            const json = JSON.parse(event.data);
            if (json.events.length == 0 || json.events[0].type != "trade") 
                return;
            
            updateTickerUsd(Number(json.events[0].price), cryptoSymbol);
        };
    } catch (err) {
        console.error(`Error fetching USD price for ${cryptoSymbol}:`, err);
    }
}

function updateTickerUsd(newPrice, cryptoSymbol) {
    const storageKey = `latest${cryptoSymbol}PriceUSD`;
    const oldPrice = parseFloat(localStorage.getItem(storageKey));

    if (newPrice !== oldPrice) {
        if (newPrice > oldPrice) {
            $(`.${cryptoSymbol.toLowerCase()}-usd-up`).show();
            $(`.${cryptoSymbol.toLowerCase()}-usd-down`).hide();
        } else {
            $(`.${cryptoSymbol.toLowerCase()}-usd-down`).show();
            $(`.${cryptoSymbol.toLowerCase()}-usd-up`).hide();
        }

        const formattedPrice = formatPrice(newPrice);
        $(`.${cryptoSymbol.toLowerCase()}-price-usd`).fadeOut(200);
        $(`.${cryptoSymbol.toLowerCase()}-price-usd`).html(formattedPrice);
        $(`.${cryptoSymbol.toLowerCase()}-price-usd`).fadeIn(200);
        
        $(`.updated-time-usd`).html(formatTickerDate(new Date()));
        localStorage.setItem(storageKey, newPrice);
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