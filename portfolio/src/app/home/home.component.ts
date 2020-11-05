import { Component, OnInit } from '@angular/core';
import { BackendNodeService } from '../backend-node.service';
import { MatTabsModule } from '@angular/material/tabs';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
  search_options: object;
  control = new FormControl();
  stk_symbol;
  Ready = true;
  // constructor(private _http: BackendNodeService, private router: Router) { }

  // ngOnInit(): void {

  //   this.search_options = this._http.getSearch("apple");
  // }
  ticker: string = "";
  options: Object;
  myControl = new FormControl();
  showSpinner = false;

  constructor(private _http: BackendNodeService, private router: Router) { }

  ngOnInit(): void {

  }

  onSubmit(ticker) {
    this.router.navigate(['/details', ticker]);
    // if (ticker != '') {
    //   this.router.navigate(['/details', ticker]);
    // }
    // return null;
  }

  goToHomePage() {
    this.router.navigate(['/']);
    return null;
  }

  autocomplete(ticker) {
    this.options = this._http.getSearch(ticker);
    clearTimeout();
    this.showSpinner = true
    setTimeout(() => {
      this.showSpinner = false
    }, 300);
    return null;
  }
  // getOptions(symbol) {
  //   this.search_options = this._http.getSearch(symbol);
  // }
  getSearchOption(symbol) {
    // console.log("change");
    this.search_options = this._http.getSearch(symbol);
  }
  modelChangeFn(value) {
    this.stk_symbol = value;
    this.Ready = false;
    console.log('before', this.Ready)
    this.getSearchOption(value)
    this.Ready = true;
    console.log('after', this.Ready)
  }
  goToDetails() {
    console.log(this.stk_symbol);
    this.router.navigate(['/details', this.stk_symbol])
    return null;

  }




}
