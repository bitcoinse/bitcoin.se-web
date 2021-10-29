Chart.defaults.global.defaultFontColor = 'rgba(73, 53, 128, 1)';
Chart.defaults.global.defaultFontFamily = "futura-pt";
Chart.defaults.global.defaultFontSize = 12;

$.get("https://app.safello.com/api/prices?interval=YEARLY&crypto=BTC", function (data) {
    var labels = [];
    var prices = [];
    for (var i = 0; i < data.length; i=i+10) {
        if (data[i] || data[data.length - 1]) {
            var formattedDate = formatDate(data[i][0]);
            labels.push(formattedDate);
            var price = data[i][1];
            prices.push(price);
        }
    }
    var j = data.length - 1;
    var formattedDate = formatDate(data[j][0]);
    labels.push(formattedDate);
    var price = data[j][1];
    prices.push(price);
    createChart("chart1year", labels, prices);
});

$.get("https://app.safello.com/api/prices?interval=QUARTERLY&crypto=BTC", function (data) {
    var labels = [];
    var prices = [];
    for (var i = 0; i < data.length; i=i+60) {
        if (data[i] || data[data.length - 1]) {
            var formattedDate = formatDate(data[i][0]);
            labels.push(formattedDate);
            var price = data[i][1];
            prices.push(price);
        }
    }
    var j = data.length - 1;
    var formattedDate = formatDate(data[j][0]);
    labels.push(formattedDate);
    var price = data[j][1];
    prices.push(price);

    createChart("chart3months", labels, prices);
});

$.get("https://app.safello.com/api/prices?interval=MONTHLY&crypto=BTC", function (data) {
    var labels = [];
    var prices = [];
    for (var i = 0; i < data.length; i=i+20) {
        if (data[i] || data[data.length - 1]) {
            var formattedDate = formatDate(data[i][0]);
            labels.push(formattedDate);
            var price = data[i][1];
            prices.push(price);
        }
    }
    var j = data.length - 1;
    var formattedDate = formatDate(data[j][0]);
    labels.push(formattedDate);
    var price = data[j][1];
    prices.push(price);

    createChart("chart30days", labels, prices);
});

$.get("https://app.safello.com/api/prices?interval=DAILY&crypto=BTC", function (data) {
    var labels = [];
    var prices = [];
    for (var i = 0; i < data.length; i=i+6) {
        if (data[i]) {
            var formattedTime = formatTime(data[i][0]);
            labels.push(formattedTime);
            var price = data[i][1];
            prices.push(price);
        }
    }
    var j = data.length - 1;
    var formattedTime = formatTime(data[j][0]);
    labels.push(formattedTime);
    var price = data[j][1];
    prices.push(price);

    createChart("chart24hours", labels, prices);
});
