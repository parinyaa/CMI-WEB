import {ParamGroup} from './../../../../shared/common/GetParam';
import {
  BasePrice,
  BasePriceByCpaResponse,
  StateAddNewCommodity,
  DialogAddBasePriceResponse,
} from './../../../../shared/models/basePrice/basePrice';
import {BasepriceService} from './../../../../core/service/baseprice/baseprice.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {
  MatTableDataSource,
  PageEvent,
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatPaginator,
  MatSort,
} from '@angular/material';
import {Component, OnInit, Inject, ViewChild} from '@angular/core';
import {FilterBasePiceRequest} from 'src/app/shared/models/basePrice/basePrice';
import {ParamService} from 'src/app/core/service/param/param.service';
import {IndexGroupResponseModel} from 'src/app/shared/models/index-matrix/CpipMsIndexMatrixRequestForm';
import {map, startWith} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {FormControl} from '@angular/forms';
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-dialog-add-newcommodity',
  templateUrl: './dialog-add-newcommodity.component.html',
  styleUrls: ['./dialog-add-newcommodity.component.scss'],
})
export class DialogAddNewcommodityComponent implements OnInit {
  @ViewChild('openTabFile', {static: false}) openTabFile: any;
  newCommodityColumns: string[] = ['commodityCode', 'commodityName', 'action'];
  newCommodityDetail: string[] = [
    'yearTerm',
    'monthTerm',
    'commodityName',
    'price',
  ];
  @ViewChild('sortCol1', {static: true}) sort1: MatSort;
  @ViewChild('sortCol2', {static: true}) sort2: MatSort;
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  page = 0;
  size = 25;
  length = 0;
  pageSize = 25;
  pageSizeOptions: number[] = [60];
  pageEvent = new PageEvent();
  selected: any;
  selectPrice: number;
  dataSource = new MatTableDataSource();
  basePriceDetail = new MatTableDataSource<BasePriceByCpaResponse>();
  monthList = new Array();
  month = [];
  yearTermFilter: string = '';
  monthTermFilter: string = '';
  commodityCodeFilter: string = '';
  commodityNameFilter: string = '';
  notPriceFilter: string = '1';
  filterBasePrice = new FilterBasePiceRequest();
  basePrice = new MatTableDataSource();
  selectCpa: number;
  importPriceFlag = false;
  loadBar = false;
  commodityCodeSearch = '';
  listIndexGroup: Array<IndexGroupResponseModel>;
  filterIndexGroupOptions: Observable<IndexGroupResponseModel[]>;
  filterIndexGroupControl = new FormControl();
  constructor(
    public dialogRef: MatDialogRef<DialogAddNewcommodityComponent>,
    @Inject(MAT_DIALOG_DATA) public data: StateAddNewCommodity,
    private loading: NgxSpinnerService,
    private basepriceService: BasepriceService,
    private paramService: ParamService,
  ) {
    this.pageEvent.pageIndex = 0;
    this.pageEvent.pageSize = this.pageSize;
    this.pageEvent.length = this.length;
  }

  ngOnInit() {
    if (this.data) {
      this.getIndexGroup('INDEX_GROUP');
      this.filterIndexGroupOptions = this.filterIndexGroupControl.valueChanges.pipe(
        startWith(''),
        map((value) => {
          console.log(value);

          return value
            ? this._filterIndexGroupList(value)
            : this.listIndexGroup.slice();
        }),
      );
      let commodityCode: string = this.data
        ? this.data.cpaNewBasePrice.commodityCode
        : null;
      this.commodityCodeFilter = commodityCode.substr(0, 3);
      this.getBasePrice(this.page, this.size);
    }
    this.getParams();
  }

  getBasePrice(page, size) {
    this.loading.show();
    this.filterBasePrice.yearTerm = this.yearTermFilter;
    this.filterBasePrice.monthTerm =
      '0' == this.monthTermFilter ? '' : this.monthTermFilter;
    this.filterBasePrice.commodityCode = this.commodityCodeFilter;
    this.filterBasePrice.commodityName = this.commodityNameFilter;
    this.filterBasePrice.indexGroupId = this.data.indexGroup;
    this.filterBasePrice.regionId = this.data.regionId;
    this.filterBasePrice.provinceId = this.data.provinceId;
    this.filterBasePrice.notPrice = this.notPriceFilter;
    this.basepriceService
      .getSelectBasePrice(this.filterBasePrice, page, size)
      .subscribe(
        (res) => {
          console.log(res);
          this.loading.hide();
          this.length = res.totalRecords;
          this.basePrice = new MatTableDataSource<BasePrice>(res.content);
          this.basePrice.sort = this.sort1;
          console.log(this.basePrice);
        },
        (error) => {
          this.loading.hide();
          console.log(error);
        },
      );
  }

  getIndexGroup(paramsGroup) {
    this.listIndexGroup = this.paramService.getParamByGroup(paramsGroup);

    console.log('indexGroup ==== > ', this.listIndexGroup);
  }

  private _filterIndexGroupList(indexGroup: string): any[] {
    const filterValue = indexGroup;
    let selectIndexGroup;
    // if(indexGroup === 'CPIP' && this.setValueUserProvince) {
    //   selectIndexGroup = this.listIndexGroup.find(option =>
    //     option.paramInfo.toString().startsWith(filterValue));
    // } else {
    selectIndexGroup = this.listIndexGroup.filter((option) =>
      option.paramInfo.toString().startsWith(filterValue),
    );
    // }

    return selectIndexGroup;
  }

