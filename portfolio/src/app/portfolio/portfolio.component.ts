import { Component, OnInit } from '@angular/core';
import { BackendNodeService } from '../backend-node.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css']
})
export class PortfolioComponent implements OnInit {
  portfolio_data;
  iex_data;
  loaded = false;
  closeResult = '';
  daily_data;
  quantity;
  total_price_buy;
  cur_stock_symbol;
  curr_quantity;
  ticker_mapping;
  iex_data_arr;
  t1; t2; market_open; currentDate; formatDate;
  constructor(private _http: BackendNodeService, private modalService: NgbModal, private router: Router) {

  }
  port_data = {};
  checkNeg(val) {
    if (val <= 0) {
      this.total_price_buy = 0.00

    }
    return this.total_price_buy
  }
  ngOnInit(): void {
    this.portfolio_data = JSON.parse(localStorage.getItem("portfolio_data")) || {};
    this.ticker_mapping = JSON.parse(localStorage.getItem("ticker_mapping")) || {};
    // console.log("loading live data")

    this.loadIEXData()

    // console.log("loaded live data")
  }
  async loadIEXData() {
    var stock_list = Object.keys(this.portfolio_data);
    stock_list.sort();
    var stocks = stock_list.join(",");
    // console.log("loaddata", stock_list.join(","))
    console.log(this.portfolio_data == null, this.portfolio_data == {}, this.portfolio_data)
    if (Object.keys(this.portfolio_data).length == 0) {
      this.loaded = true
      return
    }
    this._http.getIexDataMulti(stocks).subscribe(res => {
      this.iex_data_arr = res;
      console.log("this is the things", this.iex_data_arr)
      var temp_json = {}
      for (var i = 0; i < this.iex_data_arr.length; i++) {
        temp_json[this.iex_data_arr[i]['ticker']] = this.iex_data_arr[i]
      }
      // console.log('port_temp', temp_json)
      for (var i = 0; i < stock_list.length; i++) {
        var sym = stock_list[i]
        let ticker_data = temp_json[sym]//await this._http.getAsyncData(sym)
        this.port_data[sym] = { 'last': ticker_data['last'], 'name': this.ticker_mapping[sym] }
        // this.port_data.push({ 'name': ticker_data[2], 'tickername': sym, 'price': ticker_data[0], 'change': parseFloat((ticker_data[0] - ticker_data[1]).toFixed(2)), changepercent: parseFloat(((ticker_data[0] - ticker_data[1]) * 100 / ticker_data[1]).toFixed(2)) });

      };
      this.loaded = true;

    });
    // setInterval(() => {
    //   this.loaded = true
    // }, 200)
    // this.loaded = true;
    // console.log("this", this.port_data)
  }
  refreshData() {

    var stock_list = Object.keys(this.portfolio_data);
    stock_list.sort();
    var stocks = stock_list.join(",");
    // console.log("loaddata", stock_list.join(","))

    this._http.getIexDataMulti(stocks).subscribe(res => {
      this.iex_data_arr = res;
      var temp_json = {}

      for (var i = 0; i < this.iex_data_arr.length; i++) {
        temp_json[this.iex_data_arr[i]['ticker']] = this.iex_data_arr[i]
      }
      // console.log('port_temp', temp_json)
      for (var i = 0; i < stock_list.length; i++) {
        var sym = stock_list[i]
        let ticker_data = temp_json[sym]//await this._http.getAsyncData(sym)
        this.port_data[sym] = { 'last': ticker_data['last'], 'name': this.ticker_mapping[sym] }
        // this.port_data.push({ 'name': ticker_data[2], 'tickername': sym, 'price': ticker_data[0], 'change': parseFloat((ticker_data[0] - ticker_data[1]).toFixed(2)), changepercent: parseFloat(((ticker_data[0] - ticker_data[1]) * 100 / ticker_data[1]).toFixed(2)) });

      };

    });
  }
  float2int(value) {
    // console.log("float_int", value | 0)
    return value | 0;
  }
  getQuantity(sym) {
    var portfoloio_data = JSON.parse(localStorage.getItem("portfolio_data")) || {};
    // console.log("quantity on hand", typeof portfoloio_data[sym]["quantity"])
    return portfoloio_data[sym]["quantity"]
  }

