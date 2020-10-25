import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

import { BackendNodeService } from '../backend-node.service';

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
  month = ["null", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  // iexLoaded: Promise<false>;
  closeResult = '';


  constructor(private route: ActivatedRoute, private _http: BackendNodeService, private modalService: NgbModal) { }

  ngOnInit(): void {

    this.sub = this.route.params.subscribe(params => {
      this.stock_symbol = params['stocksymbol'].toUpperCase();;
    });
    // this.stk_data = this._http.getDetail(this.stock_symbol);
    this._http.getIexData(this.stock_symbol).subscribe(res => {
      this.iex_data = res;
    });
    this._http.getDailyData(this.stock_symbol).subscribe(res => {
      this.daily_data = res;
    });
    this._http.getNews(this.stock_symbol).subscribe(res => {
      this.newsData = res['articles'];
    });
    this.watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
    // console.log("oninit", this.watchlist)
    if (this.watchlist.indexOf(this.stock_symbol) > -1) {
      this.inWatchList = true;

    }

    // localStorage.setItem('watchlist', JSON.stringify(this.watchlist));


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
    this.msgs.unshift(alertva);
    setTimeout(this.close.bind(this), 5000, alertva);
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
      alertva = { "type": "success", "msg": "Added " + this.stock_symbol };
      this.msgs.unshift({ "type": "success", "msg": "Added " + this.stock_symbol });
    }
    if (!this.inWatchList) {
      alertva = { "type": "success", "msg": "Added " + this.stock_symbol };
      this.msgs.unshift({ "type": "danger", "msg": "removed " + this.stock_symbol });
    }
    setTimeout(this.close.bind(this), 5000, alertva);
    this.watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
    // this.watchlist.indexOf(this.stock_symbol)
    if (this.watchlist.indexOf(this.stock_symbol) > -1) {
      // filter item
      // console.log("removing", this.stock_symbol)
      // var watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
      this.watchlist = this.watchlist.filter(word => word != this.stock_symbol);
      console.log("this in update", this.watchlist);
      localStorage.setItem('watchlist', JSON.stringify(this.watchlist));
    } else {
      // console.log("adding", this.stock_symbol)
      // var watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
      this.watchlist.push(this.stock_symbol);
      localStorage.setItem('watchlist', JSON.stringify(this.watchlist));
    }



  }

}
