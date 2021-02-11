import { ConditionGetAvgBaseWeight, ConditonGetBaseWeight } from './../../../../shared/models/conditionFilter/ConditionFilter';
import { FilterDataComponent } from './../filter-data/filter-data.component';
import { ConditionFilter } from 'src/app/shared/models/conditionFilter/ConditionFilter';
import { AvgPbar } from './../../models/response-data';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatSort, MatTableDataSource, PageEvent, Sort, MatTabChangeEvent, MatStepper } from '@angular/material';
import { BasePrice, BaseWeight } from '../../models/response-data';
import { RebaseServiceService } from '../../../../core/service/rebase/rebase-service.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { AvgBaseWeightReq, ProvinceRes, RequestParam } from '../../models/request-param';
import * as FileSaver from 'file-saver';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-view-stage-third',
  templateUrl: './view-stage-third.component.html',
  styleUrls: ['./view-stage-third.component.scss']
})
export class ViewStageThirdComponent implements OnInit {
  @ViewChild("pbar", { static: false }) pbarFilter: FilterDataComponent;
  @ViewChild("wbar", { static: false }) wbarFilter: FilterDataComponent;
  displayedColumns: string[] = ['0', '1', '2', '3', '4', '5'];
  columns: string[] = ['e.year_term', 'e.month_term', 'cpip.commodity_code', 'cpip.commodity_th_name',
    'cpip.commodity_level', 'e.weight'];
  columnsPBar: string[] = ['b.baseYear', 'cpip.commodityCode', 'cpip.commodityThName',
    'cpip.commodityLevel', 'averagePrice'];
  displayedColumnsPbar: string[] = ['0', '1', '2', '3', '4'];
  tabActive = 0;
  length = 100;
  pageSize = 10;
  pageIndex = 0;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  pageEvent: PageEvent = new PageEvent();
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  dataSource = new MatTableDataSource<BaseWeight>();
  dataSourcePbar = new MatTableDataSource<AvgPbar>();
  sortMap: Map<string, MatSort> = new Map<string, MatSort>();
  sortMapPbar: Map<string, MatSort> = new Map<string, MatSort>();
  condition = new ConditionFilter();
  conditionWbar = new ConditionFilter();
  requestFilter = new ConditionGetAvgBaseWeight();
  requestWbarFilter = new ConditonGetBaseWeight();
  colNames: string[] = ['e.year_term', 'e.month_term', 'cpip.commodity_code'];
  colOrders: string[] = ['asc', 'asc', 'asc'];
  colNamesPbar: string[] = ['b.baseYear', 'cpip.commodityCode'];
  colOrdersPbar: string[] = ['asc', 'asc'];
  @Input() provinceId: ProvinceRes;
  @Input() indexGroup: any;
  @Input() regionId: any;
  @Input() stepper: MatStepper;
  @Output() step = new EventEmitter<any>();
  @Output() stage = new EventEmitter<any>();
  @Input() stage40: number;

  province: ProvinceRes;
  @Input() filterProvinceControl: FormControl;
  avgBaseWeightReq = new AvgBaseWeightReq();
  constructor(
    private rebaseService: RebaseServiceService,
    private loading: NgxSpinnerService,
  ) {
    this.pageEvent.pageIndex = 0;
    this.pageEvent.pageSize = this.pageSize;
    this.pageEvent.length = this.length;
    this.condition.commodityCode = true;
    this.condition.commodityName = true;
    this.condition.btnSearch = true;
    // this.conditionWbar.yearTerm = true;
    // this.conditionWbar.monthTerm = true;
    // this.conditionWbar.commodityCode = true;
    // this.conditionWbar.commodityName = true;
    // this.conditionWbar.btnSearch = true;

  }

  ngOnInit() {

  }

  public preparePage(): void {
    this.avgBaseWeightReq.indexGroup = this.indexGroup === null ? null : this.indexGroup.paramId;
    if (this.filterProvinceControl.value) {
      this.province = this.filterProvinceControl.value
      this.avgBaseWeightReq.provinceId = this.province === null ? null : this.province.provinceId;;
    } else {
      this.avgBaseWeightReq.regionId = this.regionId === null ? null : this.regionId.regionId;;
    }
    this.sort = new MatSort();
    this.sort.active = '0';
    this.sort.direction = 'asc';
    this.pbarFilter.conditionInput(this.condition);
    this.getPBar(this.pageEvent, this.requestFilter, this.avgBaseWeightReq);
  }

  goNext() {
    this.step.emit(this.stepper)
  }

  public getBaseWeight(pageEvent: PageEvent, requestWbarFilter: ConditonGetBaseWeight, avgBaseWeightReq: AvgBaseWeightReq): void {
    const requestParam: RequestParam = new RequestParam();
    requestParam.page = pageEvent.pageIndex;
    requestParam.size = pageEvent.pageSize;
    this.sortMap.forEach(k => {
      const colName = this.columns[this.displayedColumns.indexOf(k.active)];
      this.colNames.push(colName);
      let direction: string = k.direction;
      if (!direction) {
        direction = 'asc';
      }
      this.colOrders.push(direction);
    });
    requestParam.sortColumns = this.colNames;
    requestParam.sortOrders = this.colOrders;
    requestParam.condition = requestWbarFilter;
    requestParam.avgBaseWeightReq = avgBaseWeightReq;
    console.log('reqqqqqq ==== ', requestParam);


    this.loading.show();
    this.rebaseService.getBaseWeight(requestParam).subscribe(
      (resp) => {
        this.dataSource = new MatTableDataSource<BaseWeight>(resp.data);
        this.length = resp.dataSize;
        this.pageEvent.length = resp.dataSize;
        this.pageIndex = pageEvent.pageIndex;
        console.log(resp);
        this.loading.hide();
      }, (error) => {
        this.loading.hide();
        console.log(error);
      });
  }

