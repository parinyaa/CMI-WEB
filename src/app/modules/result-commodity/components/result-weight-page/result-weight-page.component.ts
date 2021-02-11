import { SessionServiceService } from './../../../../core/service/common/session-service.service';
import { ProvinceService } from './../../../../core/service/province/province.service';
import { startWith, map } from 'rxjs/operators';
import { Province } from './../../../keyin-data/model/neighborhoodResponse';
import { Observable } from 'rxjs';
import { Component, OnInit, ViewChild } from '@angular/core';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatTableDataSource, PageEvent, MatSort, MatDialog } from '@angular/material';
import { ViewRelative } from '../../model/view-relative';
import { DataToDialogExportResultCommodity, InquiryResultCommodityRequest } from '../../../../shared/models/result-commodity/request/InquiryResultCommodityRequest.model';
import { CommodityService } from '../../../../core/service/commodity/commodity.service';
import { ParamService } from '../../../../core/service/param/param.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseyearService } from '../../../../core/service/baseyear/baseyear.service';
import * as FileSaver from 'file-saver';
import { ViewWeight } from '../../model/view-weight';
import { registerLocaleData } from '@angular/common';
import localeTh from '@angular/common/locales/th';
import { YearTermRequestModel } from '../../model/YearTermRequestModel';
import { BaseYearResponseModel } from '../../model/BaseYearResponseModel';
import { Router } from '@angular/router';
import { PkgMigrateService } from 'src/app/core/service/pkgmigrate/pkg-migrate.service';
import { DialogExportResultCommodityComponent } from '../dialog-export-result-commodity/dialog-export-result-commodity.component';

