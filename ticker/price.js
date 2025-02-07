async function fetchPriceSek(cryptoSymbol = 'BTC') {
  const storageKey = `latest${cryptoSymbol}Price`;
  const latestPrice = localStorage.getItem(storageKey);
  if (latestPrice) {
    $(`.${cryptoSymbol.toLowerCase()}-price-sek`).html(formatPrice(Number(latestPrice)));
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

      const tzoffset = (new Date()).getTimezoneOffset() * 60000;
      const localISOTime = (new Date(Date.now() - tzoffset)).toISOString().substr(11, 8);
      
      $('.updated-time').html(localISOTime);

      localStorage.setItem(storageKey, newPrice);
  } catch (err) {
      console.error('Error fetching price:', err);
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
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
}
