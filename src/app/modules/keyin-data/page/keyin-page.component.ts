import {CalendarService} from './../../../core/service/calendar/calendar.service';
import localeTh from '@angular/common/locales/th';
import {DisableKeyIn} from './../../../shared/models/dataenty/request/DisableKeyIn';
import {WorkFlowEntyRequest} from './../../../shared/models/dataenty/request/WorkFlowRequest';
import {CurrencyService} from 'src/app/core/service/currency/currency.service';
import {ListGroupCpipRequest} from './../../commodity-validate/models/inbox-details';
import {AveragePercentageComponent} from './../component/average-percentage/average-percentage.component';
import {ParamGroup} from './../../../shared/common/GetParam';
import {DialogCommentComponent} from './../component/dialog-comment/dialog-comment.component';
import {DialogCheckpriceComponent} from './../component/dialog-checkprice/dialog-checkprice.component';
import {SwalComponent} from '@sweetalert2/ngx-sweetalert2';
import {NeighborhoodDialogComponent} from '../component/neighborhood-dialog/neighborhood-dialog.component';
import {ParamService} from '../../../core/service/param/param.service';
import {FormBuilder, FormControl} from '@angular/forms';
import {
  Component,
  OnInit,
  ViewChild,
  EventEmitter,
  Output,
} from '@angular/core';
import {
  MatTableDataSource,
  MatSort,
  MatDialog,
  PageEvent,
  MatPaginator,
} from '@angular/material';
import {NgxSpinnerService} from 'ngx-spinner';
import {DataEntyService} from 'src/app/core/service/dataenty/dataenty.service';
import {PricedataService} from 'src/app/core/service/pricedata/pricedata.service';
import {
  PriceData,
  GroupList,
} from '../../../shared/models/dataenty/request/PriceData';
import {PriceDataList} from '../../../shared/models/dataenty/request/PricDataList';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {SessionServiceService} from '../../../core/service/common/session-service.service';
import {ProvinceService} from '../../../core/service/province/province.service';
import {Province} from '../../../shared/models/dataenty/request/Province';
import {PriceDataRequestForm} from '../../../shared/models/dataenty/request/PriceDataRequestForm';
import {SharedserviceService} from '../component-service/sharedservice.service';
import {registerLocaleData} from '@angular/common';
import {PeriodCurrent} from '../../commodity-validate/models/relative-request';
import {GetCalendar} from 'src/app/shared/models/calendar/GetCalendar';
import {PkgMigrateService} from 'src/app/core/service/pkgmigrate/pkg-migrate.service';

@Component({
  selector: 'app-keyin-page',
  templateUrl: './keyin-page.component.html',
  styleUrls: ['./keyin-page.component.scss'],
})
export class KeyinPageComponent implements OnInit {
  @Output() onSearch = new EventEmitter<any>();
  @Output() changeTabEvent = new EventEmitter<any>();
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild('sucesssaveDataSwal', {static: false})
  sucesssaveDataSwal: SwalComponent;
  @ViewChild('alertDataSwal', {static: false}) alertDataSwal: SwalComponent;
  @ViewChild('alertCurrencySwal', {static: false})
  alertCurrencySwal: SwalComponent;
  @ViewChild('saveDataSwal', {static: false}) saveDataSwal: SwalComponent;
  @ViewChild('paginator', {static: false}) paginator: MatPaginator;
  displayedColumns: string[] = [
    'productCode',
    'surveyName',
    'pricePrevious',
    'price1',
    'price2',
    'price3',
    'price4',
    'currentPrice',
    'priceRel',
    'productStatus',
    'action',
  ];
  currencyCode = 'THB';
  checkProvinceId = false;
  editableRelationStatus = 'NEW';
  dataSource = new MatTableDataSource();
  monthList = new Array();
  month = [];
  year: number[] = [];
  type = ParamGroup.userType;
  monthlyData: any;
  provinceId: number;
  imputationList = new Array();
  linkFlag: any;
  currencyUnitList = new Array();
  selectedLink = 0;
  typeUser = 1;
  yearNow: number;
  monthNow: number;
  length = 100;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  pageEvent: PageEvent = new PageEvent();
  frequencyList = new Array();
  parentId: number;
  frequencyType: string;
  labelPrice1: string;
  labelPrice2: string;
  labelPrice3: string;
  labelPrice4: string;
  displayPrice1: boolean;
  displayPrice2: boolean;
  displayPrice3: boolean;
  displayPrice4: boolean;
  displayCurrentPrice: boolean;
  disablePrice1: boolean;
  disablePrice2: boolean;
  disablePrice3: boolean;
  disablePrice4: boolean;
  disableKeyIn = new DisableKeyIn();
  showButtonToTop = false;
  FilterInboxFrequency: number;
  FilterInboxCommodityName: string;
  FilterInboxCommodityCode: string;
  FilterInboxSurvey: string;
  parentCommodityCode = '';
  parentCommodityThName = '';
  provinceList: Array<Province>;
  filterProvinceOptions: Observable<Province[]>;
  filterProvinceControl = new FormControl();
  filterMonthOptions: Observable<any[]>;
  filterMonthControl = new FormControl();
  filterYearOptions: Observable<number[]>;
  filterYearControl = new FormControl();
  filterProductCode: string;
  filterProductName: string;
  filterSurveyName: string;
  measureUnit = new Array();
  priceDataRequestForm: PriceDataRequestForm = new PriceDataRequestForm();
  validataPriceBeforeSave = new Array();
  priceDataList: PriceDataList;
  disableInput = false;
  currentMonth: number;
  monthSelect: number;
  getIsSaved = false;
  currencyList = new Array();
  workFlowList = new Array();
  arrayIndexRemoveDuration = new Array();
  priceDataByFrequency = new PriceDataRequestForm();
  currentPeriod = new PeriodCurrent();
  groupList = new Array<GroupList>();
  groupCurrent: GroupList;
  listGroupCpipRequest = new ListGroupCpipRequest();
  groupAll: GroupList[] = [{groupCode: null, groupName: 'ทั้งหมด'}];
  yearDefault = null;
  monthDefault = null;
  constructor(
    private loading: NgxSpinnerService,
    private dataentyService: DataEntyService,
    private paramService: ParamService,
    private dialog: MatDialog,
    private pricedataService: PricedataService,
    public sessionService: SessionServiceService,
    private provinceService: ProvinceService,
    public sharedService: SharedserviceService,
    public currencyService: CurrencyService,
    private calendarService: CalendarService,
    private pkgMigrateService: PkgMigrateService,
  ) {
    registerLocaleData(localeTh, 'th');
  }

