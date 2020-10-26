const express = require('express')
var request = require('request');
const app = express()
var cors = require('cors')

const port = 3000
app.use(cors())
app.get('/', (req, res) => {
    res.send('CSCI 571 | HW8 | Himanshu Kriplani')
})



app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

app.get('/charts/:ticker/:startDate', (req, res) => {
    // console.log("start date", req.params.startDate);
    var requestOptions = {
        'url': 'https://api.tiingo.com/iex/' + req.params.ticker + '/prices?startDate=' + req.params.startDate + '&columns=close&resampleFreq=4min&token=cee2b7e0a2d004c7fddf4cfe3907a74fd0d27f67',
        'headers': {
            'Content-Type': 'application/json'
        }
    };
    request(requestOptions,
        function (error, response, body) {
            res.send(body);
        })
})

app.get('/volumeCharts/:ticker/:pastTwoYearDate', (req, res) => {

    var requestOptions = {
        'url': 'https://api.tiingo.com/iex/' + req.params.ticker + '/prices?startDate=' + req.params.pastTwoYearDate + '&columns=open,high,low,close,volume&resampleFreq=12hour&token=cee2b7e0a2d004c7fddf4cfe3907a74fd0d27f67',
        'headers': {
            'Content-Type': 'application/json'
        }
    };
    request(requestOptions,
        function (error, response, body) {
            res.send(body);
        })
})

app.get('/api/search/:stock_symbol', (req, res) => {
    stock_symbol = req.params.stock_symbol;
    var requestOptions = {
        'url': 'https://api.tiingo.com/tiingo/utilities/search?query=' + stock_symbol + '&token=cee2b7e0a2d004c7fddf4cfe3907a74fd0d27f67',
        'headers': {
            'Content-Type': 'application/json'
        }
    };
    request(requestOptions,
        function (error, response, body) {
            res.send(body);
        }
    );
});

app.get('/api/iex_data/:stock_symbol', (req, res) => {
    stock_symbol = req.params.stock_symbol;
    var requestOptions = {
        'url': 'https://api.tiingo.com/iex/?tickers=' + stock_symbol + '&token=cee2b7e0a2d004c7fddf4cfe3907a74fd0d27f67',
        'headers': {
            'Content-Type': 'application/json'
        }
    };
    request(requestOptions,
        function (error, response, body) {
            res.send(JSON.parse(body)[0]);
        }
    );
});

app.get('/api/daily_data/:stock_symbol', (req, res) => {
    stock_symbol = req.params.stock_symbol;
    var requestOptions = {
        'url': 'https://api.tiingo.com/tiingo/daily/' + stock_symbol + '?token=cee2b7e0a2d004c7fddf4cfe3907a74fd0d27f67',
        'headers': {
            'Content-Type': 'application/json'
        }
    };
    request(requestOptions,
        function (error, response, body) {
            res.send(body);
        }
    );
});

app.get('/api/news_data/:stock_symbol', (req, res) => {
    stock_symbol = req.params.stock_symbol;
    var requestOptions = {
        'url': 'https://newsapi.org/v2/everything?apiKey=05579334c14b47b6840a53b416132a85&q=' + stock_symbol,
        'headers': {
            'Content-Type': 'application/json'
        }
    };
    request(requestOptions,
        function (error, response, body) {
            // console.log(body);
            var counter = 0;
            final = [];
            articles = JSON.parse(body).articles;
            // console.log(body)
            // console.log(typeof articles)
            for (var i = 0; i < articles.length; i++) {

                if (articles[i].title != null && articles[i].urlToImage != null && articles[i].title != '' && articles[i].urlToImage != '') {
                    final.push(articles[i]);
                    counter += 1;
                }

                if (counter == 20) {
                    break;
                }
            }
            res.send({ "articles": articles });
        }
    );
});