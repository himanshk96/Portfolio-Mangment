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
  constructor(private _http: BackendNodeService, private router: Router) { }

  ngOnInit(): void {
    // console.log('here I come');
    // $('input').click(function () {
    //   console.log("here");
    // });
    this.search_options = this._http.getSearch("apple");
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
  }
  goToDetails() {
    console.log(this.stk_symbol);
    this.router.navigate(['/details', this.stk_symbol])
    return null;

  }




}