  ngOnInit() {
    this.getCurrentPeriod();
    this.getYearMonth();
    if (
      JSON.parse(sessionStorage.getItem('userProfile')).provinceId == null &&
      JSON.parse(sessionStorage.getItem('userProfile')).surveyId == null
    ) {
      this.typeUser = 2;
    }
    this.preparePage();
  }

  preparePage() {
    this.loading.show();
    this.sessionService.setIsSaved(true);
    this.getIsSaved = this.sessionService.getIsSaved();
    if (this.paginator) {
      this.paginator.firstPage();
      this.paginator.pageSize = this.pageSize;
    }
    this.pageEvent = new PageEvent();
    this.pageEvent.pageIndex = 0;
    this.pageEvent.pageSize = this.pageSize;
    this.pageEvent.length = this.length;
    const keyinParam = this.sessionService.getKeyinParam();
    this.frequencyType = keyinParam.frequency;
    this.filterProductName = '';
    this.filterProductCode = '';
    this.filterSurveyName = '';
    this.groupCurrent = null;
    const userProfile = this.sessionService.getUserProfile();
    if (this.frequencyType === 'WEEKLY') {
      this.labelPrice1 = 'ราคาสัปดาห์ที่ 1';
      this.labelPrice2 = 'ราคาสัปดาห์ที่ 2';
      this.labelPrice3 = 'ราคาสัปดาห์ที่ 3';
      this.labelPrice4 = 'ราคาสัปดาห์ที่ 4';
      this.displayPrice1 = true;
      this.displayPrice2 = true;
      this.displayPrice3 = true;
      this.displayPrice4 = true;
      this.displayCurrentPrice = true;
    } else if (this.frequencyType === 'MONTHLY') {
      this.labelPrice1 = 'ราคาปัจจุบัน';
      this.displayPrice1 = true;
      this.displayPrice2 = false;
      this.displayPrice3 = false;
      this.displayPrice4 = false;
      this.displayCurrentPrice = false;
    }
    this.listGroupCpipRequest = new ListGroupCpipRequest();
    this.listGroupCpipRequest.frequency = this.frequencyType;
    this.getProvince().subscribe(
      async (resp) => {
        this.provinceList = resp;
        if (
          userProfile.provinceId != null &&
          userProfile.userTypeCode === 'PROVINCE_USER'
        ) {
          this.checkProvinceId = true;
          this.filterProvinceControl.setValue(
            this.provinceList.find(
              (x) => x.provinceId === userProfile.provinceId,
            ),
          );
        } else {
          const migratePrice = this.sessionService.getKeyMigratePrice();
          if (migratePrice && migratePrice.provinceId) {
            this.filterProvinceControl.setValue(
              this.filterProvinceControl.value
                ? this.filterProvinceControl.value
                : this.provinceList.find(
                    (x) => x.provinceId === migratePrice.provinceId,
                  ),
            );
            sessionStorage.removeItem('migratePrice');
          } else {
            this.filterProvinceControl.setValue(
              this.filterProvinceControl.value
                ? this.filterProvinceControl.value
                : this.provinceList.find((x) => x.provinceId === 1),
            );
          }
        }
        this.priceDataRequestForm = new PriceDataRequestForm();
        this.provinceId = this.filterProvinceControl.value
          ? this.filterProvinceControl.value.provinceId
          : null;
        this.priceDataRequestForm.frequency = this.frequencyType;
        this.priceDataRequestForm.parentId = this.parentId;
        this.paramService.getParamsGroupAll().subscribe((res) => {
          const rx = this.getParams();
          rx.then(() => {
            // this.getWorkFlow();
            this.inputCheckCalendar();

            this.monthList.forEach((element) => {
              let obj = {
                name: element.paramLocalMessage,
                value: element.paramInfo - 1,
              };
              if (this.month.length < 12) {
                this.month.push(obj);
              }
            });
          });
          this.filterProvinceOptions = this.filterProvinceControl.valueChanges.pipe(
            startWith(''),
            map((value) => {
              console.log(value);
              return typeof value === 'string' ? value : value.provinceName;
            }),
            map((provinceName) => {
              return provinceName
                ? this._filterProvinceList(provinceName)
                : this.provinceList.slice();
            }),
          );
          this.filterMonthOptions = this.filterMonthControl.valueChanges.pipe(
            startWith(''),
            map((value) => {
              return typeof value === 'string' ? value : value.name;
            }),
            map((monthName) => {
              return monthName
                ? this._filterMonthList(monthName)
                : this.month.slice();
            }),
          );

          this.pricedataService.getYearTermList().subscribe(
            async (r) => {
              this.year = r;
              const todayDate = new Date();
              const thisMonth = this.currentPeriod
                ? this.currentPeriod.month
                : todayDate.getMonth();

              //  โมใหม่
              this.currentMonth = thisMonth;
              this.monthNow = thisMonth - 1;
              const monthDefault = thisMonth - 1;
              this.monthSelect = monthDefault === 0 ? 11 : monthDefault;
              const yearmonth = await this.getYearMonth();
              this.yearDefault = yearmonth.year;
              this.monthDefault = yearmonth.month;
              this.filterMonthControl.setValue(
                this.month.find((x) => x.value === this.monthDefault - 1),
              );
              this.listGroupCpipRequest.monthTerm =
                this.filterMonthControl && this.filterMonthControl.value
                  ? this.filterMonthControl.value.value
                  : null;

              const thisYear = this.currentPeriod
                ? this.currentPeriod.year
                : todayDate.getFullYear();
              this.yearNow = thisYear;
              this.filterYearControl.setValue(
                this.year.find((x) => x === this.yearDefault),
              );
              this.listGroupCpipRequest.yearTerm = this.filterYearControl.value;
              this.inquireGroupList(null);
              this.setRequestForm();
              this.getCurrentPriceData(
                this.priceDataRequestForm,
                this.pageEvent,
              );

              this.filterYearOptions = this.filterYearControl.valueChanges.pipe(
                startWith(''),
                map((value) => {
                  console.log(value);
                  return typeof value === 'string' ? value : value;
                }),
                map((v) => {
                  console.log(v);
                  return v ? this._filterYearList(v) : this.year.slice();
                }),
              );
            },
            (er) => {
              console.log(er);
            },
          );
        });
      },
      (error) => {
        this.loading.hide();
        console.log(error);
      },
    );
  }

