import { Component, OnInit } from '@angular/core';
import { BackendNodeService } from '../backend-node.service';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css']
})
export class PortfolioComponent implements OnInit {
  portfolio_data;
  iex_data;
  loaded = false;
  constructor(private _http: BackendNodeService) {

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

}
