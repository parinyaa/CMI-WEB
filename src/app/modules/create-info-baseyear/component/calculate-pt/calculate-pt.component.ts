import {ParamGroup} from 'src/app/shared/common/GetParam';
import {DialogAddNewcommodityComponent} from './../dialog-add-newcommodity/dialog-add-newcommodity.component';
import {NgxSpinnerService} from 'ngx-spinner';
import {
  BasePrice,
  FilterBasePiceRequest,
  CpaNewBasePrice,
  BasePriceRequest,
  CpaNewBasePriceRequest,
  StateAddNewCommodity,
  DialogAddBasePriceResponse,
} from './../../../../shared/models/basePrice/basePrice';
import {
  MatTableDataSource,
  PageEvent,
  MatSort,
  MatDialog,
  MatPaginator,
  MatTabChangeEvent,
  MatStepper,
} from '@angular/material';
import {BasepriceService} from './../../../../core/service/baseprice/baseprice.service';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {ParamService} from 'src/app/core/service/param/param.service';
import {SwalComponent} from '@sweetalert2/ngx-sweetalert2';
import {Observable} from 'rxjs';
import * as FileSaver from 'file-saver';
import {RebaseServiceService} from '../../../../core/service/rebase/rebase-service.service';
import {AvgBaseWeightReq, ProvinceRes} from '../../models/request-param';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-calculate-pt',
  templateUrl: './calculate-pt.component.html',
  styleUrls: ['./calculate-pt.component.scss'],
})
export class CalculatePtComponent {
  @ViewChild('paginator1', {static: true}) paginator1: MatPaginator;
  @ViewChild('sucesssaveDataSwal', {static: false})
  sucesssaveDataSwal: SwalComponent;
  @ViewChild('MatSort1', {static: true}) sort: MatSort;
  @ViewChild('MatSort2', {static: true}) sort2: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  basePrice = new MatTableDataSource<BasePrice>();
  displayedColumns: string[] = [
    'commodityCode',
    'baseYear',
    'yearTerm',
    'monthTerm',
    'commodityName',
    'price',
  ];
  newCommodityColumns: string[] = [
    'commodityCode',
    'commodityThName',
    'commodityEnName',
    'action',
  ];
  page = 0;
  size = 25;
  length = 0;
  pageSize = 25;
  pageSizeOptions: number[] = [5, 10, 25, 100, 500, 1000];
  pageEvent: any;
  pageSizeBorrow = 25;
  pageIndexBorrow = 0;
  pageSizeOptionsBorrow: number[] = [5, 25, 100, 1000];
  lengthBorrow = 0;
  pageEventBorrow: PageEvent = new PageEvent();
  monthList = new Array();
  month = [];
  yearTermFilter: string = '';
  monthTermFilter: string = '';
  commodityCodeFilter: string = '';
  commodityNameFilter: string = '';
  notPriceFilter: string = '0';
  filterBasePrice = new FilterBasePiceRequest();
  avgBaseWeightReq = new AvgBaseWeightReq();
  @Input() provinceId: any;
  @Input() indexGroup: any;
  @Input() regionId: any;
  @Input() stepper: MatStepper;
  province: ProvinceRes;
  @Input() filterProvinceControl: FormControl;
  @Output() step = new EventEmitter<any>();
  @Output() stage = new EventEmitter<any>();
  @Input() stage40: number;
  commodityMock = [
    {
      baseYear: 2558,
      yearTerm: 2562,
      monthTerm: 12,
      cpaId: null,
      commodityCode: '1011111010000000',
      commodityName: 'ข้าวเปลือกเจ้านาปี',
      price: null,
    },
    {
      baseYear: 2558,
      yearTerm: 2562,
      monthTerm: 12,
      cpaId: null,
      commodityCode: '1011111020000000',
      commodityName: 'ข้าวเปลือกเจ้านาปี2',
      price: null,
    },
    {
      baseYear: 2558,
      yearTerm: 2562,
      monthTerm: 12,
      cpaId: null,
      commodityCode: '1011111030000000',
      commodityName: 'ข้าวเปลือกเจ้านาปี3',
      price: null,
    },
  ];
  newCommodity = new MatTableDataSource<CpaNewBasePrice>();
  checkDataSourceBorrow: boolean;

  constructor(
    private basepriceService: BasepriceService,
    private loading: NgxSpinnerService,
    private dialog: MatDialog,
    private paramService: ParamService,
    private rebaseService: RebaseServiceService,
  ) {
    this.pageEventBorrow.pageIndex = 0;
    this.pageEventBorrow.pageSize = this.pageSize;
    this.pageEventBorrow.length = this.length;
  }

