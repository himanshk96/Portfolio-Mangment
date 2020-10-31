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
  }

  async loadWLData() {
    this.watchlist.sort()



    var stocks = this.watchlist.join(",");
    // console.log("loaddata", this.watchlist.join(","))

    this._http.getIexDataMulti(stocks).subscribe(res => {
      this.iex_data_arr = res;
      var temp_json = {}
      for (var i = 0; i < this.iex_data_arr.length; i++) {
        temp_json[this.iex_data_arr[i]['ticker']] = this.iex_data_arr[i]
      }
      // console.log('temp', temp_json)
      //sort by id
      // let keys = Object.keys(this.purchasedlist).sort();
      //   for(let i=0;i<keys.length;i++){
      //     this.purchasedSorted.push(this.purchasedlist[keys[i]]);
      //   }
      // console.log('iexarr', this.iex_data_arr);

      for (var i = 0; i < this.watchlist.length; i++) {
        var tick = this.watchlist[i]
        this.WLCardsData.push({ 'name': this.ticker_mapping[tick], 'tickername': tick, 'price': temp_json[tick]['last'], 'change': parseFloat((temp_json[tick]['last'] - temp_json[tick]['prevClose']).toFixed(2)), changepercent: parseFloat(((temp_json[tick]['last'] - temp_json[tick]['prevClose']) * 100 / temp_json[tick]['prevClose']).toFixed(2)) })
      }
      // console.log('wlD', this.WLCardsData)
    });




    // for (var i = 0; i < this.watchlist.length; i++) {

    //   let ticker_data = await this._http.getAsyncData(this.watchlist[i])
    //   this.WLCardsData.push({ 'name': ticker_data[2], 'tickername': this.watchlist[i], 'price': ticker_data[0], 'change': parseFloat((ticker_data[0] - ticker_data[1]).toFixed(2)), changepercent: parseFloat(((ticker_data[0] - ticker_data[1]) * 100 / ticker_data[1]).toFixed(2)) });

    // };
    setInterval(() => {
      this.loaded = true
    }, 200)
    // this.loaded = true;

  }
  closeWatchlist(m) {
    console.log(m)
    this.WLCardsData = this.WLCardsData.filter(res => res.tickername != m)

    this.watchlist.splice(this.watchlist.indexOf(m), 1)

    localStorage.setItem('watchlist', JSON.stringify(this.watchlist));
    // console.log(this.WLCardsData);
    // console.log(this.watchlist)

  }
  callDetails(ticker) {
    this.router.navigate(['/details', ticker])

  }


}
