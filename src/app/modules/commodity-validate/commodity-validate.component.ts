import {CalendarService} from './../../core/service/calendar/calendar.service';
import localeTh from '@angular/common/locales/th';
import {NgxSpinnerService} from 'ngx-spinner';
import {ValidateserviceService} from '../../core/service/validate/validateservice.service';
import {ParamService} from 'src/app/core/service/param/param.service';
import {
  MatTableDataSource,
  MatSort,
  MatDialog,
  PageEvent,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material';
import {Component, OnInit, ViewChild, Inject, Optional} from '@angular/core';
import {SelectionModel} from '@angular/cdk/collections';
import {ParamGroup} from 'src/app/shared/common/GetParam';
import {CommodityService} from '../../core/service/commodity/commodity.service';
import {FormControl} from '@angular/forms';
import {
  InboxDetail,
  InboxDetails,
  AddPriceDataRequest,
} from './models/inbox-details';
import {
  CommodityCalculate,
  CalculateCommodityRequest,
} from './models/commodity-calculate';
import {ActivatedRoute, Router} from '@angular/router';
import {SessionServiceService} from '../../core/service/common/session-service.service';
import {NeighborhoodDialogComponent} from '../keyin-data/component/neighborhood-dialog/neighborhood-dialog.component';
import {AveragePercentageComponent} from '../keyin-data/component/average-percentage/average-percentage.component';
import {PricedataService} from '../../core/service/pricedata/pricedata.service';
import {CurrencyRate} from '../keyin-data/model/currencyRate';
import {Province} from '../../shared/models/dataenty/request/Province';
import {Observable} from 'rxjs';
import {ProvinceService} from '../../core/service/province/province.service';
import {map, startWith} from 'rxjs/operators';
import {PriceDataRequestForm} from '../../shared/models/dataenty/request/PriceDataRequestForm';
import {DialogCommentComponent} from '../keyin-data/component/dialog-comment/dialog-comment.component';
import {Compare, Inbox, GetValidateDataInboxRequest} from './models/inbox';
import {PopupComponent} from './popup/popup.component';
import {
  WeightAndIndexRequestForm,
  AutoCalRelativeRequest,
} from '../../shared/models/dataenty/request/WeightAndIndexRequestForm';
import {ParamInfo} from '../master-params/model/param';
import {PopupInboxdetailDetailComponent} from './popup-inboxdetail-detail/popup-inboxdetail-detail.component';
import {SharedService} from './component-service/shared.service';
import {SwalComponent} from '@sweetalert2/ngx-sweetalert2';
import {Category} from './models/category';
import {InspectParameter} from './models/inspect-parameter';
import {
  RelativeRequest,
  PeriodCurrent,
  CancelPublishRequest,
} from './models/relative-request';
import {RelativeStatusResponse} from './models/relative-status-reponse';
import {CompareCountRequest} from './models/compare-count-request';
import {DialogCommentValidateComponent} from './dialog-comment-validate/dialog-comment-validate.component';
import {registerLocaleData} from '@angular/common';
import {create, all} from 'mathjs';
import {PkgMigrateService} from 'src/app/core/service/pkgmigrate/pkg-migrate.service';

declare var $: any;

@Component({
  selector: 'app-commodity-validate',
  templateUrl: './commodity-validate.component.html',
  styleUrls: ['./commodity-validate.component.scss'],
})
export class CommodityValidateComponent implements OnInit {
  @ViewChild('sucesssaveDataSwal', {static: false})
  sucesssaveDataSwal: SwalComponent;
  @ViewChild('alert', {static: false}) alertSwal: SwalComponent;
  displayedColumnsEx: string[] = ['monthbefore', 'monthcurrent', 'monthsum'];
  displayedColumns: string[] = [
    'action2',
    'productCode',
    'surveyName',
    'pricePrevious',
    'price1',
    'price2',
    'price3',
    'price4',
    'priceCurrent',
    'productLink',
    'previousAdjustedPrice',
    'rel',
    'productStatus',
    'action',
  ];
  displayedColumnsValidate: string[] = [
    'action2',
    'productCode',
    'surveyName',
    'pricePrevious',
    'price1',
    'price2',
    'price3',
    'price4',
    'priceCurrent',
    'productLink',
    'previousAdjustedPrice',
    'rel',
    'productStatus',
    // 'action',
    'userUpdate',
  ];
  displayedDatasource: string[] = [
    'month',
    'afAverageCurrentPrice',
    'afAverageComparePrice',
    'afAverageRelativePrice',
    'gmAverageCurrentPrice',
    'gmAverageComparePrice',
    'gmAverageRelativePrice',
  ];
  displayedValidateSource: string[] = [
    'commodityCode',
    'status',
    'avgArCurrentPrice',
    'avgArPreviousAdjustPrice',
    'avgArRelative',
    'avgGmCurrentPrice',
    'avgGmPreviousAdjustPrice',
    'avgGmRelative',
  ];
  weightAndIndexRequestForm: WeightAndIndexRequestForm = new WeightAndIndexRequestForm();

  month = [
    {
      name: 'มกราคม ',
      value: 0,
    },
    {
      name: 'กุมภาพันธ์ ',
      value: 1,
    },
    {
      name: 'มีนาคม ',
      value: 2,
    },
    {
      name: 'เมษายน ',
      value: 3,
    },
    {
      name: 'พฤษภาคม ',
      value: 4,
    },
    {
      name: 'มิถุนายน ',
      value: 5,
    },
    {
      name: 'กรกฎาคม ',
      value: 6,
    },
    {
      name: 'สิงหาคม ',
      value: 7,
    },
    {
      name: 'กันยายน ',
      value: 8,
    },
    {
      name: 'ตุลาคม ',
      value: 9,
    },
    {
      name: 'พฤศจิกายน ',
      value: 10,
    },
    {
      name: 'ธันวาคม ',
      value: 11,
    },
  ];

  alertMessage: string;
  imputationList: any;
  linkFlag: any;
  currencyUnitList: any;

  inboxDetails: InboxDetails = new InboxDetails();
  inboxDetailSource = new MatTableDataSource<InboxDetail>();
  inboxSource = new MatTableDataSource<Inbox>();
  toBeAddSource = new MatTableDataSource<InboxDetail>();
  commoditySource = new MatTableDataSource<CommodityCalculate>();
  commodityList = new Array<CommodityCalculate>();

  selection = new SelectionModel<any>(true, []);
  totalData: number;
  cpaCategory: any;
  categoryList: Category[];
  currentType: any;
  currentIndex: string;

  typeUser = 1;

  totalCurrentPrice: number;
  totalPrevPrice: number;

  allSelected = false;
  allSelectedText = ['All Selected', 'All Unselected'];
  allSelectedLabel = this.allSelectedText[0];

  tabs = new FormControl(0);
  currencyRateList: Array<CurrencyRate>;

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
  enabledCalculateWeightAndIndex = false;
  enabledPublishWeightAndIndex = false;
  enabledCancelPublishWeightAndIndex = false;
  userProfile: any;
  year: number[] = [];

  priceDataRequestForm: PriceDataRequestForm = new PriceDataRequestForm();

  currentRelative: Inbox = new Inbox();

  disabledCheckbox = false;
  enabledSave = false;
  enabledCalRelative = false;
  enabledVerifyRelative = false;
  enabledCancelCalRelative = false;
  enabledCancelVerifyRelative = false;
  readOnlyPrice = false;
  fromWorkflow = false;
  periodCurrent: PeriodCurrent;
  labelPrice1 = 'สัปดาห์ที่ \n 1';
  labelPrice2 = 'สัปดาห์ที่ \n 2';
  labelPrice3 = 'สัปดาห์ที่ \n 3';
  labelPrice4 = 'สัปดาห์ที่ \n 4';
  displayPrice1 = false;
  displayPrice2 = false;
  displayPrice3 = false;
  displayPrice4 = false;
  showErorYearTerm: boolean = false;
  showErorProvince: boolean = false;
  toBeAddInboxDetail = new Array<InboxDetail>();
  fromInquirePage;

  constructor(
    private loading: NgxSpinnerService,
    private paramService: ParamService,
    private validateserviceService: ValidateserviceService,
    private commodityService: CommodityService,
    private route: ActivatedRoute,
    private router: Router,
    public sessionService: SessionServiceService,
    private provinceService: ProvinceService,
    private dialog: MatDialog,
    private priceDataService: PricedataService,
    private sharedService: SharedService,
    private calendarService: CalendarService,
    @Optional() public dialogRef: MatDialogRef<CommodityValidateComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public dataDialog: any,
    private pkgMigrateService: PkgMigrateService,
  ) {
    registerLocaleData(localeTh, 'th');
  }

  async ngOnInit() {
    await this.getCurrentPeriod();
    this.fromWorkflow = history.state.fromWorkflow;
    this.fromInquirePage = this.dataDialog;
    console.log('fromWorkflow', this.fromWorkflow);
    this.totalData = 0;
    this.userProfile = this.sessionService.getUserProfile();
    if (
      this.userProfile.provinceId == null &&
      this.userProfile.surveyId == null
    ) {
      this.typeUser = 2;
    }
    this.paramService.getParamsGroupAll().subscribe((res) => {
      this.getParams();
      this.getProvince().subscribe(
        (resp) => {
          this.provinceList = resp;
          // default province
          // if (this.sessionService.checkProfileIsContainObject('ONLY_PROVINCE')) {
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
            let provinceGetOne = this.provinceList.find(
              (x) => x.provinceName === 'กรุงเทพมหานคร',
            );
            this.filterProvinceControl.setValue(provinceGetOne);
          }
          // this.getCategory();
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
          this.filterMonthOptions = this.filterMonthControl.valueChanges.pipe(
            startWith(''),
            map((value) => {
              console.log(value);
              return typeof value === 'string' ? value : value.name;
            }),
            map((monthName) => {
              console.log(monthName);
              return monthName
                ? this._filterMonthList(monthName)
                : this.month.slice();
            }),
          );

          this.priceDataService.getYearTermList().subscribe((r) => {
            this.year = r;
            const todayDate = new Date();
            this.getYearMonth();
            // this.getCategory();
            console.log('jjj ===', this.periodCurrent.month);

            if (!this.fromInquirePage) {
              const thisMonth =
                this.periodCurrent && this.periodCurrent.month
                  ? this.periodCurrent.month - 1
                  : todayDate.getMonth();
              console.log('this.month -==== ', this.month);
              console.log('kkkk -==== ', thisMonth);
              console.log('jjj ===', this.periodCurrent.month);

              // let m = this.month.find((x) => x.value === thisMonth);
              // this.filterMonthControl.setValue(m ? m.value : 0);
              const thisYear =
                this.periodCurrent && this.periodCurrent.year
                  ? this.periodCurrent.year
                  : todayDate.getFullYear() + 543;
              // this.filterYearControl.setValue(
              //   this.year.find((x) => x === thisYear),
              // );
              if (this.filterYearControl.value === '') {
                this.showErorYearTerm = true;
              }
              if (this.filterProvinceControl.value === '') {
                this.showErorProvince = true;
              }
            }

            this.setRequestForm();

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
            if (this.filterYearControl.value === '') {
              this.showErorYearTerm = true;
            }

            if (this.filterProvinceControl.value === '') {
              this.showErorProvince = true;
            }
          });
        },
        (error) => {
          console.log(error);
        },
      );
      if (!this.fromInquirePage) {
        this.callCanCalculate();
      }
    });
  }

  callCanCalculate(): void {
    this.weightAndIndexRequestForm.monthTerm = this.getMonth();
    this.weightAndIndexRequestForm.yearTerm = this.getYear();
    this.weightAndIndexRequestForm.provinceId =
      null == this.filterProvinceControl.value
        ? null
        : this.filterProvinceControl.value.provinceId;
    console.log('weightAndIndexRequestForm', this.weightAndIndexRequestForm);
    this.commodityService
      .canCalculateWeightAndIndex(this.weightAndIndexRequestForm)
      .subscribe(
        (x: RelativeStatusResponse) => {
          console.log(x);
          this.enabledCalculateWeightAndIndex = x.canCreateIndex;
          this.enabledPublishWeightAndIndex = x.canPublish;
          this.enabledCancelPublishWeightAndIndex = x.isPublish;
        },
        (error) => {
          console.log(error);
        },
      );
  }
  setRequestForm() {
    const inboxParam: InspectParameter = this.sessionService.getInspectParam();
    if (inboxParam) {
      this.priceDataRequestForm.monthTerm = inboxParam.monthTerm - 1;
      this.priceDataRequestForm.yearTerm = inboxParam.yearTerm;
      this.priceDataRequestForm.provinceId =
        null == this.filterProvinceControl.value
          ? null
          : this.filterProvinceControl.value.provinceId;
      this.priceDataRequestForm.productCode = inboxParam.commodityCode;
      this.priceDataRequestForm.surveyName = inboxParam.surveyName;
      this.currentIndex = inboxParam.commodityCode;
      this.tabs.setValue(1);
    } else {
      // this.priceDataRequestForm.monthTerm = this.getMonth();
      // this.priceDataRequestForm.yearTerm = this.getYear();
      this.priceDataRequestForm.monthTerm = this.filterMonthControl.value + 1;
      this.priceDataRequestForm.yearTerm = this.filterYearControl.value;
      this.priceDataRequestForm.provinceId =
        null == this.filterProvinceControl.value
          ? null
          : this.filterProvinceControl.value.provinceId;
      this.priceDataRequestForm.productCode =
        undefined === this.filterProductCode ? null : this.filterProductCode;
      this.priceDataRequestForm.productName =
        undefined === this.filterProductName ? null : this.filterProductName;
      this.priceDataRequestForm.surveyName =
        undefined === this.filterSurveyName ? null : this.filterSurveyName;
    }
  }
  filterData() {
    console.log('filterData');
    console.log('filterProvinceControl', this.filterProvinceControl);
    console.log('filterMonthControl', this.filterMonthControl);
    console.log('filterYearControl', this.filterYearControl);
    console.log('filterProductCode', this.filterProductCode);
    console.log('filterProductName', this.filterProductName);
    console.log('filterSurveyName', this.filterSurveyName);
    this.setRequestForm();
    this.getInboxDetail(this.currentIndex, this.priceDataRequestForm);
  }

  getParams() {
    this.cpaCategory = this.paramService
      .getParamByGroup(ParamGroup.cpaCategory)
      .sort((a, b) => a.orderNo - b.orderNo);
    this.imputationList = this.paramService.getParamByGroup(
      ParamGroup.imputation,
    );
    this.currencyUnitList = this.paramService.getParamByGroup(
      ParamGroup.currencyUnit,
    );
    this.linkFlag = this.paramService
      .getParamByGroup(ParamGroup.link)
      .sort((a, b) => a.orderNo - b.orderNo);
  }

  getProvince(): Observable<Province[]> {
    return this.provinceService.getAllProvince();
  }

  // getCurrencyRateList() {
  //   this.priceDataService.getCurrencyRate().subscribe((res) => {
  //     this.currencyRateList = res;
  //   }, (error) => {
  //     console.log(error);
  //   });
  // }

  getCategory() {
    this.commodityService.getCategory().subscribe((res: Category[]) => {
      console.log('log getCategory', res);
      this.categoryList = res;
      const type = this.categoryList.length > 0 ? this.categoryList[0] : null;
      console.log('typeeee', type);
      this.currentType = type;
      const inboxParam: InspectParameter = this.sessionService.getInspectParam();
      if (this.fromWorkflow) {
        this.filterInbox();
      } else {
        if (!this.fromInquirePage) {
          if (inboxParam) {
            this.filterData();
          } else {
            this.changeIndex();
          }
        } else {
          this.changeIndexFromInquirePage();
        }
      }
    });
  }

  changeIndex() {
    const index = this.currentType.commodityCode;
    // const month = this.getMonth();
    // const year = this.getYear();
    console.log('kuyy ==== ', this.filterMonthControl.value);

    const month = this.filterMonthControl
      ? this.filterMonthControl.value + 1
      : '';
    const year = this.filterYearControl ? this.filterYearControl.value : '';
    if (this.filterYearControl.value === '') {
      this.showErorYearTerm = true;
      this.alertSwal.title = 'กรุณาเลือกปี';
      this.alertSwal.show();
      return;
    }
    if (this.filterProvinceControl.value === '') {
      this.showErorProvince = true;
      this.alertSwal.title = 'กรุณาเลือกจังหวัด';
      this.alertSwal.show();
      return;
    }

    if (!this.showErorYearTerm || !this.showErorProvince) {
      this.loading.show();

      const request = new GetValidateDataInboxRequest();
      request.index = index;
      request.month = month;
      request.year = year;

      request.provinceId =
        this.filterProvinceControl && this.filterProvinceControl.value
          ? this.filterProvinceControl.value.provinceId
          : null;

      request.commodityCode = this.filterProductCode
        ? this.filterProductCode
        : '';
      request.commodityName = this.filterProductName
        ? this.filterProductName
        : '';
      this.commodityService.getInbox(request).subscribe(
        (res) => {
          console.log(res);
          this.inboxSource = new MatTableDataSource<Inbox>(res);
          if (res && res.length > 0) {
            this.onSettingCurrentRelative(res[0]);
          }
          this.callCanCalculate();
          this.loading.hide();
        },
        (error) => {
          console.log(error);
          this.loading.hide();
        },
      );
    }
  }

  changeTab(event) {
    console.log(event);
    this.tabs.setValue(event);
    if (event === 0) {
      this.displayPrice1 = false;
      this.displayPrice2 = false;
      this.displayPrice3 = false;
      this.displayPrice4 = false;
      this.changeIndex();
    }
  }

  openChildOfIndex(data) {
    this.allSelected = false;
    this.currentRelative = data;
    this.currentIndex = data.parentCommodityCode;
    this.toBeAddInboxDetail = new Array<InboxDetail>();
    const param: CompareCountRequest = new CompareCountRequest();
    param.baseYearId = data.baseYearId;
    param.monthTerm = data.monthTerm;
    param.cpaId = data.cpaId;
    if (this.filterYearControl.value === '') {
      this.showErorYearTerm = true;
      this.alertSwal.title = 'กรุณาเลือกปี';
      this.alertSwal.show();
      return;
    }
    if (this.filterProvinceControl.value === '') {
      this.showErorProvince = true;
      this.alertSwal.title = 'กรุณาเลือกจังหวัด';
      this.alertSwal.show();
      return;
    }
    if (!this.showErorYearTerm || !this.showErorProvince) {
      param.yearTerm = data.yearTerm;
      param.provinceId =
        this.filterProvinceControl && this.filterProvinceControl.value
          ? this.filterProvinceControl.value.provinceId
          : null;
      this.commodityService
        .getCompareCount('commodityPlus', param)
        .subscribe((r: Compare[]) => {
          console.log(r);
          r.forEach((x: Compare) => {
            const a: InboxDetail = new InboxDetail();
            a.sourceName = x.sourceName;
            a.sourceCode = x.sourceCode;
            a.parentCommodityThName = x.commodityThName;
            a.parentCommodityCode = x.commodityCode;
            a.cpaIdPk = x.cpaId;
            a.dataMatrixIdPk = x.dataMatrixId;
            a.frequency = x.frequency;
            a.hasCurrencyRate = true;
            const linkParam = this.paramService.getParamByGroupCodeAndInfoCode(
              'LINK',
              '0',
            );
            a.link = linkParam.paramId;
            this.calculateLink(a.link, a);
            this.toBeAddInboxDetail.push(a);
          });
          console.log(this.toBeAddSource);
          this.calRelative('cal', this.currentIndex);
        });
      this.loading.show();
      this.setRequestForm();
      this.getInboxDetail(this.currentIndex, this.priceDataRequestForm);
    }
  }

  public getInboxDetail(
    currentIndex: string,
    priceDataRequestForm: PriceDataRequestForm,
  ) {
    this.calculateDetailsButton(this.currentRelative);

    this.commodityService
      .getInboxDetail(currentIndex, 'current', priceDataRequestForm)
      .subscribe(
        (dResp: InboxDetails) => {
          this.sessionService.rmInspectParam();
          this.inboxDetails = dResp;
          this.inboxDetails.inboxDetails.forEach((x) => {
            x.checked = x.usedFlag === 'Y';
            this.calculateLink(x.link, x);
            x.hasCurrencyRate = this.isValidCurrency(x);

            if (x.impute) {
              x.disabledImpute = true;
            }
            if (x.frequency === 'WEEKLY') {
              this.displayPrice1 = true;
              this.displayPrice2 = true;
              this.displayPrice3 = true;
              this.displayPrice4 = true;
            }
          });
          this.checkDuplicate();
          this.inboxDetailSource = new MatTableDataSource(
            this.inboxDetails.inboxDetails,
          );
          this.totalCurrentPrice = this.inboxDetails.totalCurrentPrice;
          this.totalPrevPrice = this.inboxDetails.totalPrevPrice;
          this.calRelative('cal', this.currentIndex);
          this.loading.hide();
          this.tabs.setValue(1);
        },
        (dError) => {
          console.log(dError);
          this.loading.hide();
        },
      );
  }

  checkDuplicate() {
    const array = new Array<InboxDetail>();
    const inboxDetails =
      this.inboxDetails && this.inboxDetails.inboxDetails
        ? this.inboxDetails.inboxDetails
        : [];
    const validateDate =
      this.getMonth() === this.periodCurrent.month &&
      this.getYear() === this.periodCurrent.year;
    if (validateDate) {
      if (this.toBeAddInboxDetail && this.toBeAddInboxDetail.length > 0) {
        console.log('inboxDetails', this.inboxDetails.inboxDetails);
        console.log('toBeAddInboxDetail', this.toBeAddInboxDetail);
        this.toBeAddInboxDetail.map((x) => {
          let check = inboxDetails.find(
            (c) =>
              c.parentCommodityCode === x.parentCommodityCode &&
              c.sourceCode === x.sourceCode,
          );
          if (!check) {
            array.push(x);
          }
        });
        this.toBeAddSource = new MatTableDataSource<InboxDetail>(array);
      } else {
        this.toBeAddSource = new MatTableDataSource<InboxDetail>(
          this.toBeAddInboxDetail,
        );
      }
    } else {
      this.toBeAddSource = new MatTableDataSource<InboxDetail>([]);
    }
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle(event) {
    console.log('masterToggle');
    this.allSelected = event.checked;
    if (event.checked) {
      this.allSelectedLabel = this.allSelectedText[0];
    } else {
      this.allSelectedLabel = this.allSelectedText[1];
    }
    this.inboxDetailSource.data.forEach((row: InboxDetail) => {
      if (
        null != row.currentCalculatedPrice &&
        null != row.previousCalculatedPrice
      ) {
        row.checked = event.checked;
        row.usedFlag = event.checked ? 'Y' : 'N';
      }
    });

    this.calRelative('cal', this.currentIndex);
  }

  itemToggle(event, data) {
    data.checked = event.checked;
    data.usedFlag = event.checked ? 'Y' : 'N';
    console.log('itemToggle');
    this.calRelative('cal', this.currentIndex);
  }

  calRelative(mode: string, index: string) {
    const hasAnySelected = this.inboxDetails.inboxDetails.some(
      (x) => x.checked,
    );
    if ('saveCal' === mode) {
      if (hasAnySelected) {
        const filteredList = this.inboxDetailSource.data.filter( x => x.isUpdate || x.usedFlag === 'Y');
        console.log(filteredList);
        this.callCalculateCommodity(filteredList, mode, index);
      } else {
        const param: ParamInfo = this.paramService.getParamByGroupCodeAndInfoCode(
          'ERROR_MESSAGE',
          'INE400',
        );
        console.log('param', param);
        this.alertSwal.title = param.paramLocalMessage;
        this.alertSwal.show();
      }
    } else {
      const filteredList = this.inboxDetailSource.data.filter( x => x.isUpdate || x.usedFlag === 'Y');
      console.log(filteredList);
      this.callCalculateCommodity(filteredList, mode, index);
    }
  }

  callCalculateCommodity(
    filteredList: InboxDetail[],
    mode: string,
    index: string,
  ): void {
    this.loading.show();
    let request = new CalculateCommodityRequest();
    request.inboxDetails = filteredList;
    request.index = index;
    request.mode = mode;
    request.year = this.getYear();
    request.month = this.getMonth();
    request.provinceId =
      this.filterProvinceControl && this.filterProvinceControl.value
        ? this.filterProvinceControl.value.provinceId
        : null;
    this.commodityService.calculateCommodity(request).subscribe(
      (res) => {
        console.log(res);
        this.callCalculateCommodityCal(filteredList, 'cal', index);
        if (mode === 'save') {
          this.currentRelative.relativeStatus = 'VERIFY_RELATIVE';
        } else if (mode === 'saveCal') {
          this.currentRelative.relativeStatus = 'CALCULATE_RELATIVE';
        }
        this.calculateDetailsButton(this.currentRelative);
        this.commodityList = res;
        this.commoditySource = new MatTableDataSource<CommodityCalculate>(
          this.commodityList,
        );
      },
      (error) => {
        console.log(error);
        this.loading.hide();
      },
    );
  }

  callCalculateCommodityCal(
    filteredList: InboxDetail[],
    mode: string,
    index: string,
  ) {
    this.loading.show();
    let request = new CalculateCommodityRequest();
    request.inboxDetails = filteredList;
    request.index = index;
    request.mode = mode;
    request.month = this.getMonth();
    request.year = this.getYear();
    request.baseYearId = this.currentRelative.baseYearId;
    request.provinceId =
      this.filterProvinceControl && this.filterProvinceControl.value
        ? this.filterProvinceControl.value.provinceId
        : null;
    this.commodityService.calculateCommodity(request).subscribe(
      (res) => {
        if (mode === 'save') {
          this.currentRelative.relativeStatus = 'VERIFY_RELATIVE';
        } else if (mode === 'saveCal') {
          this.currentRelative.relativeStatus = 'CALCULATE_RELATIVE';
        }
        this.calculateDetailsButton(this.currentRelative);
        this.commodityList = res;
        this.commoditySource = new MatTableDataSource<CommodityCalculate>(
          this.commodityList,
        );
        this.loading.hide();
      },
      (error) => {
        console.log(error);
        this.loading.hide();
      },
    );
  }

  openCalIndex() {
    this.loading.show();
    this.weightAndIndexRequestForm.baseYearId = this.currentRelative.baseYearId;
    this.weightAndIndexRequestForm.commodityCode = this.currentType.paramInfo;
    this.weightAndIndexRequestForm.monthTerm = this.getMonth();
    this.weightAndIndexRequestForm.yearTerm = this.getYear();
    this.weightAndIndexRequestForm.provinceId =
      this.filterProvinceControl && this.filterProvinceControl.value
        ? this.filterProvinceControl.value.provinceId
        : null;
    this.weightAndIndexRequestForm.indexGroup = this.currentRelative.indexGroup;
    this.commodityService
      .calculateWeightAndIndex(this.weightAndIndexRequestForm)
      .subscribe(
        (r) => {
          this.loading.hide();
          this.changeIndex();
          console.log(r);
        },
        (er) => {
          this.loading.hide();
          console.log(er);
        },
      );
  }
  onChangeLink(event, data: InboxDetail): void {
    console.log(event);
    // adjust current value
    data.link = event.value;
    data.isUpdate = true;
    console.log(this.linkFlag);
    this.calculateLink(data.link, data);
  }

  calculateLink(linkId: number, data: InboxDetail): void {
    const link = this.paramService.getParamByGroupCodeAndParamId(
      'LINK',
      linkId,
    );
    console.log(link);
    console.log('calculateLink', data);
    if (link) {
      if (link.paramInfo === '0') {
        data.isCurrentAdjustedPriceReadOnly = false;
        data.isPreviousAdjustedPriceReadOnly = true;
      } else if (link.paramInfo === '1' || link.paramInfo === '2') {
        data.previousAdjustedPrice = data.currentAdjustedPrice;
        // const param: ParamInfo = this.paramService.getParamByGroupCodeAndParamId(
        //   'CURRENCY_UNIT',
        //   data.currencyUnit,
        // );
        // if (param) {
        data.previousCalculatedPrice = data.previousAdjustedPrice;
        // );
        data.isCurrentAdjustedPriceReadOnly = true;
        data.isPreviousAdjustedPriceReadOnly = true;
        // }
      } else if (link.paramInfo === '3') {
        // const param: ParamInfo = this.paramService.getParamByGroupCodeAndParamId(
        //   'CURRENCY_UNIT',
        //   data.currencyUnit,
        // );
        // if (param) {
        data.previousCalculatedPrice = data.previousAdjustedPrice;
        data.isCurrentAdjustedPriceReadOnly = false;
        data.isPreviousAdjustedPriceReadOnly = false;
        // }
      }
    }
    if (data.impute) {
      data.isCurrentAdjustedPriceReadOnly = true;
      data.isPreviousAdjustedPriceReadOnly = true;
    }
    this.calculateRel(data);
  }
  onChangePriceNot(event, data: InboxDetail) {
    console.log(event.value);
    console.log(data);
    const findImpute = this.paramService.getParamByGroupCodeAndParamId(
      'IMPUTATION_FLAG',
      event.value,
    );
    if (findImpute) {
      console.log(findImpute);
      if (findImpute.paramInfo === 'NEIGHBORHOOD_PRICE') {
        console.log('open dialog');
        this.openNeighborhoodDialog(data, findImpute);
      } else if (findImpute.paramInfo === 'CARRIER_FORWARD') {
        console.log('prev => currentPrice');
        data.impute = findImpute.paramId;
        data.disabledImpute = true;
        data.currentAdjustedPrice = data.previousAdjustedPrice;
        data.isCurrentAdjustedPriceReadOnly = true;
        this.calculateAdjustedPrice(data);
      } else if (findImpute.paramInfo === 'AVERAGE_PERCENT_CHANGE') {
        this.openAveragePercentageDialog(data, findImpute);
      }
    } else {
      data.isCurrentAdjustedPriceReadOnly = false;
      data.disabledImpute = false;
    }
  }
  private openNeighborhoodDialog(
    data: InboxDetail,
    findImpute: ParamInfo,
  ): void {
    const nonOwnList: InboxDetail[] = this.filterOwnOutInbox(data);
    const obj = {
      cpaParentId: data.parentCpaId,
      baseYearId: data.baseYearIdPk,
      yearTerm: data.yearTermPk,
      monthTerm: data.monthTermPk,
      dataMatrixId: data.dataMatrixIdPk,
      nonOwnList,
    };

    const dialogRef = this.dialog.open(NeighborhoodDialogComponent, {
      width: '80%',
      position: {
        top: '10%',
      },
      data: obj,
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog openNeighborhoodDialog was closeds');
      if (result) {
        console.log('set selected price to currentPrice');
        data.currentAdjustedPrice = result;
        data.impute = findImpute.paramId;
        data.disabledImpute = true;
        data.isCurrentAdjustedPriceReadOnly = true;
        this.calculateAdjustedPrice(data);
      } else {
        data.impute = undefined;
      }
    });
  }

  calculateRel(data: InboxDetail) {
    console.log('calculateRel', data);
    const findedObject = this.linkFlag.find((x) => x.paramId === data.link);
    console.log('findedObject', findedObject);
    if (findedObject) {
      let currentPrice = 0;
      let frequency = data.frequency;
      if (typeof data.frequency !== 'string') {
        const paramFrequency: ParamInfo = this.paramService.getParamByGroupCodeAndParamId(
          'FREQUENCY',
          data.frequency,
        );
        frequency = paramFrequency ? paramFrequency.paramInfo : null;
        console.log(paramFrequency);
      }
      if (frequency === 'WEEKLY') {
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
        if (loader.length > 0) {
          loader.forEach((x) => {
            currentPrice = currentPrice + x;
          });
          currentPrice = currentPrice / loader.length;
          // currentPrice =
          //   Math.round((currentPrice + Number.EPSILON) * 100) / 100;
          const config = {};
          const math = create(all, config);
          currentPrice = math.round(currentPrice, 6);
          currentPrice = math.round(currentPrice, 5);
          currentPrice = math.round(currentPrice, 4);
          currentPrice = math.round(currentPrice, 3);
          currentPrice = math.round(currentPrice, 2);
        }
        data.currentAdjustedPrice = null != currentPrice ? currentPrice : 0;
      }
      data.currentCalculatedPrice = data.currentAdjustedPrice;
      data.previousCalculatedPrice = data.previousAdjustedPrice;
      const previousCalculatedPrice = data.previousCalculatedPrice;
      const currentCalculatePrice = data.currentCalculatedPrice;
      console.log('previousCalculatedPrice', previousCalculatedPrice);
      console.log('currentCalculatePrice', currentCalculatePrice);
      let rel = (currentCalculatePrice / previousCalculatedPrice) * 100;
      rel = Math.round((rel + Number.EPSILON) * 100) / 100;
      data.rel = rel;
    }
  }

  private openAveragePercentageDialog(
    data: InboxDetail,
    findImpute: ParamInfo,
  ): void {
    const nonOwnList: InboxDetail[] = this.filterOwnOutInbox(data);
    const obj = {
      cpaParentId: data.parentCpaId,
      baseYearId: data.baseYearIdPk,
      yearTerm: data.yearTermPk,
      monthTerm: data.monthTermPk,
      dataMatrixId: data.dataMatrixIdPk,
      nonOwnList,
    };
    const dialogRef = this.dialog.open(AveragePercentageComponent, {
      width: '80%',
      position: {
        top: '10%',
      },
      data: obj,
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog openAveragePercentageDialog was closed');
      console.log(result);
      if (result) {
        const priceAvg = (result * data.previousAdjustedPrice) / 100;
        data.relativeRatio = result;
        data.currentAdjustedPrice = Number.parseFloat(priceAvg.toFixed(2));
        // this.calculateRel(data);
        data.impute = findImpute.paramId;
        data.isCurrentAdjustedPriceReadOnly = true;
        data.disabledImpute = true;
        this.calculateAdjustedPrice(data);
      } else {
        data.impute = undefined;
      }
    });
  }

  calculateExchangeRate(unit: string, price: number): number {
    let result = 0;
    console.log('exchange price = ' + price);
    console.log('exchange unit = ' + unit);
    if ('THB' === unit) {
      result = price;
    } else {
      const findedUnit = this.currencyRateList.find((x) => {
        return x.currencyKey.currencyUnit.paramCode === unit;
      });
      if (findedUnit) {
        console.log('exchange rate = ' + findedUnit.exchangeRate);
        result = price * findedUnit.exchangeRate;
      }
    }
    console.log('exchange result = ' + result);
    return result;
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
  selectYearTerm() {
    this.showErorYearTerm = false;
  }

  selectProvince() {
    this.showErorProvince = false;
  }
  private _filterMonthList(name: string): any[] {
    const filterValue = name;

    return this.month.filter((x) => x.name.startsWith(filterValue));
  }

  openDialogComment(e, page): void {
    const data = e;
    const userProfile = this.sessionService.getUserProfile();
    let typeUser = 1;
    if (userProfile.provinceId == null && userProfile.surveyId == null) {
      typeUser = 2;
    }

    if (page == 'inspect') {
      const dialogRef = this.dialog.open(DialogCommentComponent, {
        width: '550px',
        position: {
          top: '10%',
        },
        data: {data, typeUser, page},
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          console.log(result);
        }
      });
    } else if (page == 'commodity') {
      const dialogRef = this.dialog.open(DialogCommentValidateComponent, {
        width: '550px',
        position: {
          top: '10%',
        },
        data: {data, typeUser, page},
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          console.log(result);
        }
      });
    }
  }

  openDialogPopup(e: Inbox, type): void {
    console.log(e);
    if (e.countPlus > 0 || e.countMinus > 0) {
      const data: CompareCountRequest = new CompareCountRequest();
      data.baseYearId = e.baseYearId;
      data.yearTerm = e.yearTerm;
      data.monthTerm = e.monthTerm;
      data.cpaId = e.cpaId;
      const dialogRef = this.dialog.open(PopupComponent, {
        width: '70%',
        height: '50%',
        position: {
          top: '10%',
        },
        data: {type, param: data},
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          console.log(result);
        }
      });
    }
  }
  openDialogPopupDetail(e: InboxDetail): void {
    const dialogRef = this.dialog.open(PopupInboxdetailDetailComponent, {
      width: '80%',
      position: {
        top: '10%',
      },
      data: e,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log(result);
      }
    });
  }
  getDescriptForCurrency(currencyId: number): string {
    let result = '';
    if (currencyId) {
      const param: ParamInfo = this.paramService.getParamByGroupCodeAndParamId(
        'CURRENCY_UNIT',
        currencyId,
      );
      result = param.paramLocalMessage;
    }
    return result;
  }
  cancelAction(element: InboxDetail): void {
    element.relativeRatio = null;
    element.currentAdjustedPrice = element.currentPrice;
    this.calculateAdjustedPrice(element);
    element.impute = null;
    element.disabledImpute = false;
    element.isCurrentAdjustedPriceReadOnly = false;
  }
  clickSave(): void {
    let provinceId =
      this.filterProvinceControl && this.filterProvinceControl.value
        ? this.filterProvinceControl.value.provinceId
        : null;
    const  inboxDetails = this.inboxDetails.inboxDetails.filter( x => x.isUpdate);
    this.sharedService.setState(
      inboxDetails,
      this.sucesssaveDataSwal,
      this.loading,
      provinceId,
    );
    this.sharedService.onCheckPriceDataEnty();
  }

  calculateAdjustedPrice(element: InboxDetail): void {
    // const paramCurrency = this.paramService.getParamByGroupCodeAndParamId(
    //   'CURRENCY_UNIT',
    //   element.currencyUnit,
    // );
    // if (paramCurrency) {
    //   if (paramCurrency.paramInfo === 'THB') {
    //     element.hasCurrencyRate = true;
    //     element.currentCurrencyRate = 1;
    //   } else {
    //     const findedUnit = this.currencyRateList.find((c) => {
    //       return (
    //         c.currencyKey.currencyUnit.paramInfoId === element.currencyUnit
    //       );
    //     });
    //     if (findedUnit) {
    //       element.hasCurrencyRate = true;
    //       element.currentCurrencyRate = findedUnit.exchangeRate;
    //     } else {
    //       element.hasCurrencyRate = false;
    //     }
    //   }
    // } else {
    //   element.hasCurrencyRate = false;
    // }
    element.currentCalculatedPrice = element.currentAdjustedPrice;
    this.calculateLink(element.link, element);
  }

  onSelect(element: InboxDetail): void {
    element.hasCurrencyRate = this.isValidCurrency(element);
  }
  isValidCurrency(x: InboxDetail): boolean {
    let result = false;
    const paramCurrency = this.paramService.getParamByGroupCodeAndParamId(
      'CURRENCY_UNIT',
      x.currencyUnit,
    );
    if (paramCurrency) {
      if (paramCurrency.paramInfo === 'THB') {
        x.currentCurrencyRate = 1;
        result = true;
      } else {
        const findedUnit = this.currencyRateList.find((c) => {
          return c.currencyKey.currencyUnit.paramInfoId === x.currencyUnit;
        });
        if (findedUnit) {
          x.currentCurrencyRate = findedUnit.exchangeRate;
          result = true;
        }
      }
    } else {
      if (!x.currentCurrencyRate || !x.previousCurrencyRate) {
        result = false;
      }
    }

    return result;
  }

  clickAdd(element: InboxDetail): void {
    this.loading.show();
    const inboxElements = new AddPriceDataRequest();
    let arr = new Array<InboxDetail>();
    arr.push(element);
    inboxElements.inboxDetails = arr;
    inboxElements.monthTerm = this.getMonth();
    inboxElements.yearTerm = this.getYear();
    console.log('inboxElements', inboxElements);
    this.priceDataService.createPriceDataFromInspect(inboxElements).subscribe(
      (response) => {
        this.loading.hide();
        this.sucesssaveDataSwal.show();
        this.tabs.setValue(0);
        this.changeIndex();
      },
      (error) => {
        console.error(error);
        this.loading.hide();
      },
    );
  }

  removeAddItem(element: InboxDetail): void {
    const indexToRemove = this.toBeAddSource.data.indexOf(element);
    this.toBeAddSource.data.splice(indexToRemove, 1);
    this.toBeAddSource._updateChangeSubscription();
  }

  cancelCalRelative(): void {
    this.callUpdateRelativeStatus('NEW');
  }

  cancelVerifyRelative(): void {
    this.callUpdateRelativeStatus('CALCULATE_RELATIVE');
  }

  cancelCreateIndex(): void {
    this.loading.show();
    let request = new CancelPublishRequest();
    request.month = this.getMonth();
    request.year = this.getYear();
    request.baseYearId = this.currentRelative.baseYearId;
    request.provinceId =
      this.filterProvinceControl && this.filterProvinceControl.value
        ? this.filterProvinceControl.value.provinceId
        : null;
    this.commodityService.cancelCalculate(request).subscribe(
      (x) => {
        this.changeIndex();
        this.loading.hide();
      },
      (error) => {
        this.loading.hide();
      },
    );
  }

  cancelPublishIndex(): void {
    this.loading.show();
    let request = new CancelPublishRequest();
    request.month = this.getMonth();
    request.year = this.getYear();
    request.baseYearId = this.currentRelative.baseYearId;
    request.provinceId =
      this.filterProvinceControl && this.filterProvinceControl.value
        ? this.filterProvinceControl.value.provinceId
        : null;
    this.commodityService.cancelPublish(request).subscribe(
      (x) => {
        this.changeIndex();
        this.loading.hide();
      },
      (error) => {
        this.loading.hide();
      },
    );
  }

  createSOP(): void {
    this.loading.show();
    this.commodityService.createSOP().subscribe(
      (x) => {
        this.changeIndex();
        this.loading.hide();
      },
      (error) => {
        this.loading.hide();
      },
    );
  }

  publishIndex(): void {
    const relativeRequest: RelativeRequest = new RelativeRequest();
    relativeRequest.baseYearId = this.currentRelative.baseYearId;
    relativeRequest.monthTerm = this.getMonth();
    relativeRequest.yearTerm = this.getYear();
    relativeRequest.provinceId =
      null == this.filterProvinceControl.value
        ? null
        : this.filterProvinceControl.value.provinceId;
    this.loading.show();
    this.commodityService.publishIndex(relativeRequest).subscribe(
      (x) => {
        this.changeIndex();
        this.loading.hide();
      },
      (error) => {
        this.loading.hide();
      },
    );
  }

  callUpdateRelativeStatus(status: string) {
    const relativeRequest: RelativeRequest = new RelativeRequest();
    relativeRequest.baseYearId = this.currentRelative.baseYearId;
    relativeRequest.cpaId = this.currentRelative.cpaId;
    relativeRequest.monthTerm = this.currentRelative.monthTerm;
    relativeRequest.yearTerm = this.currentRelative.yearTerm;
    relativeRequest.relativeStatus = status;
    relativeRequest.provinceId =
      null == this.filterProvinceControl.value
        ? null
        : this.filterProvinceControl.value.provinceId;
    this.loading.show();
    this.commodityService.updateRelativeStatus(relativeRequest).subscribe(
      (x) => {
        this.currentRelative.relativeStatus = relativeRequest.relativeStatus;
        this.calculateDetailsButton(this.currentRelative);
        this.loading.hide();
      },
      (error) => {
        this.loading.hide();
      },
    );
  }

  calculateDetailsButton(currentRelative: Inbox): void {
    const relativeStatus = currentRelative.relativeStatus;
    this.disabledCheckbox = false;
    this.enabledSave = false;
    this.enabledCalRelative = false;
    this.enabledVerifyRelative = false;
    this.enabledCancelCalRelative = false;
    this.enabledCancelVerifyRelative = false;
    this.readOnlyPrice = false;
    if (relativeStatus === 'NEW') {
      this.enabledSave = true;
      this.enabledCalRelative = true;
    } else if (relativeStatus === 'CALCULATE_RELATIVE') {
      this.disabledCheckbox = true;
      this.readOnlyPrice = true;
      this.enabledVerifyRelative = true;
      this.enabledCancelCalRelative = true;
    } else if (relativeStatus === 'VERIFY_RELATIVE') {
      this.disabledCheckbox = true;
      this.readOnlyPrice = true;
      this.enabledCalRelative = false;
      this.enabledVerifyRelative = false;
      this.enabledCancelVerifyRelative = true;
    } else if (relativeStatus === 'CREATE_INDEX') {
      this.disabledCheckbox = true;
      this.readOnlyPrice = true;
    } else if (relativeStatus === 'PUBLIC_INDEX') {
      this.disabledCheckbox = true;
      this.readOnlyPrice = true;
    }
  }

  filterOwnOutInbox(s: InboxDetail): InboxDetail[] {
    let filteredData: InboxDetail[] = [];

    const filteredInboxDetailsData: InboxDetail[] = this.inboxDetails.inboxDetails.filter(
      (x: InboxDetail) => {
        return (
          x.parentCommodityCode === s.parentCommodityCode &&
          x.dataMatrixIdPk !== s.dataMatrixIdPk &&
          x.currentAdjustedPrice
        );
      },
    );

    const filteredTobeAddData: InboxDetail[] = this.toBeAddSource.filteredData.filter(
      (x: InboxDetail) => {
        return (
          x.parentCommodityCode === s.parentCommodityCode &&
          x.dataMatrixIdPk !== s.dataMatrixIdPk &&
          x.currentAdjustedPrice
        );
      },
    );

    filteredData = filteredInboxDetailsData.concat(filteredTobeAddData);

    return filteredData;
  }

  filterInbox() {
    this.loading.show();
    const commodityCode = history.state.commodityCode;
    this.commodityService.filterInbox(commodityCode).subscribe(
      (res) => {
        console.log(res);
        this.inboxSource = new MatTableDataSource<Inbox>(res);
        this.callCanCalculate();
        this.loading.hide();
      },
      (error) => {
        console.log(error);
        this.loading.hide();
      },
    );
  }

  filterParent() {
    let province =
      null == this.filterProvinceControl.value
        ? null
        : this.filterProvinceControl.value.provinceId;
    if (province === null) {
      this.alertSwal.title = 'กรุณาเลือกจังหวัด';
      this.alertSwal.show();
      return;
    }
    this.changeIndex();
  }

  getMonth() {
    const month =
      null == this.filterMonthControl.value
        ? this.periodCurrent.month
        : this.filterMonthControl.value + 1;
    return month;
  }

  getYear() {
    const year =
      null == this.filterYearControl.value
        ? this.periodCurrent.year
        : this.filterYearControl.value;
    return year;
  }

  async getCurrentPeriod() {
    await this.calendarService
      .inquireCurrentPeriod()
      .toPromise()
      .then((x) => (this.periodCurrent = x));
  }

  onSettingCurrentRelative(data) {
    this.currentRelative = data;
  }

  changeIndexFromInquirePage() {
    this.loading.show();

    let province = this.provinceList.find(
      (x) => x.provinceId === this.fromInquirePage.request.provinceId,
    );
    this.filterProvinceControl.setValue(province);
    //เก่า
    // let m = this.month.find(
    //   (x) => x.value === this.fromInquirePage.request.month - 1,
    // );
    // console.log('m', m);
    // this.filterMonthControl.setValue(m ? m.value : 0);
    // this.filterYearControl.setValue(this.fromInquirePage.request.year);

    this.filterProductCode = this.fromInquirePage.element.commodityCode;
    this.filterProductName = this.fromInquirePage.element.commodityName;

    const request = new GetValidateDataInboxRequest();
    request.index = this.fromInquirePage.element.commodityCode.substr(0, 1);
    // request.month = this.fromInquirePage.request.month;
    // request.year = this.fromInquirePage.request.year;
    request.month = this.filterMonthControl.value + 1;
    request.year = this.filterYearControl.value;
    request.provinceId = this.fromInquirePage.request.provinceId;
    request.commodityCode = this.fromInquirePage.element.commodityCode;
    request.commodityName = this.fromInquirePage.element.commodityName;
    this.commodityService.getInbox(request).subscribe(
      (res) => {
        console.log(res);
        this.inboxSource = new MatTableDataSource<Inbox>(res);
        if (res && res.length > 0) {
          this.onSettingCurrentRelative(res[0]);
        }
        this.callCanFromInquirePage();
        this.openChildOfIndex(res[0]);
        this.loading.hide();
      },
      (error) => {
        console.log(error);
        this.loading.hide();
      },
    );
  }

  callCanFromInquirePage(): void {
    this.weightAndIndexRequestForm.monthTerm = this.fromInquirePage.request.month;
    this.weightAndIndexRequestForm.yearTerm = this.fromInquirePage.request.year;
    this.weightAndIndexRequestForm.provinceId = this.fromInquirePage.request.provinceId;
    console.log('weightAndIndexRequestForm', this.weightAndIndexRequestForm);
    this.commodityService
      .canCalculateWeightAndIndex(this.weightAndIndexRequestForm)
      .subscribe(
        (x: RelativeStatusResponse) => {
          console.log(x);
          this.enabledCalculateWeightAndIndex = x.canCreateIndex;
          this.enabledPublishWeightAndIndex = x.canPublish;
          this.enabledCancelPublishWeightAndIndex = x.isPublish;
        },
        (error) => {
          console.log(error);
        },
      );
  }

  closeDialog() {
    this.dialogRef.close();
  }

  autoCalRelative() {
    this.loading.show();
    let request = new AutoCalRelativeRequest();
    request.cpipId = 0;
    request.monthTerm = this.getMonth();
    request.yearTerm = this.getYear();
    request.provinceId =
      this.filterProvinceControl && this.filterProvinceControl.value
        ? this.filterProvinceControl.value.provinceId
        : null;
    this.commodityService.autoCalRelative(request).subscribe(
      (res) => {
        this.loading.hide();
        this.filterParent();
      },
      (error) => {
        this.loading.hide();
      },
    );
  }

  getYearMonth() {
    this.pkgMigrateService.getYearMonth().subscribe(
      (res) => {
        let resMonth = res.month;

        // let m = this.month.find((x) => x.value === thisMonth);
        // this.filterMonthControl.setValue(m ? m.value : 0);

        let month = this.month.find((x) => x.value === resMonth - 1);
        console.log('month ==== ', month);
        // this.inquiryData.controls['month'].setValue(month.paramInfo);
        this.filterMonthControl.setValue(month ? month.value : 0);

        let year = this.year.find(
          (x) => x === (res.year < 2560 ? res.year + 543 : res.year),
        );
        this.filterYearControl.setValue(year ? year : '');
        console.log('year ==== ', year);
        // this.inquiryData.controls['year'].setValue(year);
        this.getCategory();
      },
      (error) => {},
    );
  }
}