  ngOnInit() {
    // this.getParams();
    // this.getBasePrice(this.page,this.size);
    this.avgBaseWeightReq.indexGroup =
      this.indexGroup === null ? null : this.indexGroup.paramId;
    if (this.filterProvinceControl.value) {
      this.province = this.filterProvinceControl.value;
      this.avgBaseWeightReq.provinceId =
        this.province === null ? null : this.province.provinceId;
    } else {
      this.avgBaseWeightReq.regionId =
        this.regionId === null ? null : this.regionId.regionId;
    }
  }

  prepage() {
    console.log('calculate pt > stage40 === ', this.stage40);
    this.filterBasePrice.indexGroupId =
      this.indexGroup === null ? null : this.indexGroup.paramId;
    if (this.filterProvinceControl.value) {
      this.province = this.filterProvinceControl.value;
      this.filterBasePrice.provinceId =
        this.province === null ? null : this.province.provinceId;
    } else {
      this.filterBasePrice.regionId =
        this.regionId === null ? null : this.regionId.regionId;
    }
    console.log(this.province);
    this.getParams();
    this.getBasePrice(this.page, this.size);
  }

  goNext() {
    this.step.emit(this.stepper);
  }

  getBasePrice(page, size) {
    this.loading.show();
    this.filterBasePrice.yearTerm = this.yearTermFilter;
    this.filterBasePrice.monthTerm =
      '0' == this.monthTermFilter ? '' : this.monthTermFilter;
    this.filterBasePrice.commodityCode = this.commodityCodeFilter;
    this.filterBasePrice.commodityName = this.commodityNameFilter;
    this.filterBasePrice.notPrice = this.notPriceFilter;
    this.filterBasePrice.regionId = this.regionId
      ? this.regionId.regionId
      : null;
    this.basepriceService
      .getBasePrice(this.filterBasePrice, page, size)
      .subscribe(
        (res) => {
          console.log(res);
          this.loading.hide();
          this.length = res.totalRecords;
          this.basePrice = new MatTableDataSource<BasePrice>(res.content);
          this.basePrice.sort = this.sort;
          console.log(this.basePrice);
        },
        (error) => {
          this.loading.hide();
          console.log(error);
        },
      );
  }

  getParams() {
    this.monthList = this.paramService
      .getParamByGroup(ParamGroup.month)
      .sort((a, b) => a.orderNo - b.orderNo);
    if (this.monthList) {
      this.monthList.forEach((element) => {
        let obj = {name: element.paramLocalMessage, value: element.paramInfo};
        if (this.month.length < 12) {
          this.month.push(obj);
        }
      });
    }
  }

  pageChange(e: PageEvent) {
    console.log(e);
    this.pageEventBorrow = e;
    this.getBasePrice(e.pageIndex, e.pageSize);
    this.getCpaNewBasePrice(e);

    return e;
  }

  openDialogAddCommodity(element: CpaNewBasePrice) {
    let request = new StateAddNewCommodity();
    request.indexGroup = this.indexGroup.paramId;
    request.provinceId = this.province ? this.province.provinceId : null;
    request.regionId = this.regionId ? this.regionId.regionId : null;
    request.cpaNewBasePrice = element;
    const dialogRef = this.dialog.open(DialogAddNewcommodityComponent, {
      width: '95%',
      position: {
        top: '5%',
      },
      data: request,
    });
    dialogRef.afterClosed().subscribe((result: DialogAddBasePriceResponse) => {
      if (result.selectCpa) {
        element.cpaClone = result.selectCpa;
        this.onSaveNewPrice(element);
      } else {
        element.cpaClone = result.listImport;
        this.onSaveNewPriceImport(element);
      }
    });
  }

  onSearch() {
    this.filterBasePrice.yearTerm = this.yearTermFilter;
    this.filterBasePrice.monthTerm =
      '0' == this.monthTermFilter ? '' : this.monthTermFilter;
    this.filterBasePrice.commodityCode = this.commodityCodeFilter;
    this.filterBasePrice.commodityName = this.commodityNameFilter;
    this.filterBasePrice.notPrice = this.notPriceFilter;
    this.filterBasePrice.regionId = this.regionId
      ? this.regionId.regionId
      : null;
    this.paginator.pageIndex = 0;
    this.paginator.firstPage();
    this.loading.show();
    this.basepriceService
      .getBasePrice(
        this.filterBasePrice,
        this.pageEventBorrow.pageIndex,
        this.pageEventBorrow.pageSize,
      )
      .subscribe(
        (res) => {
          console.log(res);
          this.loading.hide();
          this.length = res.totalRecords;
          this.basePrice = new MatTableDataSource<BasePrice>(res.content);
          this.basePrice.sort = this.sort;
        },
        (error) => {
          this.loading.hide();
          console.log(error);
        },
      );
  }

