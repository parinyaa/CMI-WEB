import { Component, OnInit } from '@angular/core';
import {Observable} from 'rxjs';
import {FormControl} from '@angular/forms';
import {map, startWith} from 'rxjs/operators';
import {PricedataService} from '../../../core/service/pricedata/pricedata.service';
import {BaseYear} from '../../../shared/models/dataenty/request/BaseYear';
import {WeightAndIndexRequestForm} from '../../../shared/models/dataenty/request/WeightAndIndexRequestForm';
import {Session} from 'inspector';
import {SessionServiceService} from '../../../core/service/common/session-service.service';
import {ActivatedRoute, Router} from '@angular/router';
import {CommodityService} from '../../../core/service/commodity/commodity.service';
import {NgxSpinnerService} from 'ngx-spinner';

@Component({
  selector: 'app-calculate-index-weight',
  templateUrl: './calculate-index-weight.component.html',
  styleUrls: ['./calculate-index-weight.component.scss']
})
export class CalculateIndexWeightComponent implements OnInit {
  // month = [
  //   {
  //     name: 'มกราคม ', value: 0
  //   }, {
  //     name: 'กุมภาพันธ์ ', value: 1
  //   }, {
  //     name: 'มีนาคม ', value: 2
  //   }, {
  //     name: 'เมษายน ', value: 3
  //   }, {
  //     name: 'พฤษภาคม ', value: 4
  //   }, {
  //     name: 'มิถุนายน ', value: 5
  //   }, {
  //     name: 'กรกฎาคม ', value: 6
  //   }, {
  //     name: 'สิงหาคม ', value: 7
  //   }, {
  //     name: 'กันยายน ', value: 8
  //   }, {
  //     name: 'ตุลาคม ', value: 9
  //   }, {
  //     name: 'พฤศจิกายน ', value: 10
  //   }, {
  //     name: 'ธันวาคม ', value: 11
  //   }];
  // year: number[] = [];
  // baseYearList: BaseYear[] = [];
  //
  // weightAndIndexRequestForm: WeightAndIndexRequestForm = new WeightAndIndexRequestForm();
  //
  filterMonthOptions: Observable<any[]>;
  filterMonthControl = new FormControl();
  //
  filterYearOptions: Observable<number[]>;
  filterYearControl = new FormControl();
  //
  filterBaseYearOptions: Observable<BaseYear[]>;
  filterBaseYearControl = new FormControl();
  constructor(
    // private pricedataService: PricedataService,
    // private sessionService: SessionServiceService,
    // private route: ActivatedRoute,
    // private router: Router,
    // private commodityService: CommodityService,
    // private loading: NgxSpinnerService,
  ) { }

  ngOnInit() {
    // this.pricedataService.getYearTermList().subscribe((r) => {
    //   this.year = r;
    //   const todayDate = new Date();
    //   const thisMonth = todayDate.getMonth();
    //   this.filterMonthControl.setValue(this.month.find(x => x.value === thisMonth));
    //   const thisYear = todayDate.getFullYear();
    //   this.filterYearControl.setValue(this.year.find(x => x === thisYear + 543));
    // }, (er) => {
    //   console.log(er);
    // });
    // this.pricedataService.getBaseYearList().subscribe((r) => {
    //   console.log(r);
    //   this.baseYearList = r;
    //   console.log(this.baseYearList);
    //   this.filterBaseYearControl.setValue(this.baseYearList.find(x => x.status === 'ACTIVE').baseYear);
    // }, (er) => {
    //   console.log(er);
    // });
    // this.filterMonthOptions = this.filterMonthControl.valueChanges
    //   .pipe(
    //     startWith(''),
    //     map(value => {
    //       console.log(value);
    //       return typeof value === 'string' ? value : value.name;
    //     }),
    //     map(monthName => {
    //       console.log(monthName);
    //       return monthName ? this._filterMonthList(monthName) : this.month.slice();
    //     })
    //   );
    // this.filterYearOptions = this.filterYearControl.valueChanges
    //   .pipe(
    //     startWith(''),
    //     map(value => {
    //       console.log(value);
    //       return typeof value === 'string' ? value : value;
    //     }),
    //     map(v => {
    //       console.log(v);
    //       return v ? this._filterYearList(v) : this.year.slice();
    //     })
    //   );
    // this.filterBaseYearOptions = this.filterBaseYearControl.valueChanges
    //   .pipe(
    //     startWith(''),
    //     map(value => {
    //       console.log(value);
    //       return typeof value === 'string' ? value : value;
    //     }),
    //     map(v => {
    //       console.log(v);
    //       return v ? this._filterBaseYear(v) : this.baseYearList.slice();
    //     })
    //   );
  }
  back() {
    // this.router.navigate(['/commodityvalidate']);
  }
  calculateIndexAndWeight() {
  //   this.loading.show();
  //   console.log('calculateIndexAndWeight');
  //   console.log('filterBaseYearControl', this.filterBaseYearControl);
  //   console.log('filterMonthControl', this.filterMonthControl);
  //   console.log('filterYearControl', this.filterYearControl);
  //   this.setRequestForm();
  //   console.log(this.weightAndIndexRequestForm);
  //   this.commodityService.calculateWeightAndIndex(this.weightAndIndexRequestForm).subscribe((r) => {
  //     this.loading.hide();
  //     console.log(r);
  //   }, (er) => {
  //     this.loading.hide();
  //     console.log(er);
  //   });
  // }
  // setRequestForm() {
  //   console.log(this.filterMonthControl);
  //   if (this.filterMonthControl.value != null) {
  //     this.weightAndIndexRequestForm.monthTerm = this.filterMonthControl.value.value + 1;
  //   }
  //   console.log(this.filterYearControl);
  //   if (this.filterYearControl.value != null) {
  //     this.weightAndIndexRequestForm.yearTerm = this.filterYearControl.value;
  //   }
  //   console.log(this.filterBaseYearControl);
  //   if (this.filterBaseYearControl.value != null) {
  //     this.weightAndIndexRequestForm.baseYearId = this.baseYearList.find(x => x.baseYear === this.filterBaseYearControl.value).baseYearId;
  //   }
  //   this.weightAndIndexRequestForm.commodityCode = this.sessionService.getWeightAndIndexParam();
  }
  displayFilterMonth(month?: any): string | undefined {
    return month ? month.name : undefined;
  }
  displayFilterYear(year?: any): string | undefined {
    return year ? year : undefined;
  }
  displayFilterBaseYear(year?: any): string | undefined {
    return year ? year : undefined;
  }
  // private _filterYearList(name: string): any[] {
  //   const filterValue = name;
  //
  //   return this.year.filter(x => x.toString().startsWith(filterValue));
  // }
  // private _filterMonthList(name: string): any[] {
  //   const filterValue = name;
  //
  //   return this.month.filter(x => x.name.startsWith(filterValue));
  // }
  // private _filterBaseYear(v: string): any[] {
  //   const filterValue = v;
  //
  //   return this.baseYearList.filter(x => x.baseYear.toString().startsWith(filterValue));
  // }

}