  setRequestForm() {
    if (this.monthSelect != null) {
      this.priceDataRequestForm.monthTerm = this.monthSelect;
    }
    if (this.filterYearControl.value != null) {
      this.priceDataRequestForm.yearTerm = this.filterYearControl.value;
    }
    if (this.filterProvinceControl.value != null) {
      this.priceDataRequestForm.provinceId = this.filterProvinceControl.value.provinceId;
    }
    this.priceDataRequestForm.productCode = this.filterProductCode;
    this.priceDataRequestForm.productName = this.filterProductName;
    this.priceDataRequestForm.surveyName = this.filterSurveyName;
  }

  filterData() {
    let request = new GetCalendar();
    request.month = this.monthSelect;
    request.year = this.filterYearControl.value;
    request.yearId = this.currentPeriod.yearId;
    this.onSearch.emit(request);
    this.provinceId = this.filterProvinceControl.value
      ? this.filterProvinceControl.value.provinceId
      : null;
    this.FilterInboxCommodityName = '';
    this.FilterInboxSurvey = '';
    // this.getWorkFlow();
    const rx = this.doCheckSavedProcess();
    rx.then(
      (x) => {
        if (x) {
          console.log('filterData');
          console.log('filterProvinceControl', this.filterProvinceControl);
          console.log('filterMonthControl', this.monthSelect);
          console.log('filterYearControl', this.filterYearControl);
          console.log('filterProductCode', this.filterProductCode);
          console.log('filterProductName', this.filterProductName);
          console.log('filterSourceName', this.filterSurveyName);
          this.setRequestForm();
          this.getCurrentPriceData(this.priceDataRequestForm, this.pageEvent);
        }
      },
      (error) => {
        console.log(error);
      },
    );
  }

  private setToggleImputation(paramCode) {
    let result = false;
    if (paramCode === '0') {
      result = false;
    } else if (paramCode === '1') {
      result = true;
    } else if (paramCode === '2') {
      result = true;
    } else if (paramCode === '3') {
      result = false;
    }

    return result;
  }

