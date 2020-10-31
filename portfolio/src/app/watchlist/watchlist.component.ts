import { Component, OnInit } from '@angular/core';
import { BackendNodeService } from '../backend-node.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-watchlist',
  templateUrl: './watchlist.component.html',
  styleUrls: ['./watchlist.component.css']
})
export class WatchlistComponent implements OnInit {
  watchlist = [];
  WLCardsData = [];
  loaded = false;
  iex_data_arr;
  ticker_mapping;
  constructor(private _http: BackendNodeService, private router: Router) { }

  ngOnInit(): void {
    this.watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
    //watchlist.push(this.stock_symbol);
    this.ticker_mapping = JSON.parse(localStorage.getItem("ticker_mapping")) || {};
    this.loadWLData();
    // setInterval(() => {
    //   this.loaded = true
    // }, 200)

  }

  async loadWLData() {
    this.watchlist.sort()



    var stocks = this.watchlist.join(",");

    this._http.getIexDataMulti(stocks).subscribe(res => {
      this.iex_data_arr = res;
      var temp_json = {}
      for (var i = 0; i < this.iex_data_arr.length; i++) {
        temp_json[this.iex_data_arr[i]['ticker']] = this.iex_data_arr[i]
      }

      for (var i = 0; i < this.watchlist.length; i++) {
        var tick = this.watchlist[i]
        this.WLCardsData.push({ 'name': this.ticker_mapping[tick], 'tickername': tick, 'price': temp_json[tick]['last'], 'change': parseFloat((temp_json[tick]['last'] - temp_json[tick]['prevClose']).toFixed(2)), changepercent: parseFloat(((temp_json[tick]['last'] - temp_json[tick]['prevClose']) * 100 / temp_json[tick]['prevClose']).toFixed(2)) })
      }
      this.loaded = true;
    });






    // this.loaded = true;

  }
  refreshData() {
    var stocks = this.watchlist.join(",");

    this._http.getIexDataMulti(stocks).subscribe(res => {
      this.iex_data_arr = res;
      var temp_json = {}
      for (var i = 0; i < this.iex_data_arr.length; i++) {
        temp_json[this.iex_data_arr[i]['ticker']] = this.iex_data_arr[i]
      }

      for (var i = 0; i < this.watchlist.length; i++) {
        var tick = this.watchlist[i]
        this.WLCardsData[i]['price'] = temp_json[tick]['last']
        this.WLCardsData[i]['change'] = parseFloat((temp_json[tick]['last'] - temp_json[tick]['prevClose']).toFixed(2))
        this.WLCardsData[i]['changepercent'] = parseFloat(((temp_json[tick]['last'] - temp_json[tick]['prevClose']) * 100 / temp_json[tick]['prevClose']).toFixed(2))
        // this.WLCardsData.push({ 'name': this.ticker_mapping[tick], 'tickername': tick, 'price': temp_json[tick]['last'], 'change': parseFloat((temp_json[tick]['last'] - temp_json[tick]['prevClose']).toFixed(2)), changepercent: parseFloat(((temp_json[tick]['last'] - temp_json[tick]['prevClose']) * 100 / temp_json[tick]['prevClose']).toFixed(2)) })
      }

    });
  }
  closeWatchlist(m) {
    console.log(m)
    this.WLCardsData = this.WLCardsData.filter(res => res.tickername != m)

    this.watchlist.splice(this.watchlist.indexOf(m), 1)

    localStorage.setItem('watchlist', JSON.stringify(this.watchlist));
    // console.log(this.WLCardsData);
    // console.log(this.watchlist)

    this.refreshData();
  }
  callDetails(ticker) {
    this.router.navigate(['/details', ticker])

  }


}
