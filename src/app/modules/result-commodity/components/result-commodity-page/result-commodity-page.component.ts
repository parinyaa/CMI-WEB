import { SessionServiceService } from './../../../../core/service/common/session-service.service';
import { ProvinceService } from './../../../../core/service/province/province.service';
import { Observable } from 'rxjs';
import { Province } from './../../../keyin-data/model/neighborhoodResponse';
import { Component, OnInit, ViewChild } from '@angular/core';
import { DataToDialogExportResultCommodity, InquiryResultCommodityRequest } from 'src/app/shared/models/result-commodity/request/InquiryResultCommodityRequest.model';
import { CommodityService } from 'src/app/core/service/commodity/commodity.service';
import { ParamService } from 'src/app/core/service/param/param.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { PageEvent, MatTableDataSource, DateAdapter, MatSort, MatDialog } from '@angular/material';
import { BaseyearService } from 'src/app/core/service/baseyear/baseyear.service';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import * as FileSaver from 'file-saver';
import { ViewRelative } from '../../model/view-relative';
import { registerLocaleData } from '@angular/common';
import localeTh from '@angular/common/locales/th';
import { startWith, map } from 'rxjs/operators';
import { PkgMigrateService } from 'src/app/core/service/pkgmigrate/pkg-migrate.service';
import { DialogExportResultCommodityComponent } from '../dialog-export-result-commodity/dialog-export-result-commodity.component';
@Component({
  selector: 'app-result-commodity-page',
  templateUrl: './result-commodity-page.component.html',
  styleUrls: ['./result-commodity-page.component.scss'],
})
export class ResultCommodityPageComponent implements OnInit {
  @ViewChild('errorSwal', { static: false }) errorSwal: SwalComponent;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  yearList = new Array();
  monthList = new Array();
  baseYearList = new Array();
  inquiryData: FormGroup;
  dataSource = new MatTableDataSource<ViewRelative>();