@Component({
  selector: 'app-result-weight-page',
  templateUrl: './result-weight-page.component.html',
  styleUrls: ['./result-weight-page.component.scss'],
})
export class ResultWeightPageComponent implements OnInit {
  @ViewChild('errorSwal', { static: false }) errorSwal: SwalComponent;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  yearList = new Array();
  monthList = new Array();
  baseYearList = new Array();
  inquiryData: FormGroup;
  dataSource = new MatTableDataSource<ViewWeight>();
  length = 0;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100, 500, 1000];
  pageEvent: PageEvent = new PageEvent();

  showContent = false;
  noData = true;
  submitted = false;
  displayedColumns: string[] = [
    'result',
    'avgGmCurrentPrice',
    'avgGmRelative',
    'baseWeightValue',
    'prevWeightValue',
    'prevWeightProportion',
    'curWeightValue',
    'curWeightProportion',
    'prevIndexValue',
    'curIndexValue',
    'changeMom',
    'changeYoy',
    'changeAoa',
    'cMom',
    'cYoy',
    'cAoa',
  ];
  userProfile: any;
  filterProvinceControl = new FormControl();
  filterProvinceOptions: Observable<Province[]>;
  filterฺBaseYearControl = new FormControl();
  filterBaseYearOptions: Observable<BaseYearResponseModel[]>;
  provinceList = new Array<Province>();
  paramCpip: any;
  constructor(
    private inquiryResultCommodityRequest: InquiryResultCommodityRequest,
    private commodityService: CommodityService,
    private paramService: ParamService,
    private loading: NgxSpinnerService,
    private _FormBuild: FormBuilder,
    private baseyearService: BaseyearService,
    private provinceService: ProvinceService,
    private sessionService: SessionServiceService,
    private router: Router,
    private pkgMigrateService: PkgMigrateService,
    private dialog:MatDialog,
  ) {
    registerLocaleData(localeTh, 'th');
    this.dataSource.sort = this.sort;
  }

  ngOnInit() {
    this.userProfile = this.sessionService.getUserProfile();
    this.inquiryData = this._FormBuild.group({
      baseYear: ['', Validators.required],
      year: ['', Validators.required],
      month: ['', Validators.required],
      commodityCode:[''],

    });
    this.filterProvinceControl.setValidators(Validators.required);
    this.getBaseYearActive();
    this.getProvince();
    this.getParamMonth();
  }

  private _filterProvinceList(name: string): Province[] {
    const filterValue = name;

    return this.provinceList.filter((option) =>
     option.provinceCode.startsWith(filterValue) || option.provinceName.startsWith(filterValue),
    );
  }

  private _filterBaseYearList(baseYear: number): BaseYearResponseModel[] {
    const filterValue = baseYear;

    return this.baseYearList.filter((option) =>
      option.provinceName.startsWith(filterValue),
    );
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
          this.filterProvinceControl.setValue(province);
          // let provinceGetOne =
          //   this.provinceList.length > 0 ? this.provinceList[0] : null;
          // this.filterProvinceControl.setValue(
          //   province == null ? provinceGetOne : province,
          // );
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

  displayFilterProvince(province?: Province): string | undefined {
    return province ? province.provinceCode + ' ' +  province.provinceName : undefined;
  }

  displayFilterBaseYear(baseYear?: BaseYearResponseModel): number | undefined {
    return baseYear ? baseYear.baseYear : undefined;
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
    this.inquiryResultCommodityRequest.provinceId =
      this.filterProvinceControl && this.filterProvinceControl.value
        ? this.filterProvinceControl.value.provinceId
        : null;
    this.inquiryResultCommodityRequest.commodityCode = this.inquiryData.controls[
      'commodityCode'
    ].value;
    this.commodityService
      .inquiryWeight(this.inquiryResultCommodityRequest)
      .subscribe(
        (res) => {
          this.loading.hide();
          this.showContent = true;
          if (!res.length) {
            this.noData = true;
          } else {
            this.noData = false;
            this.dataSource = new MatTableDataSource<ViewWeight>(res);
          }
          this.dataSource.sort = this.sort;
        },
        (error) => {
          this.showContent = false;
          console.log(error.error.messageEn);
          this.errorSwal.title = error.error.messageEn;
          this.loading.hide();
        },
      );
  }

  getListYearFromPriceData(id) {
    this.paramCpip = this.paramService.getParamByGroupCodeAndInfoCode("INDEX_GROUP", "CPIP")
    let reqYearTerm = new YearTermRequestModel();
    reqYearTerm.baseYearId = id;
    reqYearTerm.indexGroupId = this.paramCpip.paramId;

    this.commodityService.inquiryYearTermWeight(reqYearTerm).subscribe((res) => {
      this.yearList = res;

      this.getYearMonth();
    });
  }

  getParamMonth() {
    this.paramService.getParamInfoByGroup('MONTH').subscribe((res) => {
      this.monthList = res.info;
      this.monthList = this.monthList.sort((a, b) => a.orderNo - b.orderNo);
    });
  }

  getBaseYearActive() {
    this.baseyearService.getActiveBaseYear().subscribe((res) => {
      this.baseYearList = res;
      console.log('this.baseYearList  ==== ', this.baseYearList);

      this.filterBaseYearOptions = this.filterฺBaseYearControl.valueChanges.pipe(
        startWith(''),
        map((baseYear) => {
          console.log(baseYear);
          return baseYear
            ? this._filterBaseYearList(baseYear)
            : this.baseYearList.slice();
        }),
      );

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
    this.commodityService
      .exportWeightCommodity(
        this.inquiryResultCommodityRequest.baseYear,
        this.inquiryResultCommodityRequest.year,
        this.inquiryResultCommodityRequest.month,
        provinceId,
      )
      .subscribe(
        (res) => {
          console.log(res);
          let mediaType = 'application/octet-stream';
          const blob = new Blob([res], { type: mediaType });
          console.log('blob', blob);
          FileSaver.saveAs(
            blob,
            'view_result_weight' + new Date().toISOString() + '.xlsx',
          );
          this.loading.hide();
        },
        (error) => {
          this.loading.hide();
          console.log(error);
        },
      );
  }

  dialogExportExcelResultWeight(): void {

    let dataInquiry = new DataToDialogExportResultCommodity();

    dataInquiry.baseYearId =  this.inquiryResultCommodityRequest.baseYear = this.inquiryData.controls['baseYear'].value;
    dataInquiry.year =  this.inquiryResultCommodityRequest.baseYear = this.inquiryData.controls['year'].value;
    dataInquiry.month =  this.inquiryResultCommodityRequest.baseYear = this.inquiryData.controls['month'].value;
    dataInquiry.commodityCode = this.inquiryResultCommodityRequest.baseYear = this.inquiryData.controls['commodityCode'].value;
    dataInquiry.provinceId =  this.filterProvinceControl && this.filterProvinceControl.value 
    ? this.filterProvinceControl.value.provinceId
    : 0;
    dataInquiry.type = 'weight';
    dataInquiry.title = '5.3 สอบถามข้อมูลน้ำหนัก CPIP';

      const dialogRef = this.dialog.open(DialogExportResultCommodityComponent, {
        maxWidth: '90vw',
        maxHeight:'75%',
        width: '800px',
        panelClass: 'custom-dialog-container',
        position:{
          top:'10%'
        }, data: {
          dataCerrentFrom: dataInquiry
        }
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if(result){
        }
      });
  }

  selecBaseYear(event) {
    // this.inquiryData.controls['year'].setValue('');
    this.getListYearFromPriceData(event.value);
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

  clickCommodityLevel(element) {
    console.log('element', element)
    let param = {
      element: {
        commodityCode: element.commodityCode,
        commodityName: element.commodityThName.trim()
      },
      request: {
        month: Number(this.inquiryResultCommodityRequest.month),
        year: this.inquiryResultCommodityRequest.year,
        provinceId: this.inquiryResultCommodityRequest.provinceId
      }
    }
    console.log('param', param);
    this.router.navigateByUrl('commodityvalidate', { state: { 'fromInquirePage': param } });
  }

  onSortData(event) {
    this.dataSource.sortingDataAccessor = (item, property) => {
      console.log(property);
      switch (property) {
        default:
          return item[property];
      }
    };
  }

}