  setToggleCurrentPrice(paramCode: string) {
    let result = true;
    if (paramCode === '0') {
      result = false;
    } else if (paramCode === '3') {
      result = false;
    }
    return result;
  }

  private setTogglePrevPrice(paramCode) {
    let result = true;
    if (paramCode === '3') {
      result = false;
    }
    return result;
  }

  getCurrentPriceData(requestForm: PriceDataRequestForm, pageEvent: PageEvent) {
    this.loading.show();
    if (
      requestForm.monthTerm === this.monthNow - 1 ||
      requestForm.yearTerm === this.yearNow
    ) {
      this.disableInput = false;
    } else {
      this.disableInput = true;
    }
    if (
      this.FilterInboxCommodityName != '' &&
      this.FilterInboxSurvey != '' &&
      this.FilterInboxCommodityCode
    ) {
      requestForm.productName = this.FilterInboxCommodityName;
      requestForm.surveyName = this.FilterInboxSurvey;
      requestForm.productCode = this.FilterInboxCommodityCode;
    }
    requestForm.groupCode = this.groupCurrent
      ? this.groupCurrent.groupCode
      : null;
    console.log('requestForm', requestForm);
    this.priceDataByFrequency.monthTerm = requestForm.monthTerm + 1;
    this.priceDataByFrequency.yearTerm = requestForm.yearTerm;
    this.priceDataByFrequency.frequency = requestForm.frequency;
    this.priceDataByFrequency.groupCode = requestForm.groupCode;
    this.sessionService.setPriceDataByFrequency(this.priceDataByFrequency);
    this.pricedataService
      .getCurrentPriceData(requestForm, pageEvent.pageIndex, pageEvent.pageSize)
      .subscribe(
        (res) => {
          this.loading.hide();
          console.log(res);
          this.monthlyData = res.content;
          if (this.monthlyData.length >= 5) {
            this.showButtonToTop = true;
          }
          this.monthlyData.forEach((element) => {
            element.toggles = {};
            let link = this.linkFlag.find((x) => x.paramId == element.link);
            element.toggles.imputationFlag = this.setToggleImputation(
              link ? link.paramInfo : null,
            );
            element.toggles.currentPriceFlag = this.setToggleCurrentPrice(
              link ? link.paramInfo : null,
            );
            element.toggles.prevPriceFlag = this.setTogglePrevPrice(
              link ? link.paramInfo : null,
            );
            element.toggles.fakeImputation = element.imputationFlag;
            element.notSavePrice = false;
            if (element.imputationFlag != null) {
              element.toggles.imputationFlag = true;
            }
            if (null == element.imputationFlag) {
              const x = null;
              element.imputationFlag = x;
            }
            if (element.currentPrice == element.currentAdjustedPrice) {
              element.priceAdjust = true;
            } else {
              element.priceAdjust = false;
            }
          });
          this.dataSource = new MatTableDataSource(this.monthlyData);
          this.dataSource.sort = this.sort;
          this.length = res.totalRecords;
          this.pageEvent.length = res.totalRecords;
          console.log(res);
        },
        (error) => {
          console.log(error);
          this.loading.hide();
        },
      );
  }

  pageChange(e: PageEvent): PageEvent {
    console.log(e);
    this.priceDataRequestForm.parentId = this.parentId;
    this.priceDataRequestForm.frequency = this.frequencyType;
    this.getCurrentPriceData(this.priceDataRequestForm, e);
    return e;
  }

  getProvince(): Observable<Province[]> {
    return this.provinceService.getAllProvince();
  }

  getParams() {
    this.imputationList = this.paramService.getParamByGroup(
      ParamGroup.imputation,
    );
    this.imputationList.forEach((element) => {
      element.use = false;
      let x = this.sessionService.checkProfileIsContainObject(
        element.paramInfo,
      );
      if (x) {
        element.use = true;
      }
      console.log(element, x);
    });
    this.currencyUnitList = this.paramService.getParamByGroup(
      ParamGroup.currencyUnit,
    );
    this.linkFlag = this.paramService
      .getParamByGroup(ParamGroup.link)
      .sort((a, b) => a.orderNo - b.orderNo);
    this.measureUnit = this.paramService.getParamByGroup(
      ParamGroup.measureUnit,
    );
    this.frequencyList = this.paramService.getParamByGroup(
      ParamGroup.frequenct,
    );
    this.monthList = this.paramService
      .getParamByGroup(ParamGroup.month)
      .sort((a, b) => a.orderNo - b.orderNo);
    if (this.monthList) {
      return new Promise((resolve, reject) => {
        resolve(true);
      });
    }
  }

