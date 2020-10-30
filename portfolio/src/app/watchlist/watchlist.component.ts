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
  constructor(private _http: BackendNodeService, private router: Router) { }

  ngOnInit(): void {
    this.watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
    //watchlist.push(this.stock_symbol);
    this.loadWLData();
  }

  async loadWLData() {
    this.watchlist.sort()



    // var stocks = this.watchlist.join(",");
    // console.log("loaddata", this.watchlist.join(","))

    // this._http.getIexDataMulti(stocks).subscribe(res => {
    //   this.iex_data_arr = res;
    //   for (var i = 0; i < this.watchlist.length; i++) {
    //     this.WLCardsData.push({ 'name': 'a', 'tickername': this.watchlist[i], 'price': this.iex_data_arr[i]['last'], 'change': parseFloat((this.iex_data_arr[i]['last'] - this.iex_data_arr['prevClose']).toFixed(2)), changepercent: parseFloat(((this.iex_data_arr[i]['last'] - this.iex_data_arr['prevClose']) * 100 / this.iex_data_arr['prevClose']).toFixed(2)) })
    //   }

    // });



    for (var i = 0; i < this.watchlist.length; i++) {

      let ticker_data = await this._http.getAsyncData(this.watchlist[i])
      this.WLCardsData.push({ 'name': ticker_data[2], 'tickername': this.watchlist[i], 'price': ticker_data[0], 'change': parseFloat((ticker_data[0] - ticker_data[1]).toFixed(2)), changepercent: parseFloat(((ticker_data[0] - ticker_data[1]) * 100 / ticker_data[1]).toFixed(2)) });

    };
    this.loaded = true;

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