  displayFilterIndexGroup(
    indexGroup?: IndexGroupResponseModel,
  ): string | undefined {
    console.log('indexGroup', indexGroup);

    return indexGroup ? indexGroup.paramInfo : undefined;
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

  onNoClick(): void {
    this.dialogRef.close();
  }

  selectRecord(event, element) {
    this.selectCpa = null;
    if (event.checked) {
      this.basePriceDetail = new MatTableDataSource<BasePriceByCpaResponse>([]);
      console.log('event', event);
      console.log('element', element);
      this.selectPrice = element;
      this.selectCpa = element.cpaId;
      this.getBasePriceByCpa(element.cpaId);
    } else {
      this.basePriceDetail = new MatTableDataSource<BasePriceByCpaResponse>([]);
    }
  }

  getBasePriceByCpa(cpaId: number) {
    this.loadBar = true;
    let request = {
      cpaId: cpaId,
      provinceId:
        this.data && this.data.provinceId ? this.data.provinceId : null,
      regionId: this.data.regionId ? this.data.regionId : null,
    };
    console.log(request);
    this.basepriceService.getBasePriceByCpa(request).subscribe(
      (res) => {
        console.log(res);
        this.loadBar = false;
        this.basePriceDetail = new MatTableDataSource<BasePriceByCpaResponse>(
          res,
        );
        this.basePriceDetail.sort = this.sort2;
      },
      (error) => {
        this.loadBar = false;
        console.log(error);
      },
    );
  }

  onSearch() {
    this.loading.show();
    this.selected = null;
    this.size = 0;
    this.page = this.pageSize;
    this.filterBasePrice.yearTerm = this.yearTermFilter;
    this.filterBasePrice.monthTerm =
      '0' == this.monthTermFilter ? '' : this.monthTermFilter;
    this.filterBasePrice.commodityCode = this.commodityCodeFilter;
    this.filterBasePrice.commodityName = this.commodityNameFilter;
    this.filterBasePrice.notPrice = this.notPriceFilter;
    // this.filterBasePrice.provinceId = this.data.provinceId;
    // this.filterBasePrice.regionId = this.data.regionId;
    console.log(
      'this.filterIndexGroupControl ====== ',
      this.filterIndexGroupControl.value,
    );

    this.filterBasePrice.provinceId = this.filterIndexGroupControl.value
      ? null
      : this.data.provinceId;
    this.filterBasePrice.regionId = this.filterIndexGroupControl.value
      ? null
      : this.data.regionId;
    this.filterBasePrice.indexGroupId = this.filterIndexGroupControl.value
      ? this.filterIndexGroupControl.value.paramId
      : this.data.indexGroup;
    if (this.paginator) {
      this.paginator.pageIndex = 0;
    }
    console.log('filterBasePrice', this.filterBasePrice);
    this.basePriceDetail = new MatTableDataSource<BasePriceByCpaResponse>([]);
    if (
      this.filterBasePrice.commodityCode != '' ||
      this.filterBasePrice.commodityName != ''
    ) {
      this.basepriceService
        .getSelectBasePrice(this.filterBasePrice, this.size, this.page)
        .subscribe(
          (res) => {
            console.log(res);
            this.loading.hide();
            this.length = res.totalRecords;
            this.basePrice = new MatTableDataSource<BasePrice>(res.content);
            this.basePrice.sort = this.sort1;
          },
          (error) => {
            this.loading.hide();
            console.log(error);
          },
        );
    } else {
      this.loading.hide();
      this.basePrice = new MatTableDataSource<BasePrice>([]);
    }
  }

  onSelectPrice() {
    console.log('this.selectCpa', this.selectCpa);
    const request = new DialogAddBasePriceResponse();
    request.selectCpa = this.selectCpa;
    request.listImport = this.basePriceDetail.data;
    this.dialogRef.close(request);
  }

  pageChange(e: PageEvent): PageEvent {
    this.size = e.pageSize;
    this.page = e.pageIndex;
    this.getBasePrice(e.pageIndex, e.pageSize);
    return e;
  }

  importPrice(event) {
    // this.loading.show();
    const target: DataTransfer = event.target as DataTransfer;
    if (target.files.length !== 1) {
      this.loading.hide();
      return;
    }
    const reader: FileReader = new FileReader();
    const dataImport = new Array<BasePriceByCpaResponse>();
    reader.onload = (e: any) => {
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, {type: 'binary'});
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];
      const excel = XLSX.utils.sheet_to_json(ws, {header: 1});
      const data = Object.values(excel);
      this.loading.hide();
      Object.keys(data).forEach((key, index) => {
        if (index != 0) {
          if (
            data[key][0] !== undefined &&
            data[key][1] !== undefined &&
            data[key][2] !== undefined &&
            data[key][3] !== undefined &&
            data[key][4] !== undefined
          ) {
            const req = new BasePriceByCpaResponse();
            req.yearTerm = data[key][0];
            req.monthTerm = data[key][1];
            req.commodityCode = data[key][2];
            req.commodityName = data[key][3];
            req.price = data[key][4];
            dataImport.push(req);
          }
        }
      });
      if (dataImport.length >= 36) {
        this.importPriceFlag = true;
        this.basePriceDetail = new MatTableDataSource(dataImport);
      } else {
        this.importPriceFlag = false;
      }
    };
    reader.readAsBinaryString(target.files[0]);
    this.openTabFile.nativeElement.value = '';
  }
}