  private openNeighborhoodDialog(data): void {
    const obj = {
      cpaParentId: data.cpaId,
      baseYearId: data.baseYearId,
      yearTerm: data.yearTerm,
      monthTerm: data.monthTerm,
      dataMatrixId: data.dataMatrixId,
    };
    console.log('obj', obj);
    const dialogRef = this.dialog.open(NeighborhoodDialogComponent, {
      width: '700px',
      position: {
        top: '10%',
      },
      data: obj,
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog openNeighborhoodDialog was closed');
      if (result) {
        console.log('set selected price to currentPrice');
        if (this.frequencyType === 'WEEKLY') {
          data.price1 = result;
          data.price2 = result;
          data.price3 = result;
          data.price4 = result;
          data.currentAdjustedPrice = result;
        } else if (this.frequencyType === 'MONTHLY') {
          data.price1 = result;
          data.currentAdjustedPrice = result;
        }
        this.calculateRel(data);
        data.toggles.imputationFlag = true;
      } else {
        data.imputationFlag = null;
        data.toggles.imputationFlag = false;
      }
    });
  }

  private openAveragePercentageDialog(data): void {
    let imputationPrevious = data.imputationFlag;
    const obj = {
      cpaParentId: data.cpaId,
      baseYearId: data.baseYearId,
      yearTerm: data.yearTerm,
      monthTerm: data.monthTerm,
      dataMatrixId: data.dataMatrixId,
    };

    const dialogRef = this.dialog.open(AveragePercentageComponent, {
      width: '700px',
      position: {
        top: '10%',
      },
      data: obj,
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog openAveragePercentageDialog was closed');
      console.log(result);
      console.log(dialogRef);
      if (result) {
        let priceAvg = (result * data.previousAdjustedPrice) / 100;
        data.relativeRatio = result;
        if (this.frequencyType === 'WEEKLY') {
          data.price1 = priceAvg;
          data.price2 = priceAvg;
          data.price3 = priceAvg;
          data.price4 = priceAvg;
          data.currentAdjustedPrice = priceAvg;
        } else if (this.frequencyType === 'MONTHLY') {
          data.price1 = priceAvg;
          data.currentAdjustedPrice = priceAvg;
        }
        this.calculateRel(data);
        data.toggles.imputationFlag = true;
      } else {
        data.imputationFlag = null;
        data.toggles.imputationFlag = false;
      }
    });
  }

  onChangeLink(event, data) {
    console.log(event);
    data.link = event.value;
    console.log(this.linkFlag);
    let link = this.linkFlag.find((x) => x.paramId === event.value);

    if (link.paramInfo === '0') {
      console.log(link);
      data.previousAdjustedPrice = data.previousPrice;
    }
    if (link.paramInfo === '1' || link.paramInfo === '2') {
      console.log(link);
      if (this.frequencyType === 'WEEKLY') {
        data.previousAdjustedPrice = data.previousPrice;
        data.currentPrice = data.previousAdjustedPrice;
        data.price1 = data.currentPrice;
      } else if (this.frequencyType === 'MONTHLY') {
        data.previousAdjustedPrice = data.previousPrice;
        data.price1 = data.previousAdjustedPrice;
      }
    }
    this.calculateRel(data);
  }

  calculateRel(data) {
    let currentPrice = null;
    if (this.frequencyType === 'WEEKLY') {
      const loader = [];
      const p1 = null != data.price1 ? data.price1 : 0;
      const p2 = null != data.price2 ? data.price2 : 0;
      const p3 = null != data.price3 ? data.price3 : 0;
      const p4 = null != data.price4 ? data.price4 : 0;
      if (p1 > 0 && p1 !== null) {
        data.price1 = +data.price1;
        loader.push(data.price1);
      }
      if (p2 > 0 && p2 !== null) {
        data.price2 = +data.price2;
        loader.push(data.price2);
      }
      if (p3 > 0 && p3 !== null) {
        data.price3 = +data.price3;
        loader.push(data.price3);
      }
      if (p4 > 0 && p4 !== null) {
        data.price4 = +data.price4;
        loader.push(data.price4);
      }
      loader.forEach((x) => {
        currentPrice = currentPrice + x;
      });
      currentPrice = currentPrice / loader.length;
    } else if (this.frequencyType === 'MONTHLY') {
      currentPrice = data.price1;
    }
    data.currentPrice = currentPrice;
    data.currentCalculatedPrice = currentPrice;
    const prevPrice = data.previousCalculatedPrice
      ? data.previousCalculatedPrice
      : null;
    const currentPriceResult = data.currentCalculatedPrice
      ? data.currentCalculatedPrice
      : null;
    if (prevPrice != null && currentPriceResult != null) {
      const rel = (currentPriceResult / prevPrice) * 100;
      const resultRel = rel.toFixed(5);
      data.rel = resultRel;
    } else {
      data.rel = null;
    }
    console.log('data.currentCalculatedPrice', data.currentCalculatedPrice);
    console.log('data.previousCalculatedPrice', data.previousCalculatedPrice);
    console.log('resultRel', data.rel);
  }

