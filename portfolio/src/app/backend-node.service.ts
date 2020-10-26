import { Injectable, ɵConsole } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { syntaxError } from '@angular/compiler';
import { Observable, of } from 'rxjs';
import { supportsScrollBehavior } from '@angular/cdk/platform';


@Injectable({
  providedIn: 'root'
})
export class BackendNodeService {
  backend_url = "http://localhost:3000";
  iex_data;
  constructor(private http: HttpClient) { }
  async getAsyncData(name: string) {
    var arr = []
    // console.log(name);
    await this.getIexData(name).toPromise().then(data => {
      // console.log(data)
      arr.push(data["last"]);
      arr.push(data["prevClose"]);
    })
    await this.getDailyData(name).toPromise().then(data => arr.push(data["name"]))

    return arr
  }
  getSearch(stock_symbol) {
    // console.log('here I come to the rescue');
    //var suggestions = this.http.get(this.backend_url + "/api/search/" + stock_symbol).subscribe(res => [res["name"], res["ticker"]]);

    return this.http.get(this.backend_url + "/api/search/" + stock_symbol);
  }

  getDetail(stock_symbol) {
    // console.log('here I come to the rescue');

    return this.http.get(this.backend_url + "/api/detail/" + stock_symbol);
  }
  getIexData(stock_symbol) {
    // console.log('here I come to the rescue');
    // this.http.get(this.backend_url + "/api/iex_data/" + stock_symbol).subscribe(res => this.iex_data = res)
    return this.http.get(this.backend_url + "/api/iex_data/" + stock_symbol);
  }
  getDailyData(stock_symbol) {
    // console.log('here I come to the rescue');
    // this.http.get(this.backend_url + "/api/iex_data/" + stock_symbol).subscribe(res => this.iex_data = res)
    return this.http.get(this.backend_url + "/api/daily_data/" + stock_symbol);
  }
  getNews(stock_symbol) {
    // console.log('here I come to the rescue');
    // this.http.get(this.backend_url + "/api/iex_data/" + stock_symbol).subscribe(res => this.iex_data = res)
    return this.http.get(this.backend_url + "/api/news_data/" + stock_symbol);
  }
  getCharts(ticker, lastSaleDate): Observable<any> {
    return this.http.get<any>(this.backend_url + `/charts/${ticker}/${lastSaleDate}`);
  }

  getVolumeCharts(ticker, pastTwoYearDate): Observable<any> {
    return this.http.get<any>(this.backend_url + `/volumeCharts/${ticker}/${pastTwoYearDate}`);
  }

}
