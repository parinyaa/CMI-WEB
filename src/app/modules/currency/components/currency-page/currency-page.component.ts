import { Component, OnInit, LOCALE_ID, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommodityService } from 'src/app/core/service/commodity/commodity.service';
import { ParamService } from 'src/app/core/service/param/param.service';
import { CurrencyService } from 'src/app/core/service/currency/currency.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatTableDataSource } from '@angular/material';
import { isNull } from 'util';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { InsertCurrencyRequest } from 'src/app/shared/models/currency/request/InsertCurrencyRequest.model';
declare var $: any;



@Component({
  selector: 'app-currency-page',
  templateUrl: './currency-page.component.html',
  styleUrls: ['./currency-page.component.scss'],
})
export class CurrencyPageComponent implements OnInit {

  @ViewChild('invalidSwal', { static: false }) invalidSwal: SwalComponent;
  @ViewChild('addSwal', { static: false }) addSwal: SwalComponent;
  @ViewChild('succussSwal', { static: false }) succussSwal: SwalComponent;
  @ViewChild('errorSwal', { static: false }) errorSwal: SwalComponent;

  yearList = new Array();
  monthList = new Array();
  currencyList = new Array();
  dataSource = new MatTableDataSource();

  inquiryData: FormGroup;

  showContent = false;
  noData = true;
  submitted = false;

  displayedColumns = ['position', 'currency', 'name', 'exchange', 'action']

  isShowSave = true;

  constructor(
    private commodityService: CommodityService,
    private paramService: ParamService,
    private _FormBuild: FormBuilder,
    private currencyService: CurrencyService,
    private loading: NgxSpinnerService,
    private insertCurrencyRequest: InsertCurrencyRequest
  ) {

  }

  ngOnInit() {

    this.getListYearFromPriceData();
    // this.getParamMonthAndCurrencyDB();
    this.getParamMonth();

    this.inquiryData = this._FormBuild.group({
      year: ['', Validators.required],
      month: ['', Validators.required],
    });
    // if (localStorage.getItem('params')) {
    //   this.getParamMonthAndCurrency(JSON.parse(localStorage.getItem('params')));
    // }
    // else {
    //   this.getParamMonthAndCurrencyDB();
    // }

  }

  getListYearFromPriceData() {
    this.commodityService.inquiryYearFromPriceData().subscribe(res => {
      this.yearList = res;
    });
  }

  getParamMonth() {
    this.paramService.getParamInfoByGroup('MONTH').subscribe(res => {
      this.monthList = res.info;
      this.monthList = this.monthList.sort((a, b) =>  a.orderNo -  b.orderNo);
    });
    console.log( this.monthList )
  }

  getParamMonthAndCurrency(paramList: []) {
    paramList.forEach(element => {
      let tmp: any = element;
      if (tmp.paramGroup == 'MONTH') {
        this.monthList = tmp.info;
      }
      else if (tmp.paramGroup == 'CURRENCY_UNIT') {
        this.currencyList = tmp.info;
      }
    });
  }

  getParamMonthAndCurrencyDB() {
    this.paramService.getParamsGroup().subscribe(
      (res) => {
        console.log(res);
        this.getParamMonthAndCurrency(res);
      }
    );
  }

  getCurrencyDataByYearAndMonth() {
    console.log(this.inquiryData.controls['month'].value);
    console.log(new Date().getMonth());
    this.loading.show();
    this.currencyService.getCurrencyByYearAndMonth(this.inquiryData.controls['year'].value, this.inquiryData.controls['month'].value).subscribe(
      (res) => {
        this.isShowSave = true;
        res.forEach(element => {
          if (!isNull(element.exchangeRate)) {
            this.isShowSave = false;
          }
          element.mode = 'edit';
        });
        if (new Date().getMonth() + 1 == this.inquiryData.controls['month'].value) {
          this.isShowSave = true;
        }
        this.dataSource = new MatTableDataSource(res);
        this.showContent = true;
        this.noData = false;
        this.loading.hide();
      },
      (err) => {
        this.loading.hide();
      });
  }

  get f() { return this.inquiryData.controls; }

  onSubmit() {
    this.submitted = true;
    if (this.inquiryData.invalid) {
      return
    } else {
      this.getCurrencyDataByYearAndMonth();
    }
  }

  editElementCurrency(element) {
    element.mode = 'save';
    if (isNull(element.exchangeRate)) {
      element.exchangeRate = 0;
    }
  }

  cancelElementCurrency(element) {
    element.mode = 'edit';
    element.exchangeRate = null;
  }

  saveElementCurrency(element, i) {
    let currency = $('#input' + i).val();
    if (currency.length > 0) {
      element.mode = 'edit';
      element.exchangeRate = parseFloat(currency);
    }
    else {
      this.invalidSwal.title = 'กรุณากรอกข้อมูล <br /> ให้ถูกต้อง'
      this.invalidSwal.show();
    }
  }

  beforeInsertData() {
    this.insertCurrencyRequest.monthTerm = this.inquiryData.controls['month'].value;
    this.insertCurrencyRequest.yearTerm = this.inquiryData.controls['year'].value;
    this.insertCurrencyRequest.listData = new Array();
    this.dataSource.data.forEach(element => {
      let tmp: any = element;
      if (!isNull(tmp.exchangeRate)) {
        let data = {
          currencyUnit: tmp.currencyKey.currencyUnit.paramInfoId,
          exchangeRate: tmp.exchangeRate
        }
        this.insertCurrencyRequest.listData.push(data);
      }
    });
    if (this.insertCurrencyRequest.listData.length <= 0) {
      this.invalidSwal.title = 'ไม่มีข้อมูลเปลี่ยนแปลง'
      this.invalidSwal.show();
    }
    else {
      this.addSwal.show();
    }
  }

  insertData() {
    this.loading.show();
    this.currencyService.insertCurrency(this.insertCurrencyRequest).subscribe((res) => {
      this.loading.hide();
      this.succussSwal.show();
      this.getCurrencyDataByYearAndMonth();
    }, (error) => {
      this.loading.hide();
    });
  }

  sortData(e){
    this.dataSource.sortingDataAccessor = (item, property) => {
      console.log(property);
      switch (property) {
          case 'sourceCode': {
          return item['source'].sourceCode;
        } case 'sourceName': {
          return item['source'].sourceName;
        } case 'sourceContact': {
          return item['contactPerson'][0].contactName;
        } case 'objectiveSource': {
          return item['contactPersons'][0].contactName;
        } case 'countCpa': {
          return item['countCap'];
        }
        default: return item[property];
      }
    };
  }

}