  public onCheckPriceDataEnty() {
    this.loading.show();
    this.priceDataList = new PriceDataList();
    let currencyFlag = true;
    let validatePrice = {
      currentPriceIsNull: [],
      cfLimit: [],
      percentChange: [],
      rel: [],
      errorFlag: false,
    };
    this.monthlyData.forEach((element) => {
      const priceData: PriceData = new PriceData();
      priceData.baseYearId = element.baseYearId;
      priceData.monthTerm = element.monthTerm;
      priceData.answerCommentFlag = element.answerCommentFlag;
      priceData.yearTerm = element.yearTerm;
      priceData.dataMatrixId = element.dataMatrixId;
      priceData.previousCalculatedPrice = element.previousCalculatedPrice;
      priceData.commentNote = element.commentNote;
      priceData.currencyRate = element.currencyRate;
      priceData.currencyUnit = element.currencyUnit;
      priceData.link = element.link;
      priceData.priceFlag = element.priceFlag;
      let link = this.linkFlag.find((x) => x.paramId === element.link);
      if (link) {
        if (link.paramInfo === '0' || link.paramInfo === '3') {
          if (this.frequencyType === 'WEEKLY') {
            let havePrice = 0;
            let price = 0;
            if (element.price1 != null) {
              havePrice = havePrice + 1;
              price = element.price1;
            }
            if (element.price2 != null) {
              havePrice = havePrice + 1;
              price = price + element.price2;
            }
            if (element.price3 != null) {
              havePrice = havePrice + 1;
              price = price + element.price3;
            }
            if (element.price4 != null) {
              havePrice = havePrice + 1;
              price = price + element.price4;
            }
            priceData.currentPrice = price / havePrice;
            console.log(price, havePrice, priceData.currentPrice);
          } else if (this.frequencyType === 'MONTHLY') {
            priceData.currentPrice = +element.price1;
          }
        } else {
          priceData.currentPrice = element.currentPrice;
        }
      }
      if (null == element.imputationFlag) {
        priceData.imputationFlag = null;
      } else {
        priceData.imputationFlag = element.imputationFlag;
      }
      priceData.currentAdjustedPrice = priceData.currentPrice;
      priceData.currentCalculatedPrice = priceData.currentAdjustedPrice;
      priceData.noOfCarrierForward = element.noOfCarrierForward;
      priceData.previousAdjustedPrice = element.previousAdjustedPrice;
      priceData.previousPrice = element.previousPrice;
      priceData.relativeRatio = element.relativeRatio;
      priceData.rel = element.rel ? element.rel : null;
      priceData.remark = element.remark;
      priceData.requestCommentFlag = element.requestCommentFlag;
      priceData.usedFlag = element.usedFlag;
      priceData.price1 = element.price1;
      priceData.price2 = element.price2;
      priceData.price3 = element.price3;
      priceData.price4 = element.price4;
      if (priceData.remark == '' || priceData.remark == null) {
        /// case currentPrice
        if (
          priceData.currentPrice == null ||
          priceData.currentPrice == 0 ||
          isNaN(priceData.currentPrice)
        ) {
          validatePrice.currentPriceIsNull.push(element);
          validatePrice.errorFlag = true;
          element.notSavePrice = true;
        } else {
          element.notSavePrice = false;
        }
        /// case noOfCarrierForward
        const cf = this.imputationList.find(
          (x) => x.paramId == priceData.imputationFlag,
        );
        if (cf) {
          if (
            cf.paramInfo == 'CARRIER_FORWARD' &&
            cf.paramId != element.toggles.fakeImputation
          ) {
            const noOfCarrierForward = priceData.noOfCarrierForward + 1;
            if (
              noOfCarrierForward >= element.noOfCarrierForwardLimit &&
              element.noOfCarrierForwardLimit != null
            ) {
              let obj = {
                data: element,
                value: noOfCarrierForward,
                valueDefault: element.noOfCarrierForwardLimit,
              };
              validatePrice.cfLimit.push(obj);
              validatePrice.errorFlag = true;
              element.notSavePrice = true;
            }
          }
        }
        /// case percentChage
        if (
          priceData.currentAdjustedPrice > 0 &&
          priceData.previousAdjustedPrice > 0
        ) {
          const currentAdjustedPrice = priceData.currentAdjustedPrice;
          const previousAdjustedPrice = priceData.previousAdjustedPrice;
          console.log(
            priceData.currentAdjustedPrice,
            previousAdjustedPrice,
            (currentAdjustedPrice - previousAdjustedPrice) /
              previousAdjustedPrice,
          );
          const percentChange =
            (currentAdjustedPrice - previousAdjustedPrice) /
            previousAdjustedPrice;
          const cal = percentChange * 100;
          let result = +cal.toFixed(2);
          if (result < 0) {
            result = result * -1;
          }
          if (
            result >= element.percentChange &&
            element.percentChange != null
          ) {
            let obj = {
              data: element,
              value: result,
              valueDefault: element.percentChange,
            };
            validatePrice.percentChange.push(obj);
            validatePrice.errorFlag = true;
            element.notSavePrice = true;
          }
        }
        /// case rel != 100
        if (priceData.rel != 100) {
          let obj = {data: element, value: priceData.rel, valueDefault: 100};
          validatePrice.rel.push(obj);
          validatePrice.errorFlag = true;
          element.notSavePrice = true;
        }
      } else {
        element.notSavePrice = false;
      }
      this.priceDataList.priceDataList.push(priceData);
    });
    if (!currencyFlag) {
      this.loading.hide();
      this.alertCurrencySwal.show().then((result) => {
        console.log(result);
        if (!result.value) {
          return;
        } else {
          if (validatePrice.errorFlag) {
            this.loading.hide();
            this.openCheckPrice(validatePrice);
          } else {
            this.loading.hide();
          }
        }
      });
    } else {
      if (validatePrice.errorFlag) {
        this.loading.hide();
        this.openCheckPrice(validatePrice);
        console.log(this.monthlyData);
      } else {
        this.loading.hide();
      }
    }
  }