  selectedTabChange(event: MatTabChangeEvent) {
    console.log(event);
    if (event.index == 1) {
      this.getCpaNewBasePrice(this.pageEventBorrow);
    } else {
      this.onSearch();
    }
  }

  getCpaNewBasePrice(pageEvent: PageEvent) {
    console.log(this.filterProvinceControl);
    this.checkDataSourceBorrow = true;
    this.loading.show();
    let request = new AvgBaseWeightReq();
    request.indexGroup = this.indexGroup.paramId;
    request.provinceId = this.province ? this.province.provinceId : null;
    request.regionId = this.regionId ? this.regionId.regionId : null;
    this.basepriceService.getCpaNewBasePrice(request).subscribe(
      (res) => {
        this.loading.hide();
        console.log(res);
        this.newCommodity = new MatTableDataSource<CpaNewBasePrice>(
          res.content,
        );
        this.newCommodity.sort = this.sort2;
      },
      (error) => {
        this.loading.hide();
        console.log(error);
      },
    );
  }

  onSaveNewPrice(element: CpaNewBasePrice) {
    this.loading.show();
    let cpaNewBasePriceRequest = new CpaNewBasePriceRequest();
    if (element.cpaClone) {
      cpaNewBasePriceRequest.cpaIdNew = element.cpaId;
      cpaNewBasePriceRequest.cpaIdClone = element.cpaClone;
    }
    cpaNewBasePriceRequest.provinceId = this.province
      ? this.province.provinceId
      : null;
    cpaNewBasePriceRequest.indexGroup = this.indexGroup
      ? this.indexGroup.paramId
      : null;
    cpaNewBasePriceRequest.region = this.regionId
      ? this.regionId.regionId
      : null;
    console.log('request', cpaNewBasePriceRequest);
    this.basepriceService.updateNewBasePrice(cpaNewBasePriceRequest).subscribe(
      (res) => {
        this.loading.hide();
        this.sucesssaveDataSwal.show();
        this.getCpaNewBasePrice(this.pageEventBorrow);
        console.log(res);
      },
      (error) => {
        this.loading.hide();
        console.log(error);
      },
    );
  }

  onSavePrice() {
    this.loading.show();
    let basePrice = new Array();
    this.basePrice.data.forEach((element) => {
      basePrice.push(element);
    });
    let request = new BasePriceRequest();
    request.indexGroup = this.indexGroup.paramId;
    request.provinceId = this.province ? this.province.provinceId : null;
    request.basePrice = basePrice;
    request.regionId = this.regionId ? this.regionId.regionId : null;
    console.log('request', request);
    this.basepriceService.updateBasePrice(request).subscribe(
      (res) => {
        this.loading.hide();
        this.sucesssaveDataSwal.show();
        this.onSearch();
      },
      (error) => {
        this.loading.hide();
      },
    );
  }

  setPrice(event, element) {
    if (!event) {
      element.price = null;
    }
  }

  nextStep(): Observable<any> {
    return this.basepriceService.checkNextStepStage45();
  }

  previousStep() {
    console.log('previousStep');
  }

  export(): void {
    this.loading.show();
    this.rebaseService.exportBasePrice(this.avgBaseWeightReq).subscribe(
      (res) => {
        const mediaType = 'application/octet-stream';
        const blob = new Blob([res], {type: mediaType});
        console.log('blob', blob);
        FileSaver.saveAs(
          blob,
          'base_price' + new Date().toISOString() + '.csv',
        );
        this.loading.hide();
      },
      (error) => {
        this.loading.hide();
        console.log(error);
      },
    );
  }

  changeStage() {
    this.stage.emit(5.31);
  }

  onSaveNewPriceImport(element: CpaNewBasePrice) {
    console.log(element);
    this.loading.show();
    let cpaNewBasePriceRequest = new CpaNewBasePriceRequest();
    if (element.cpaClone) {
      cpaNewBasePriceRequest.cpaIdNew = element.cpaId;
      cpaNewBasePriceRequest.cpaIdClone = element.cpaClone;
    }
    cpaNewBasePriceRequest.provinceId = this.province
      ? this.province.provinceId
      : null;
    cpaNewBasePriceRequest.indexGroup = this.indexGroup
      ? this.indexGroup.paramId
      : null;
    cpaNewBasePriceRequest.region = this.regionId
      ? this.regionId.regionId
      : null;
    console.log('request', cpaNewBasePriceRequest);
    this.basepriceService.updateNewBaseImportPrice(cpaNewBasePriceRequest).subscribe(
      (res) => {
        this.loading.hide();
        this.sucesssaveDataSwal.show();
        this.getCpaNewBasePrice(this.pageEventBorrow);
        console.log(res);
      },
      (error) => {
        this.loading.hide();
        console.log(error);
      },
    );
  }
}
