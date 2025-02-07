async function fetchPriceSek(cryptoSymbol = 'BTC') {

  const storageKey = `latest${cryptoSymbol}Price`;
  const latestPrice = localStorage.getItem(storageKey);
  if (latestPrice) {
    $(`.${cryptoSymbol.toLowerCase()}-price`).html(formatPrice(parseInt(latestPrice)));
    $(`.${cryptoSymbol.toLowerCase()}-price-sek`).html(formatPrice(parseInt(latestPrice)));
  }

  try {
      const response = await fetch(`https://app.safello.com/api/prices?interval=DAILY&crypto=${cryptoSymbol}`);
      const json = await response.json();
      
      if (!json || !json[json.length - 1]?.[1]) {
          console.log(`couldn't read the json from /api/prices for ${cryptoSymbol}`);
          return;
      }

      const newPrice = json[json.length - 1][1];
      const storageKey = `latest${cryptoSymbol}Price`;
      const oldPrice = localStorage.getItem(storageKey);
      
      if (newPrice != oldPrice) {
          if (newPrice > oldPrice) {
              $(`.${cryptoSymbol.toLowerCase()}-up`).show();
              $(`.${cryptoSymbol.toLowerCase()}-down`).hide();
          } else {
              $(`.${cryptoSymbol.toLowerCase()}-down`).show();
              $(`.${cryptoSymbol.toLowerCase()}-up`).hide();
          }
      }

      const formattedPrice = newPrice.toString().split('.')[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
      const tzoffset = (new Date()).getTimezoneOffset() * 60000;
      const localISOTime = (new Date(Date.now() - tzoffset)).toISOString().substr(11, 8);
      
      $('.updated-time').html(localISOTime);

      if (cryptoSymbol === 'BTC') {
          $(`.om-bitcoinkurs strong:first`).html(formattedPrice);
          const satoshisPerKrona = (1/(newPrice / 100000000)).toFixed(0);
          $(`.om-bitcoinkurs strong:last`).html(satoshisPerKrona);
      }

      localStorage.setItem(storageKey, newPrice);
  } catch (err) {
      console.error(err);
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
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
}