  public getPBar(pageEvent: PageEvent, requestFilter: ConditionGetAvgBaseWeight, avgBaseWeightReq: AvgBaseWeightReq): void {
    const requestParam: RequestParam = new RequestParam();
    requestParam.page = pageEvent.pageIndex;
    requestParam.size = pageEvent.pageSize;
    this.sortMapPbar.forEach(k => {
      const colName = this.columnsPBar[this.displayedColumnsPbar.indexOf(k.active)];
      this.colNamesPbar.push(colName);
      let direction: string = k.direction;
      if (!direction) {
        direction = 'asc';
      }
      this.colOrdersPbar.push(direction);
    });
    requestParam.sortColumns = this.colNamesPbar;
    requestParam.sortOrders = this.colOrdersPbar;
    requestParam.condition = requestFilter;
    requestParam.avgBaseWeightReq = avgBaseWeightReq;
    this.loading.show();
    this.rebaseService.getAvgBaseWeight(requestParam).subscribe(
      (resp) => {
        this.dataSourcePbar = new MatTableDataSource<AvgPbar>(resp.data);
        this.length = resp.dataSize;
        this.pageEvent.length = resp.dataSize;
        this.pageIndex = pageEvent.pageIndex;
        console.log(resp);
        this.loading.hide();
      }, (error) => {
        this.loading.hide();
        console.log(error);
      });
  }

  sortChangeWbar(e: Sort) {
    this.colNames = [];
    this.colOrders = [];
    this.sort.active = e.active;
    this.sort.direction = e.direction;

    const direction: string = this.sort.direction;
    if (!direction) {
      this.sort.direction = 'asc';
    }
    const mySort: MatSort = new MatSort();
    mySort.active = this.sort.active;
    mySort.direction = this.sort.direction;
    this.sortMap.set(e.active, mySort);
    this.getBaseWeight(this.pageEvent, this.requestWbarFilter, this.avgBaseWeightReq);
  }

  sortChangePbar(e: Sort) {
    this.colNamesPbar = [];
    this.colOrdersPbar = [];
    this.sort.active = e.active;
    this.sort.direction = e.direction;

    const direction: string = this.sort.direction;
    if (!direction) {
      this.sort.direction = 'asc';
    }
    const mySort: MatSort = new MatSort();
    mySort.active = this.sort.active;
    mySort.direction = this.sort.direction;
    this.sortMapPbar.set(e.active, mySort);

    this.getPBar(this.pageEvent, this.requestFilter, this.avgBaseWeightReq);
  }

  pageChange(e: PageEvent): PageEvent {
    if (this.tabActive == 0) {
      this.getPBar(e, this.requestFilter, this.avgBaseWeightReq);
    } else if (this.tabActive == 1) {
      this.getBaseWeight(e, this.requestWbarFilter, this.avgBaseWeightReq);
    }
    return e;
  }

  export(): void {
    this.loading.show();
    this.rebaseService.exportBaseWeight(this.avgBaseWeightReq).subscribe(
      (res) => {
        const mediaType = 'application/octet-stream';
        const blob = new Blob([res], { type: mediaType });
        console.log('blob', blob);
        FileSaver.saveAs(blob, 'base_weight_' + new Date().toISOString() + '.csv');
        this.loading.hide();
      }, (error) => {
        this.loading.hide();
        console.log(error);
      }
    );
  }

  exportPbar() {
    this.loading.show();
    this.rebaseService.exportBasePriceBar(this.avgBaseWeightReq).subscribe(
      (res) => {
        const mediaType = 'application/octet-stream';
        const blob = new Blob([res], { type: mediaType });
        console.log('blob', blob);
        FileSaver.saveAs(blob, 'avg_base_price_' + new Date().toISOString() + '.xlsx');
        this.loading.hide();
      }, (error) => {
        this.loading.hide();
        console.log(error);
      }
    );
  }

  exportWeight() {
    console.log("exportWeight");
  }

  selectedTabChange(e: MatTabChangeEvent) {
    this.tabActive = e.index;
    this.pageEvent.pageIndex = 0;
    this.pageEvent.pageSize = this.pageSize;
    this.pageEvent.length = this.length;
    this.sort = new MatSort();
    this.sort.active = '0';
    this.sort.direction = 'asc';
    console.log(e);
    if (e.index == 0) {
      this.getPBar(this.pageEvent, this.requestFilter, this.avgBaseWeightReq);
    } else if (e.index == 1) {
      this.getBaseWeight(this.pageEvent, this.requestWbarFilter, this.avgBaseWeightReq);
    }
  }

  onSearchGetPBar(status) {
    if (status) {
      let filter = this.pbarFilter.getConditionFilter();
      this.requestFilter.commodityCode = filter.commodityCode;
      this.requestFilter.commodityName = filter.commodityName;
      this.pageEvent.pageIndex = 0;
      this.getPBar(this.pageEvent, this.requestFilter, this.avgBaseWeightReq);
    }
  }

  onSearch(status) {
    console.log("status", status);
    if (status) {
      let filter = this.wbarFilter.getConditionFilter();
      this.requestWbarFilter.commodityCode = filter.commodityCode;
      this.requestWbarFilter.commodityName = filter.commodityName;
      this.requestWbarFilter.monthTerm = filter.monthTerm;
      this.requestWbarFilter.yearTerm = filter.yearTerm;
      this.pageEvent.pageIndex = 0;
      this.getBaseWeight(this.pageEvent, this.requestWbarFilter, this.avgBaseWeightReq);
    }
  }

  changeStage() {
    this.stage.emit(5.32);
  }

}
