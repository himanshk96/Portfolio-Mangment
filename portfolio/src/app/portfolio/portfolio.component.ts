import { Component, OnInit } from '@angular/core';
import { BackendNodeService } from '../backend-node.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

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

  constructor(private _http: BackendNodeService, private modalService: NgbModal) {

  }
  port_data = {};
  ngOnInit(): void {
    this.portfolio_data = JSON.parse(localStorage.getItem("portfolio_data")) || {};
    // console.log("loading live data")
    this.loadIEXData()
    // console.log("loaded live data")
  }
  async loadIEXData() {
    var stock_list = Object.keys(this.portfolio_data);
    stock_list.sort();
    for (var i = 0; i < stock_list.length; i++) {
      var sym = stock_list[i]
      let ticker_data = await this._http.getAsyncData(sym)
      this.port_data[sym] = { 'last': ticker_data[0], 'name': ticker_data[2] }
      // this.port_data.push({ 'name': ticker_data[2], 'tickername': sym, 'price': ticker_data[0], 'change': parseFloat((ticker_data[0] - ticker_data[1]).toFixed(2)), changepercent: parseFloat(((ticker_data[0] - ticker_data[1]) * 100 / ticker_data[1]).toFixed(2)) });

    };
    this.loaded = true;
    // console.log("this", this.port_data)
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
    this.quantity = 0;
    this.total_price_buy = 0;
    this.cur_stock_symbol = stock_symbol;
    this.curr_quantity = this.portfolio_data[stock_symbol]["quantity"]
    this._http.getIexData(stock_symbol).subscribe(res => {
      this.iex_data = res;
    });
    this._http.getDailyData(stock_symbol).subscribe(res => {
      this.daily_data = res;
    });

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
    localStorage.setItem('portfolio_data', JSON.stringify(portfoloio_data));
    // var alertva = { "type": "success", "msg": this.cur_stock_symbol + " bought successfully!" }
    // this.msgs.unshift(alertva);
    // setTimeout(this.close.bind(this), 5000, alertva);
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

    localStorage.setItem('portfolio_data', JSON.stringify(portfoloio_data));
    // var alertva = { "type": "success", "msg": this.cur_stock_symbol + " bought successfully!" }
    // this.msgs.unshift(alertva);
    // setTimeout(this.close.bind(this), 5000, alertva);

  }
  getLenPortfolio() {
    return Object.keys(this.portfolio_data).length
  }
}