  clickSave() {
    this.saveDataSwal.show();
  }

  onSaveShared() {
    this.sharedService.onCheckPriceDataEnty();
  }

  openCheckPrice(data): void {
    const dialogRef = this.dialog.open(DialogCheckpriceComponent, {
      width: '70%',
      height: 'auto',
      position: {
        top: '2%',
      },
      data: data,
    });
    dialogRef.afterClosed().subscribe((result) => {});
  }

  openDialogComment(e): void {
    const dialogRef = this.dialog.open(DialogCommentComponent, {
      width: '550px',
      position: {
        top: '10%',
      },
      data: {data: e, typeUser: this.typeUser, page: 'keyin'},
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log(result);
      }
    });
  }

  onCancelImputation(e) {
    if (e.imputationFlag != null) {
      let imputation = this.imputationList.find(
        (x) => x.paramId == e.imputationFlag,
      );
      if (imputation) {
        console.log(imputation);
        if (imputation.paramInfo === 'CARRIER_FORWARD') {
          e.imputationFlag = null;
          e.currentPrice = null;
          e.noOfCarrierForward = e.noOfCarrierForward - 1;
        } else {
          e.imputationFlag = null;
        }
      }
    } else {
      e.imputationFlag = null;
    }
    e.relativeRatio = null;
    e.price1 = null;
    e.price2 = null;
    e.price3 = null;
    e.price4 = null;
    e.rel = null;
    e.toggles.imputationFlag = false;
    console.log(this.monthlyData);
  }

  goToTop() {
    window.scroll(0, 0);
  }

  setIsEditing() {
    this.sessionService.setIsSaved(false);
    this.sessionService.setMonthlyData(this.monthlyData);
    this.sharedService.setState(
      this.monthlyData,
      this.provinceId,
      this.linkFlag,
      this.priceDataList,
      this.frequencyType,
      this.currencyUnitList,
      this.imputationList,
      this.currencyList,
      this.disableKeyIn,
    );
    this.getIsSaved = this.sessionService.getIsSaved();
  }

  setIsSaved() {
    this.sessionService.setIsSaved(true);
  }

  displayFilterProvince(province?: Province): string | undefined {
    return province
      ? province.provinceCode + ' ' + province.provinceName
      : undefined;
  }

  displayFilterMonth(month?: any): string | undefined {
    return month ? month.name : undefined;
  }

  displayFilterYear(year?: any): string | undefined {
    return year ? year : undefined;
  }

  private _filterProvinceList(name: string): Province[] {
    const filterValue = name;

    return this.provinceList.filter(
      (option) =>
        option.provinceCode.startsWith(filterValue) ||
        option.provinceName.startsWith(filterValue),
    );
  }

  private _filterYearList(name: string): any[] {
    const filterValue = name;

    return this.year.filter((x) => x.toString().startsWith(filterValue));
  }

  private _filterMonthList(name: string): any[] {
    const filterValue = name;

    return this.month.filter((x) => x.name.startsWith(filterValue));
  }

  doCheckSavedProcess() {
    let result = false;
    const isSaved = this.sessionService.getIsSaved();
    if (isSaved) {
      result = true;
      return new Promise((resolve, reject) => {
        resolve(result);
      });
    } else {
      return this.alertDataSwal.show().then((x) => {
        result = false;
        return result;
      });
    }
  }

  measureUnitFind(id) {
    let measureUnit = this.measureUnit.find((x) => x.paramId == id);
    if (measureUnit) {
      return measureUnit.paramLocalMessage;
    }
    return '';
  }

  onSortData(event) {
    this.dataSource.sortingDataAccessor = (item, property) => {
      console.log(property);
      switch (property) {
        case 'productCode': {
          return item['commodityCode'];
        }
        case 'surveyName': {
          return item['surveyName'];
        }
        case 'currency': {
          return item['currencyUnit'].paramCode;
        }
        case 'pricePrevious': {
          return item['previousPrice'];
        }
        case 'currentPrice': {
          return item['currentPrice'];
        }
        case 'productLink': {
          return item['link'].paramCode;
        }
        case 'priceChange': {
          return item['previousAdjustedPrice'];
        }
        case 'priceRel': {
          return item['rel'];
        }
        case 'productStatus': {
          return item['remark'];
        }
        default:
          return item[property];
      }
    };
  }

  relFix(e) {
    let relShow: number = e;
    return relShow.toFixed(2);
  }

  priceFlag(e) {
    if (e === 'Y') {
      return true;
    } else {
      return false;
    }
  }

  inputCheckCalendar() {
    this.arrayIndexRemoveDuration = new Array();
    const dateCurrent = new Date();
    dateCurrent.setHours(0, 0, 0, 0);
    const calendar = this.sessionService.getCalendar();
    console.log('inputCheckCalendar', calendar);
    //โมใหม่
    if (
      calendar &&
      calendar.length > 0 && 
      JSON.stringify(calendar[0].month) !== '[]'
    ) {
      if (this.frequencyType === 'MONTHLY') {
        if (calendar.length > 0) {
          const month = calendar[0].month[0];
          const begin = new Date(month.begin);
          const end = new Date(month.end);
          console.log(begin);
          console.log(end);
          if (dateCurrent >= begin && dateCurrent <= end) {
            this.disablePrice1 = false;
          } else {
            this.disablePrice1 = true;
            if (dateCurrent >= begin) {
              this.arrayIndexRemoveDuration.push(0);
            }
          }
        }
        this.disableKeyIn.disablePrice1 = this.disablePrice1;
      } else if (this.frequencyType === 'WEEKLY') {
        if (calendar.length > 0) {
          const month = calendar[0].month[0];
          const begin = new Date(month.begin);
          const end = new Date(month.end);
          if (dateCurrent >= begin && dateCurrent <= end) {
            this.disablePrice1 = false;
            this.disablePrice2 = false;
            this.disablePrice3 = false;
            this.disablePrice4 = false;
          } else {
            this.disablePrice1 = true;
            this.disablePrice2 = true;
            this.disablePrice3 = true;
            this.disablePrice4 = true;
            if (dateCurrent >= begin) {
              this.arrayIndexRemoveDuration.push(0);
              this.arrayIndexRemoveDuration.push(1);
              this.arrayIndexRemoveDuration.push(2);
              this.arrayIndexRemoveDuration.push(3);
            }
          }
        }
        this.disableKeyIn.disablePrice1 = this.disablePrice1;
        this.disableKeyIn.disablePrice2 = this.disablePrice2;
        this.disableKeyIn.disablePrice3 = this.disablePrice3;
        this.disableKeyIn.disablePrice4 = this.disablePrice4;
      }
      this.checkStatusPeriod();
    }
  }

  getWorkFlow() {
    let frequency = this.frequencyList.find(
      (x) => x.paramInfo == this.frequencyType,
    );
    if (frequency) {
      let model = new WorkFlowEntyRequest();
      model.frequency = frequency.paramId;
      this.dataentyService.getWorkFlow(model).subscribe(
        (res) => {
          this.workFlowList = res;
          this.inputCheckCalendar();
        },
        (error) => {
          console.log(error);
        },
      );
    }
  }

  disabledKeyin() {
    if (this.frequencyType === 'MONTHLY') {
      if (this.disablePrice1) {
        return true;
      }
    } else if (this.frequencyType === 'WEEKLY') {
      if (
        this.disablePrice1 &&
        this.disablePrice2 &&
        this.disablePrice3 &&
        this.disablePrice4
      ) {
        return true;
      }
    }
  }

  checkStatusPeriod() {
    this.changeTabEvent.emit(this.arrayIndexRemoveDuration);
  }

  getCurrentPeriod() {
    this.calendarService.inquireCurrentPeriod().subscribe(
      (res) => {
        this.currentPeriod = res;
      },
      (error) => {},
    );
  }

  isDisablePrice(relativeStatus: string, price: any) {
    if (relativeStatus != 'NEW') {
      return true;
    } else {
      if (price) {
        return true;
      }
      if (this.disableInput && price) {
        return true;
      }
    }
    return false;
  }

  inquireGroupList(event) {
    if (this.filterProvinceControl.value) {
      this.listGroupCpipRequest.provinceId = this.filterProvinceControl.value
        ? this.filterProvinceControl.value.provinceId
        : null;
      console.log('monthSelect ', this.monthSelect);
    }
    this.listGroupCpipRequest.monthTerm =
      this.monthSelect || this.monthSelect === 0 ? this.monthSelect + 1 : 0;
    this.listGroupCpipRequest.yearTerm = this.filterYearControl
      ? this.filterYearControl.value
      : 0;
    this.pricedataService.inquireGroupList(this.listGroupCpipRequest).subscribe(
      async (res) => {
        this.groupList = new Array<GroupList>();
        this.groupAll = [{groupCode: null, groupName: 'ทั้งหมด'}];
        this.groupList = [];
        let response: Array<GroupList>;
        response = res;
        this.groupList = this.groupAll;
        console.log(response);

        response.forEach((element) => {
          this.groupList.push(element);
        });
        let group = this.groupCurrent
          ? this.groupList.find(
              (x) => x.groupCode === this.groupCurrent.groupCode,
            )
          : null;
        if (group === undefined) {
          this.groupCurrent = this.groupAll[0];
        } else {
          this.groupCurrent = group;
        }
      },
      (error) => {
        console.log(error);
      },
    );
  }

  async getYearMonth() {
    const response = await this.pkgMigrateService.getYearMonth().toPromise();
    return response;
  }
}
