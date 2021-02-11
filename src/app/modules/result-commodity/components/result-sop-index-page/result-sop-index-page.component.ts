import {Component, OnInit, ViewChild} from '@angular/core';
import {SwalComponent} from '@sweetalert2/ngx-sweetalert2';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatTableDataSource, PageEvent} from '@angular/material';
import {ViewIndex} from '../../model/view-index';
import {InquiryResultCommodityRequest} from '../../../../shared/models/result-commodity/request/InquiryResultCommodityRequest.model';
import {CommodityService} from '../../../../core/service/commodity/commodity.service';
import {ParamService} from '../../../../core/service/param/param.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {BaseyearService} from '../../../../core/service/baseyear/baseyear.service';
import FileSaver from 'file-saver';

@Component({
  selector: 'app-result-sop-index-page',
  templateUrl: './result-sop-index-page.component.html',
  styleUrls: ['./result-sop-index-page.component.scss']
})
export class ResultSopIndexPageComponent implements OnInit {

  @ViewChild('errorSwal', {static: false}) errorSwal: SwalComponent;

  yearList = new Array();
  monthList = new Array();
  baseYearList = new Array();
  inquiryData: FormGroup;
  dataSource = new MatTableDataSource<ViewIndex>();

  length = 0;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100, 500, 1000];
  pageEvent: PageEvent = new PageEvent;

  showContent = false;
  noData = true;
  submitted = false;

  displayedColumns: string[] = ['result', 'index', 'mom', 'aoa', 'yoy', 'baseIndex', 'baseMom', 'baseAoa', 'baseYoy'];


  constructor(
    private inquiryResultCommodityRequest: InquiryResultCommodityRequest,
    private commodityService: CommodityService,
    private paramService: ParamService,
    private loading: NgxSpinnerService,
    private _FormBuild: FormBuilder,
    private baseyearService: BaseyearService
  ) {
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
    this.commodityService.inquirySopIndex(this.inquiryResultCommodityRequest).subscribe((res) => {
        this.loading.hide();
        this.showContent = true;
        if (!res.length) {
          this.noData = true;
        } else {
          this.noData = false;
          this.dataSource = new MatTableDataSource<ViewIndex>(res);
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
    this.commodityService.exportSopIndexCommodity(this.inquiryResultCommodityRequest.baseYear
      , this.inquiryResultCommodityRequest.year
      , this.inquiryResultCommodityRequest.month).subscribe((res) => {
        const mediaType = 'application/octet-stream';
        const blob = new Blob([res], {type: mediaType});
        console.log('blob', blob);
        FileSaver.saveAs(blob, 'view_result_index' + new Date().toISOString() + '.xlsx');
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