  getTotalPrice(sym) {
    var portfoloio_data = JSON.parse(localStorage.getItem("portfolio_data")) || {};
    return portfoloio_data[sym]["total"]
  }
  open(content, stock_symbol) {
    this.marketDate()
    this.FindcurrentDate()
    this.market_open = (this.t2 - this.t1) > 60000 ? false : true
    console.log(this.market_open)
    this.quantity = 0;
    this.total_price_buy = 0;
    this.cur_stock_symbol = stock_symbol;
    this.curr_quantity = this.portfolio_data[stock_symbol]["quantity"];

    // this._http.getIexData(stock_symbol).subscribe(res => {
    //   this.iex_data = res;
    // });
    // this._http.getDailyData(stock_symbol).subscribe(res => {
    //   this.daily_data = res;
    // });
    console.log(this.port_data)
    // for (var i = 0; i < Object.keys(this.port_data).length; i++) {}

    this.iex_data = this.port_data[this.cur_stock_symbol]

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
  addToPortfolioAndShowBuyMsg() {
    // var quant = parseInt(this.quantity)

    var portfoloio_data = JSON.parse(localStorage.getItem("portfolio_data")) || {};
    // console.log(typeof portfoloio_data, portfoloio_data["wmg"][1], this.stock_symbol)
    if (portfoloio_data[this.cur_stock_symbol]) {
      portfoloio_data[this.cur_stock_symbol]["total"] += this.total_price_buy
      portfoloio_data[this.cur_stock_symbol]["quantity"] += +this.quantity
      // portfoloio_data[this.stock_symbol].push([this.total_price_buy, this.quantity])

    }
    else {
      portfoloio_data[this.cur_stock_symbol] = { "total": this.total_price_buy, "quantity": +this.quantity };
      // portfoloio_data[this.stock_symbol].push([this.total_price_buy, this.quantity])

    }
    // this.curr_quantity = portfoloio_data[this.cur_stock_symbol]["quantity"]
    this.portfolio_data = portfoloio_data;
    localStorage.setItem('portfolio_data', JSON.stringify(portfoloio_data));
    // var alertva = { "type": "success", "msg": this.cur_stock_symbol + " bought successfully!" }
    // this.msgs.unshift(alertva);
    // setTimeout(this.close.bind(this), 5000, alertva);
    this.refreshData()

  }
  removeFromPortfolio() {
    // var quant = parseInt(this.quantity)

    var portfoloio_data = JSON.parse(localStorage.getItem("portfolio_data")) || {};
    // console.log(typeof portfoloio_data, portfoloio_data["wmg"][1], this.stock_symbol)
    if (portfoloio_data[this.cur_stock_symbol]) {
      portfoloio_data[this.cur_stock_symbol]["total"] -= this.total_price_buy
      portfoloio_data[this.cur_stock_symbol]["quantity"] -= +this.quantity
      // portfoloio_data[this.stock_symbol].push([this.total_price_buy, this.quantity])

    }
    if (portfoloio_data[this.cur_stock_symbol]["quantity"] == 0) {
      delete portfoloio_data[this.cur_stock_symbol];
    }
    this.portfolio_data = portfoloio_data;
    localStorage.setItem('portfolio_data', JSON.stringify(portfoloio_data));
    // var alertva = { "type": "success", "msg": this.cur_stock_symbol + " bought successfully!" }
    // this.msgs.unshift(alertva);
    // setTimeout(this.close.bind(this), 5000, alertva);
    this.refreshData()
  }
  getLenPortfolio() {
    return Object.keys(this.portfolio_data).length
  }
  callDetails(ticker) {
    this.router.navigate(['/details', ticker])

  }



  marketDate() {

    //Current date and time

    // this.currentDate = date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0" + date.getDate()).slice(-2) + " " + ("0" + date.getHours()).slice(-2) + ":" + ("0" + date.getMinutes()).slice(-2) + ":" + ("0" + date.getSeconds()).slice(-2);

    //Date from API "timestamp"
    var date = this.iex_data_arr[0]["timestamp"]
    date = new Date(date)
    var t1 = date.getTime()
    this.formatDate = date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0" + date.getDate()).slice(-2) + " " + ("0" + date.getHours()).slice(-2) + ":" + ("0" + date.getMinutes()).slice(-2) + ":" + ("0" + date.getSeconds()).slice(-2);
    // console.log(this.iex_data_arr[0]["timestamp"])
    // var tempInput = this.iex_data_arr[0]["timestamp"].substr(0, 10) + "T" + this.iex_data_arr[0]["timestamp"].substr(11, 8) + "Z";
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

}