  length = 0;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100, 500, 1000];
  pageEvent: PageEvent = new PageEvent();

  showContent = false;
  noData = true;
  submitted = false;

  displayedColumns: string[] = [
    'result',
    'noOfData',
    'minCurrentPrice',
    'maxCurrentPrice',
    'cvCurrentPrice',
    'avgArCurrentPrice',
    'avgArPreviousAdjustPrice',
    'avgArRelative',
    'avgGmCurrentPrice',
    'avgGmPreviousAdjustPrice',
    'avgGmRelative',
  ];
  userProfile: any;
  filterProvinceControl = new FormControl();
  filterProvinceOptions: Observable<Province[]>;
  provinceList = new Array<Province>();

  constructor(
    private inquiryResultCommodityRequest: InquiryResultCommodityRequest,
    private commodityService: CommodityService,
    private paramService: ParamService,
    private loading: NgxSpinnerService,
    private _FormBuild: FormBuilder,
    private baseyearService: BaseyearService,
    private provinceService: ProvinceService,
    private sessionService: SessionServiceService,
    private pkgMigrateService: PkgMigrateService,
    private dialog:MatDialog,
  ) {
    registerLocaleData(localeTh, 'th');
  }

  ngOnInit() {
    this.userProfile = this.sessionService.getUserProfile();
    this.inquiryData = this._FormBuild.group({
      baseYear: ['', Validators.required],
      year: ['', Validators.required],
      month: ['', Validators.required],
      commodityCode: [''],
    });
    this.getProvince();
    this.getParamMonth();
    this.getBaseYearActive();
  }

  getProvince() {
    this.loading.show();
    this.provinceService.getAllProvince().subscribe(
      (res) => {
        this.loading.hide();
        this.provinceList = res;
        if (this.userProfile.userTypeCode === 'PROVINCE_USER') {
          console.log('userProfile.provinceId', this.userProfile.provinceId);
          let province = this.provinceList.find(
            (x) => x.provinceId === this.userProfile.provinceId,
          );
          let provinceGetOne =
            this.provinceList.length > 0 ? this.provinceList[0] : null;
          this.filterProvinceControl.setValue(
            province == null ? provinceGetOne : province,
          );
        } else {
          let provinceGetOne = this.provinceList.find((x => x.provinceName === 'กรุงเทพมหานคร'));
          this.filterProvinceControl.setValue(provinceGetOne);
        }
        this.filterProvinceOptions = this.filterProvinceControl.valueChanges.pipe(
          startWith(''),
          map((value) => {
            console.log(value);
            return typeof value === 'string' ? value : value.provinceName;
          }),
          map((provinceName) => {
            console.log(provinceName);
            return provinceName
              ? this._filterProvinceList(provinceName)
              : this.provinceList.slice();
          }),
        );
      },
      (error) => {
        this.loading.hide();
      },
    );
  }
  private _filterProvinceList(name: string): Province[] {
    const filterValue = name;

    return this.provinceList.filter((option) =>
    option.provinceCode.startsWith(filterValue) || option.provinceName.startsWith(filterValue),
    );
  }

  getListResultCommodity() {
    this.loading.show();
    this.inquiryResultCommodityRequest.baseYear = this.inquiryData.controls[
      'baseYear'
    ].value;
    this.inquiryResultCommodityRequest.year = this.inquiryData.controls[
      'year'
    ].value;
    this.inquiryResultCommodityRequest.month = this.inquiryData.controls[
      'month'
    ].value;
    this.inquiryResultCommodityRequest.commodityCode = this.inquiryData.controls[
      'commodityCode'
    ].value;
    this.inquiryResultCommodityRequest.provinceId =
      this.filterProvinceControl && this.filterProvinceControl.value
        ? this.filterProvinceControl.value.provinceId
        : null;
    this.commodityService
      .inquiryRelative(this.inquiryResultCommodityRequest)
      .subscribe(
        (res) => {
          this.loading.hide();
          this.showContent = true;
          if (!res.length) {
            this.noData = true;
          } else {
            this.noData = false;
            this.dataSource = new MatTableDataSource<ViewRelative>(res);
            this.dataSource.sort = this.sort;
          }
        },
        (error) => {
          this.showContent = false;
          console.log(error.error.messageEn);
          this.errorSwal.title = error.error.messageEn;
          this.loading.hide();
        },
      );
  }

  displayFilterProvince(province?: Province): string | undefined {
    return province ?  province.provinceCode + ' ' +  province.provinceName: undefined;
  }

  getListYearFromPriceData(id) {
    this.commodityService.inquiryYearFromPriceDataById(id).subscribe((res) => {
      this.yearList = res;

      this.getYearMonth();
    });
  }

  getParamMonth() {
    this.paramService.getParamInfoByGroup('MONTH').subscribe((res) => {
      this.monthList = res.info;
      console.log(this.monthList);
      this.monthList = this.monthList.sort((a, b) => a.orderNo - b.orderNo);
    });
  }

  getBaseYearActive() {
    this.baseyearService.getActiveBaseYear().subscribe((res) => {
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
    let provinceId =
      this.filterProvinceControl && this.filterProvinceControl.value
        ? this.filterProvinceControl.value.provinceId
        : null;
        let commodityCode =  this.inquiryResultCommodityRequest.commodityCode = this.inquiryData.controls[
          'commodityCode'
        ].value;
        console.log('ss ===',commodityCode);
        
    this.commodityService
      .exportRelativeCommodity(
        this.inquiryResultCommodityRequest.baseYear,
        this.inquiryResultCommodityRequest.year,
        this.inquiryResultCommodityRequest.month,
        provinceId,
        commodityCode || commodityCode !== '' ?commodityCode : ''
        
      )
      .subscribe(
        (res) => {
          let mediaType = 'application/octet-stream';
          const blob = new Blob([res], { type: mediaType });
          console.log('blob', blob);
          FileSaver.saveAs(
            blob,
            'view_result_relative' + new Date().toISOString() + '.xlsx',
          );
          this.loading.hide();
        },
        (error) => {
          this.loading.hide();
          console.log(error);
        },
      );
  }


  dialogExportExcelResult(): void {
 
    let dataInquiry = new DataToDialogExportResultCommodity();

    dataInquiry.baseYearId =  this.inquiryResultCommodityRequest.baseYear = this.inquiryData.controls['baseYear'].value;
    dataInquiry.year =  this.inquiryResultCommodityRequest.baseYear = this.inquiryData.controls['year'].value;
    dataInquiry.month =  this.inquiryResultCommodityRequest.baseYear = this.inquiryData.controls['month'].value;
    dataInquiry.commodityCode = this.inquiryResultCommodityRequest.baseYear = this.inquiryData.controls['commodityCode'].value;
    dataInquiry.provinceId =  this.filterProvinceControl && this.filterProvinceControl.value 
    ? this.filterProvinceControl.value.provinceId
    : 0;
    dataInquiry.type = 'relative';
    dataInquiry.title = '5.2 รายงานราคาเฉลี่ย';

      const dialogRef = this.dialog.open(DialogExportResultCommodityComponent, {
        maxWidth: '90vw',
        maxHeight:'75%',
        width: '800px',
        panelClass: 'custom-dialog-container',
        position:{
          top:'10%'
        },
        data: {
          dataCerrentFrom: dataInquiry
        }
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if(result){
        }
      });
  }
  selecBaseYear(event) {
    // this.getYearMonth();
    // this.inquiryData.controls['year'].setValue('');
    this.getListYearFromPriceData(event.value);
  }

  onSortData(event) {
    this.dataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        // case 'noOfData': {
        //   return item['noOfData'];
        // }
        // case 'minCurrentPrice': {
        //   return item['minCurrentPrice'];
        // }
        // case 'maxCurrentPrice': {
        //   return item['maxCurrentPrice'];
        // }
        // case 'cvCurrentPrice': {
        //   return item['cvCurrentPrice'];
        // }
        // case 'avgArCurrentPrice': {
        //   return item['baseIndexValue'];
        // }
        // case 'avgArPreviousAdjustPrice': {
        //   return item['changeBaseMom'];
        // }
        // case 'avgArRelative': {
        //   return item['changeBaseYoy'];
        // }
        // case 'avgGmCurrentPrice': {
        //   return item['changeBaseAoa'];
        // }
        // case 'avgGmPreviousAdjustPrice': {
        //   return item['changeBaseAoa'];
        // }
        // case 'avgGmRelative': {
        //   return item['changeBaseAoa'];
        // }
        default:
          return item[property];
      }
    };
  }

  getYearMonth() {
    this.pkgMigrateService.getYearMonth().subscribe(
      (res) => {
        let resMonth = String(res.month);
        let month = this.monthList.find((x) => x.paramInfo === resMonth);
        console.log('month ==== ',month);
        this.inquiryData.controls['month'].setValue(month.paramInfo);
        let year = this.yearList.find((x) => x === (res.year < 2560 ? res.year +543:res.year));
          console.log('year ==== ',year);
          this.inquiryData.controls['year'].setValue(year);
      },
      (error) => { },
    );
  }
}
