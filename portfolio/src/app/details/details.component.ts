import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Subscription, timer } from 'rxjs';
import { switchMap, timeout } from 'rxjs/operators';
import { BackendNodeService } from '../backend-node.service';


import * as Highcharts from "highcharts/highstock";
import IndicatorsCore from "highcharts/indicators/indicators";
IndicatorsCore(Highcharts);
import vbp from 'highcharts/indicators/volume-by-price';
import sma from 'highcharts/indicators/indicators';
import ohlc from 'highcharts/indicators/indicators';

ohlc(Highcharts);
sma(Highcharts);
vbp(Highcharts);

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {
  private sub: any;
  stock_symbol: string;
  iex_data: object;
  daily_data: object;
  quantity = 0;
  price = 0;
  newsData;
  inWatchList = false;
  msgs = [];
  watchlist = []
  total_price_buy = 0;
  tempNews;
  lastSaleDate;
  chart_chng = 'black';
  subscription;
  month = ["null", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  // iexLoaded: Promise<false>;
  closeResult = '';
  notFound = false;
  Highcharts1: typeof Highcharts = Highcharts;
  chartOptions1: Highcharts.Options;
  currentDate;
  formatDate;
  t1; t2; market_open;

  Highcharts2: typeof Highcharts = Highcharts;
  chartOptions2: Highcharts.Options;
  constructor(private route: ActivatedRoute, private _http: BackendNodeService, private modalService: NgbModal) { }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  ngOnInit(): void {

    this.sub = this.route.params.subscribe(params => {
      this.stock_symbol = params['stocksymbol'].toUpperCase();;
    });
    // this.stk_data = this._http.getDetail(this.stock_symbol);
    this.subscription = timer(0, 15000).pipe(switchMap(() => this._http.getIexData(this.stock_symbol))).subscribe(res => {
      // this._http.getIexData(this.stock_symbol).subscribe(res => {

      this.iex_data = res;

      this.chart_chng = (this.iex_data["last"] - this.iex_data["prevClose"]) > 0 ? "green" : "red"
      // this.subscription=timer(0,15000).pipe(switchMap(()=> this._http.))
      this.load_chart1();
      // console.log(Date.now())
      this.marketDate()
      this.FindcurrentDate()
      this.market_open = (this.t2 - this.t1) > 60000 ? false : true


    });
    this._http.getDailyData(this.stock_symbol).subscribe(res => {
      this.daily_data = res;
      if (this.daily_data["detail"] == "Not found.") {
        this.notFound = true;
      }
    });
    this._http.getNews(this.stock_symbol).subscribe(res => {
      this.newsData = res['articles'];
    });
    this.watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
    // console.log("oninit", this.watchlist)
    if (this.watchlist.indexOf(this.stock_symbol) > -1) {
      this.inWatchList = true;

    }
    this.load_chart2()





  }
  marketDate() {

    //Current date and time

    // this.currentDate = date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0" + date.getDate()).slice(-2) + " " + ("0" + date.getHours()).slice(-2) + ":" + ("0" + date.getMinutes()).slice(-2) + ":" + ("0" + date.getSeconds()).slice(-2);
    var date = this.iex_data["timestamp"]
    date = new Date(date)
    var t1 = date.getTime()
    this.formatDate = date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0" + date.getDate()).slice(-2) + " " + ("0" + date.getHours()).slice(-2) + ":" + ("0" + date.getMinutes()).slice(-2) + ":" + ("0" + date.getSeconds()).slice(-2);
    //Date from API "timestamp"
    // var tempInput = this.iex_data["timestamp"].substr(0, 10) + "T" + this.iex_data["timestamp"].substr(11, 8) + "Z";
    // var dateM = new Date(Date.parse(tempInput));
    // let dateU = new Date(dateM);
    // var time = dateU.toTimeString().slice(0, 8);
    // this.t1 = dateU.getTime();
    // this.formatDate = dateU.getFullYear() + "-" + ("0" + (+dateU.getMonth() + 1)).slice(-2) + "-" + ("0" + dateU.getDate()).slice(-2) + " " + time
    // var dateM = this.iex_data["timestamp"].split("T") //market closed on
    // dateM = dateM[0] + " " + dateM[1].split(".")[0] + " UTC"
    // var tempInput = this.iex_data["timestamp"].substr(0, 10) + "T" + this.iex_data["timestamp"].substr(11, 8) + "Z";
    // var dateM = new Date(Date.parse(tempInput));

    // let dateU = new Date(dateM)
    // var time = dateU.toTimeString().slice(0, 8)
    // this.formatDate = dateU.getFullYear() + "-" + (+dateU.getMonth() + 1) + "-" + dateU.getDate() + " " + time
  }
  FindcurrentDate() {
    let date: Date = new Date();
    this.t2 = date.getTime();
    var month = ("0" + date.getMonth()).slice(-2)
    var dateNumber = ("0" + date.getDate().toString()).slice(-2)
    this.currentDate = date.getFullYear() + "-" + month + "-" + dateNumber + " " + date.getHours() + ":" + ("0" + date.getMinutes()).slice(-2) + ":" + ("0" + date.getSeconds()).slice(-2);

  }
  load_chart2() {
    var oneYearFromNow = new Date();
    oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() - 2);

    function convertDate(d) {
      var parts = d.split(" ");
      var months = { Jan: "01", Feb: "02", Mar: "03", Apr: "04", May: "05", Jun: "06", Jul: "07", Aug: "08", Sep: "09", Oct: "10", Nov: "11", Dec: "12" };
      return parts[3] + "-" + months[parts[1]] + "-" + parts[2];
    }
    this._http.getVolumeCharts(this.stock_symbol, convertDate(oneYearFromNow.toString())).subscribe(res5 => {
      const volume_chart = [];
      const OHLC_chart = [];

      res5.forEach(row => {
        var RawDate = row.date.split("T");
        var yearMonthDate = RawDate[0].split("-");
        var hourMinSec = RawDate[1].split(":");
        var UTCDate = Date.UTC(parseInt(yearMonthDate[0]), parseInt(yearMonthDate[1]) - 1, parseInt(yearMonthDate[2]), parseInt(hourMinSec[0]), parseInt(hourMinSec[1]), parseInt(hourMinSec[2].split(".")[0]))
        const volume_row = [
          UTCDate,
          row.volume
        ];
        const OHLC_row = [
          UTCDate,
          row.open,
          row.high,
          row.low,
          row.close
        ];
        volume_chart.push(volume_row);
        OHLC_chart.push(OHLC_row);
      });
      this.chartOptions2 = {
        title: {
          text: this.stock_symbol.toUpperCase() + ' Historical'
        },
        subtitle: {
          text: 'With SMA and Volume by Price technical indicators'
        },
        rangeSelector: {
          inputEnabled: true,
          selected: 2
        },
        tooltip: {
          split: true
        },
        yAxis: [{
          startOnTick: false,
          endOnTick: false,
          labels: {
            align: 'right',
            x: -3
          },
          title: {
            text: 'OHLC'
          },
          height: '60%',
          lineWidth: 2,
          resize: {
            enabled: true
          }
        }, {
          labels: {
            align: 'right',
            x: -3
          },
          title: {
            text: 'Volume'
          },
          top: '65%',
          height: '35%',
          offset: 0,
          lineWidth: 2
        }],
        series: [{
          type: 'candlestick',
          name: this.stock_symbol.toUpperCase(),
          id: 'ohlc',
          zIndex: 2,
          data: OHLC_chart
        }, {
          type: 'column',
          name: 'Volume',
          id: 'volume',
          data: volume_chart,
          yAxis: 1
        }, {
          type: 'vbp',
          linkedTo: 'ohlc',
          params: {
            volumeSeriesID: 'volume'
          },
          dataLabels: {
            enabled: false
          },
          zoneLines: {
            enabled: false
          }
        }, {
          type: 'sma',
          linkedTo: 'ohlc',
          zIndex: 1,
          marker: {
            enabled: false
          }
        }]
      };
    });
  }
  async load_chart1() {
    this.lastSaleDate = this.iex_data["lastSaleTimestamp"].split("T")[0];

    this._http.getCharts(this.stock_symbol, this.lastSaleDate).subscribe(res4 => {
      // console.log("details", res4)
      const summary_chart_data = [];
      res4.forEach(row => {
        var RawDate = row.date.split("T");
        var yearMonthDate = RawDate[0].split("-");
        var hourMinSec = RawDate[1].split(":");
        var UTCDate = Date.UTC(parseInt(yearMonthDate[0]), parseInt(yearMonthDate[1]) - 1, parseInt(yearMonthDate[2]), parseInt(hourMinSec[0]), parseInt(hourMinSec[1]), parseInt(hourMinSec[2].split(".")[0]))
        const summary_row = [
          UTCDate,
          row.close
        ];
        summary_chart_data.push(summary_row);
      });
      this.chartOptions1 = {
        title: {
          text: this.stock_symbol.toUpperCase()
        },
        rangeSelector: {
          enabled: false
        },
        plotOptions: {
          series: {
            color: this.chart_chng
          }
        }, time: { useUTC: false },
        xAxis: {
          type: "datetime"
        },
        series: [{
          name: this.stock_symbol.toUpperCase(),
          tooltip: {
            valueDecimals: 2
          },
          data: summary_chart_data,
          type: 'line'
        }],
      };
    });
  }
  addToWishListFromDetails() {

    var watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
    watchlist.push(this.stock_symbol);
    localStorage.setItem('watchlist', JSON.stringify(watchlist));

  }
  addToPortfolioAndShowBuyMsg() {
    // var quant = parseInt(this.quantity)

    var portfoloio_data = JSON.parse(localStorage.getItem("portfolio_data")) || {};
    // console.log(typeof portfoloio_data, portfoloio_data["wmg"][1], this.stock_symbol)
    if (portfoloio_data[this.stock_symbol]) {
      portfoloio_data[this.stock_symbol]["total"] += this.total_price_buy
      portfoloio_data[this.stock_symbol]["quantity"] += +this.quantity
      // portfoloio_data[this.stock_symbol].push([this.total_price_buy, this.quantity])

    }
    else {
      portfoloio_data[this.stock_symbol] = { "total": this.total_price_buy, "quantity": +this.quantity };
      // portfoloio_data[this.stock_symbol].push([this.total_price_buy, this.quantity])
    }
    localStorage.setItem('portfolio_data', JSON.stringify(portfoloio_data));
    var alertva = { "type": "success", "msg": this.stock_symbol + " bought successfully!" }
    console.log(this.msgs)
    if (this.msgs.includes({ "type": "success", "msg": this.stock_symbol + " bought successfully!" })) {
      var himanshu = "kriplani"
    }
    else {
      this.msgs.unshift(alertva);
      setTimeout(this.close.bind(this), 5000, alertva);
    }
    this.saveToMapping(this.stock_symbol, this.daily_data["name"])
    // this.ngOnInit()
  }
  saveToMapping(ticker, name) {
    var ticker_mapping = JSON.parse(localStorage.getItem("ticker_mapping")) || {};
    if (!ticker_mapping[ticker]) {
      ticker_mapping[ticker] = name
    }
    localStorage.setItem('ticker_mapping', JSON.stringify(ticker_mapping));

  }

  open(content) {
    this.quantity = 0;

    this._http.getIexData(this.stock_symbol).subscribe(res => {
      this.iex_data = res;
    });
    this._http.getDailyData(this.stock_symbol).subscribe(res => {
      this.daily_data = res;
    });

    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      console.log("here", this.closeResult)
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });

  }
  openNewsModal(content, news) {

    this.tempNews = news;


    let dateStringArray = this.tempNews["publishedAt"].split('T')[0].split('-');
    // console.log(dateStringArray)
    this.tempNews["publishedAtModified"] = this.month[parseInt(dateStringArray[1])].toString() + " " + dateStringArray[2] + ", " + dateStringArray[0];
    this.tempNews["twitterContent"] = this.tempNews["title"].replace(/ /g, "%20") + " " + this.tempNews["url"];

    // this.quantity = 0;

    // this._http.getIexData(this.stock_symbol).subscribe(res => {
    //   this.iex_data = res;
    // });
    // this._http.getDailyData(this.stock_symbol).subscribe(res => {
    //   this.daily_data = res;
    // });

    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      console.log("here", this.closeResult)
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });

  }
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
  close(m) {
    this.msgs.splice(this.msgs.indexOf(m), 1)
  }
  updateWatchlist() {
    this.inWatchList = !this.inWatchList;
    var alertva;
    if (this.inWatchList) {
      // alertva = { "type": "success", "msg": "Added " + this.stock_symbol };
      this.msgs.unshift({ "type": "success", "msg": this.stock_symbol + " added to watchlist." });
    }
    if (!this.inWatchList) {
      // alertva = { "type": "success", "msg": "Added " + this.stock_symbol };
      this.msgs.unshift({ "type": "danger", "msg": this.stock_symbol + " removed from watchlist." });
    }
    setTimeout(this.close.bind(this), 5000, alertva);
    this.watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
    // this.watchlist.indexOf(this.stock_symbol)
    if (this.watchlist.indexOf(this.stock_symbol) > -1) {
      // filter item
      // console.log("removing", this.stock_symbol)
      // var watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
      this.watchlist = this.watchlist.filter(word => word != this.stock_symbol);
      // console.log("this in update", this.watchlist);
      localStorage.setItem('watchlist', JSON.stringify(this.watchlist));
    } else {
      // console.log("adding", this.stock_symbol)
      // var watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
      this.watchlist.push(this.stock_symbol);
      this.saveToMapping(this.stock_symbol, this.daily_data["name"])
      localStorage.setItem('watchlist', JSON.stringify(this.watchlist));
    }



  }

}
