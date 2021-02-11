import  localeTh  from '@angular/common/locales/th';
import {Component, OnInit, ViewChild} from '@angular/core';
import FileSaver from 'file-saver';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {BaseyearService} from '../../../../core/service/baseyear/baseyear.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {ParamService} from '../../../../core/service/param/param.service';
import {CommodityService} from '../../../../core/service/commodity/commodity.service';
import {InquiryResultCommodityRequest} from '../../../../shared/models/result-commodity/request/InquiryResultCommodityRequest.model';
import {MatTableDataSource, PageEvent} from '@angular/material';
import {ViewWeight} from '../../model/view-weight';
import {SwalComponent} from '@sweetalert2/ngx-sweetalert2';
import { registerLocaleData } from '@angular/common';

@Component({
  selector: 'app-result-sop-weight-page',
  templateUrl: './result-sop-weight-page.component.html',
  styleUrls: ['./result-sop-weight-page.component.scss']
})
export class ResultSopWeightPageComponent implements OnInit {


  @ViewChild('errorSwal', {static: false}) errorSwal: SwalComponent;

  yearList = new Array();
  monthList = new Array();
  baseYearList = new Array();
  inquiryData: FormGroup;
  dataSource = new MatTableDataSource<ViewWeight>();

  length = 0;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100, 500, 1000];
  pageEvent: PageEvent = new PageEvent;

  showContent = false;
  noData = true;
  submitted = false;

  displayedColumns: string[] =  ['result', 'avgGmCurrentPrice', 'avgGmRelative', 'baseWeightValue', 'prevWeightValue', 'prevWeightProportion'
  , 'curWeightValue', 'curWeightProportion', 'prevIndexValue', 'curIndexValue', 'changeMom', 'changeYoy', 'changeAoa', 'cMom', 'cYoy'
  , 'cAoa'];


  constructor(
    private inquiryResultCommodityRequest: InquiryResultCommodityRequest,
    private commodityService: CommodityService,
    private paramService: ParamService,
    private loading: NgxSpinnerService,
    private _FormBuild: FormBuilder,
    private baseyearService: BaseyearService
  ) {
    registerLocaleData(localeTh,'th');
  }

  ngOnInit() {

    this.inquiryData = this._FormBuild.group({
      baseYear: ['', Validators.required],
      year: ['', Validators.required],
      month: ['', Validators.required],
    });
    this.getParamMonth();
    this.getBaseYearActive();
  }

  getListResultCommodity() {
    this.loading.show();
    this.inquiryResultCommodityRequest.baseYear = this.inquiryData.controls['baseYear'].value;
    this.inquiryResultCommodityRequest.year = this.inquiryData.controls['year'].value;
    this.inquiryResultCommodityRequest.month = this.inquiryData.controls['month'].value;
    this.commodityService.inquirySopWeight(this.inquiryResultCommodityRequest).subscribe((res) => {
        this.loading.hide();
        this.showContent = true;
        if (!res.length) {
          this.noData = true;
        } else {
          this.noData = false;
          this.dataSource = new MatTableDataSource<ViewWeight>(res);
        }
      },
      (error) => {
        this.showContent = false;
        console.log(error.error.messageEn);
        this.errorSwal.title = error.error.messageEn;
        this.loading.hide();
      });
  }

  getListYearFromPriceData(id) {
    this.commodityService.inquiryYearFromPriceDataById(id).subscribe(res => {
      this.yearList = res;
    });
  }

  getParamMonth() {
    this.paramService.getParamInfoByGroup('MONTH').subscribe(res => {
      this.monthList = res.info;
      this.monthList =  this.monthList.sort((a, b) =>  a.orderNo -  b.orderNo);
    });
  }

  getBaseYearActive() {
    this.baseyearService.getActiveBaseYear().subscribe(res => {
      this.baseYearList = res;
    });
  }

  get f() {
    return this.inquiryData.controls;
  }

  onSubmit() {
    this.submitted = true;
    if (this.inquiryData.invalid) {
      return;
    } else {
      this.getListResultCommodity();
    }
  }

  exportExcelResult() {
    this.loading.show();
    this.commodityService.exportSopWeightCommodity(this.inquiryResultCommodityRequest.baseYear, this.inquiryResultCommodityRequest.year, this.inquiryResultCommodityRequest.month).subscribe((res) => {
        let mediaType = 'application/octet-stream';
        const blob = new Blob([res], {type: mediaType});
        console.log('blob', blob);
        FileSaver.saveAs(blob, 'view_result_weight' + new Date().toISOString() + '.xlsx');
        this.loading.hide();
      },
      (error) => {
        this.loading.hide();
        console.log(error);
      });
  }

  selecBaseYear(event) {
    this.inquiryData.controls['year'].setValue('');
    this.getListYearFromPriceData(event.value);
  }

}
