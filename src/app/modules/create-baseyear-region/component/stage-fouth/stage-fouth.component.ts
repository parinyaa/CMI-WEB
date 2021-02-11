import { Component, OnInit, ViewChild, Input, EventEmitter, Output } from '@angular/core';
import { FilterDataComponent } from 'src/app/modules/create-info-baseyear/component/filter-data/filter-data.component';
import { PageEvent, MatSort, MatTableDataSource, MatPaginator, Sort, MatTabChangeEvent } from '@angular/material';
import { BaseIndex, RebaseIndex, AvgBaseIndex } from 'src/app/modules/create-info-baseyear/models/response-data';
import { ConditionFilter, ConditionGetBaseIndex, ConditionGetAvgBaseIndex, ConditionGetRebaseIndex } from 'src/app/shared/models/conditionFilter/ConditionFilter';
import { AvgBaseWeightReq, RequestParam } from 'src/app/modules/create-info-baseyear/models/request-param';
import { NgxSpinnerService } from 'ngx-spinner';
import { RebaseServiceService } from 'src/app/core/service/rebase/rebase-service.service';
import { ParamRequest } from 'src/app/shared/models/createBaseYear/InquireRegionStep';
import * as FileSaver from 'file-saver';
@Component({
  selector: 'app-stage-fouth',
  templateUrl: './stage-fouth.component.html',
  styleUrls: ['./stage-fouth.component.scss']
})
export class StageFouthComponent implements OnInit {
  @Input()
  stepNo: number;
  @Input()
  paramRequest: ParamRequest;
  @Output() step = new EventEmitter<any>();
  @Output() stage = new EventEmitter<any>();
  @ViewChild("paginator1", { static: true }) paginator1: MatPaginator;
  @ViewChild("paginator2", { static: true }) paginator2: MatPaginator;
  @ViewChild("avgIndex", { static: false }) avgIndexFilter: FilterDataComponent;
  @ViewChild("rebaseIndex", { static: false }) rebaseIndexFilter: FilterDataComponent;
  displayedColumns: string[] = ['0', '1', '2', '3', '4', '5', '6'
    , '7', '8', '9', '10', '11'];
  columns: string[] = ['e.year_term', 'e.month_term', ' e.commodity_code',
    ' e.commodity_level', 'e.index_value', 'e.change_mom ', 'e.change_aoa', 'e.change_yoy',
    'e.base_index_value', ' e.change_base_mom', ' e.change_base_aoa', 'e.change_base_yoy'];
  displayedColumnsAvgI: string[] = ['0', '1', '2', '3', '4'];
  columnsAvgI: string[] = ['b.baseYear', 'cpip.commodityCode', 'cpip.commodityThName', 'commodityLevel', 'averageIndex'];
  length = 100;
  pageSize = 10;
  tabActive = 0;
  pageIndex = 0;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  pageEvent: PageEvent = new PageEvent();
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  dataSource = new MatTableDataSource<RebaseIndex>();
  dataSourceAvgI = new MatTableDataSource<AvgBaseIndex>();
  sortMap: Map<string, MatSort> = new Map<string, MatSort>();
  sortMap2: Map<string, MatSort> = new Map<string, MatSort>();
  conditionAvgIndex = new ConditionFilter();
  requestFilterAvgIndex = new ConditionGetAvgBaseIndex();
  conditionRebaseIndex = new ConditionFilter();
  requestFilterRebaseIndex = new ConditionGetRebaseIndex();
  colNamesAvgI: string[] = ['cpip.commodityCode'];
  colOrdersAvgI: string[] = ['asc'];
  colNamesRebaseIndex: string[] = ['e.year_term', 'e.month_term', ' e.commodity_code'];
  colOrdersRebaseIndex: string[] = ['asc', 'asc', 'asc'];
  avgBaseWeightReq = new AvgBaseWeightReq();
  constructor(
    private loading: NgxSpinnerService,
    private rebaseService: RebaseServiceService
  ) { }

  ngOnInit() {
  }

  preparePage(): void {
    console.log("StageFifthComponent")
    this.sort = new MatSort();
    this.sort.active = '2';
    this.sort.direction = 'asc';
    this.pageEvent.pageIndex = this.pageIndex;
    this.pageEvent.pageSize = this.pageSize;
    this.pageEvent.length = this.length;
    this.requestFilterAvgIndex = new ConditionGetAvgBaseIndex();
    this.setConditionFilterAvgBaseIndex();
    this.avgBaseWeightReq.indexGroup = this.paramRequest ? this.paramRequest.indexGroup : null;
    this.avgBaseWeightReq.regionId = this.paramRequest ? this.paramRequest.regionId : null;
    this.avgBaseWeightReq.provinceId = null;
    this.getAvgBaseIndex(this.pageEvent, this.requestFilterAvgIndex, this.avgBaseWeightReq);
  }

  setConditionFilterAvgBaseIndex() {
    this.conditionAvgIndex.commodityCode = true;
    this.conditionAvgIndex.commodityName = true;
    this.conditionAvgIndex.btnSearch = true;
    this.avgIndexFilter.conditionInput(this.conditionAvgIndex);
  }

  setConditionFilterRebaseIndex() {
    this.conditionRebaseIndex.yearTerm = true;
    this.conditionRebaseIndex.monthTerm = true;
    this.conditionRebaseIndex.commodityCode = true;
    this.conditionRebaseIndex.commodityName = true;
    this.conditionRebaseIndex.btnSearch = true;
    this.rebaseIndexFilter.conditionInput(this.conditionRebaseIndex);
  }



  public getAvgBaseIndex(pageEvent: PageEvent, requestFilterAvgIndex: ConditionGetAvgBaseIndex, avgBaseWeightReq: AvgBaseWeightReq): void {
    const requestParam: RequestParam = new RequestParam();
    requestParam.page = pageEvent.pageIndex;
    requestParam.size = pageEvent.pageSize;
    this.sortMap.forEach(k => {
      const colName = this.columnsAvgI[this.displayedColumnsAvgI.indexOf(k.active)];
      this.colNamesAvgI.push(colName);
      let direction: string = k.direction;
      if (!direction) {
        direction = 'asc';
      }
      this.colOrdersAvgI.push(direction);
    });
    requestParam.sortColumns = this.colNamesAvgI;
    requestParam.sortOrders = this.colOrdersAvgI;
    requestParam.condition = requestFilterAvgIndex;
    requestParam.avgBaseWeightReq = avgBaseWeightReq;
    this.loading.show();
    this.rebaseService.getAvgBaseIndex(requestParam).subscribe(
      (resp) => {
        this.dataSourceAvgI = new MatTableDataSource<AvgBaseIndex>(resp.data);
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

  public getRebaseIndex(pageEvent: PageEvent, requestFilterRebaseIndex: ConditionGetRebaseIndex, avgBaseWeightReq: AvgBaseWeightReq): void {
    const requestParam: RequestParam = new RequestParam();
    requestParam.page = pageEvent.pageIndex;
    requestParam.size = pageEvent.pageSize;
    this.sortMap2.forEach(k => {
      const colName = this.columns[this.displayedColumns.indexOf(k.active)];
      this.colNamesRebaseIndex.push(colName);
      let direction: string = k.direction;
      if (!direction) {
        direction = 'asc';
      }
      this.colOrdersRebaseIndex.push(direction);
    });
    requestParam.sortColumns = this.colNamesRebaseIndex;
    requestParam.sortOrders = this.colOrdersRebaseIndex;
    requestParam.condition = requestFilterRebaseIndex;
    requestParam.avgBaseWeightReq = avgBaseWeightReq;
    this.loading.show();
    this.rebaseService.getRebaseIndex(requestParam).subscribe(
      (resp) => {
        this.dataSource = new MatTableDataSource<RebaseIndex>(resp.data);
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
      this.paginator1.firstPage();
      this.requestFilterAvgIndex = new ConditionGetAvgBaseIndex();
      this.getAvgBaseIndex(this.pageEvent, this.requestFilterAvgIndex, this.avgBaseWeightReq);
    } else if (e.index == 1) {
      this.paginator2.firstPage();
      this.requestFilterRebaseIndex = new ConditionGetRebaseIndex();
      this.setConditionFilterRebaseIndex();
      this.getRebaseIndex(this.pageEvent, this.requestFilterRebaseIndex, this.avgBaseWeightReq);
    }
  }

  pageChange(e: PageEvent): PageEvent {
    this.pageEvent = e;
    if (this.tabActive == 0) {
      this.getAvgBaseIndex(this.pageEvent, this.requestFilterAvgIndex, this.avgBaseWeightReq);
    } else if (this.tabActive == 1) {
      this.getRebaseIndex(e, this.requestFilterRebaseIndex, this.avgBaseWeightReq);
    }
    return e;
  }

  sortChangeAvgI(e: Sort) {
    this.sort.active = e.active;
    this.sort.direction = e.direction;
    const direction: string = this.sort.direction;
    if (!direction) {
      this.sort.direction = 'asc';
    }
    const mySort: MatSort = new MatSort();
    mySort.active = this.sort.active;
    mySort.direction = this.sort.direction;
    if (this.tabActive == 0) {
      this.colNamesAvgI = [];
      this.colOrdersAvgI = [];
      this.sortMap.set(e.active, mySort);
      this.getAvgBaseIndex(this.pageEvent, this.requestFilterAvgIndex, this.avgBaseWeightReq);
    } else if (this.tabActive == 1) {
      this.colNamesRebaseIndex = [];
      this.colOrdersRebaseIndex = [];
      this.sortMap2.set(e.active, mySort);
      this.getRebaseIndex(this.pageEvent, this.requestFilterRebaseIndex, this.avgBaseWeightReq);
    }
  }

  onSearchAvgBaseIndex(status) {
    console.log(status);
    if (status) {
      let filter = this.avgIndexFilter.getConditionFilter();
      this.requestFilterAvgIndex.commodityCode = filter.commodityCode;
      this.requestFilterAvgIndex.commodityName = filter.commodityName;
      this.pageEvent.pageIndex = 0;
      this.paginator1.firstPage();
      this.getAvgBaseIndex(this.pageEvent, this.requestFilterAvgIndex, this.avgBaseWeightReq);
    }
  }

  onSearchRebaseIndex(status) {
    if (status) {
      let filter = this.rebaseIndexFilter.getConditionFilter();
      this.requestFilterRebaseIndex.yearTerm = filter.yearTerm;
      this.requestFilterRebaseIndex.monthTerm = filter.monthTerm;
      this.requestFilterRebaseIndex.commodityCode = filter.commodityCode;
      this.requestFilterRebaseIndex.commodityName = filter.commodityName;
      this.pageEvent.pageIndex = 0;
      this.getRebaseIndex(this.pageEvent, this.requestFilterRebaseIndex, this.avgBaseWeightReq);
    }
  }

  exportIndexBaseYear(): void {
    this.loading.show();
    this.rebaseService.exportIndexBaseYear(this.avgBaseWeightReq).subscribe(
      (res) => {
        const mediaType = 'application/octet-stream';
        const blob = new Blob([res], { type: mediaType });
        console.log('blob', blob);
        FileSaver.saveAs(blob, 'base_index_' + new Date().toISOString() + '.xlsx');
        this.loading.hide();
      }, (error) => {
        this.loading.hide();
        console.log(error);
      }
    );
  }

  export(): void {
    this.loading.show();
    this.rebaseService.exportRebaseIndex(this.avgBaseWeightReq).subscribe(
      (res) => {
        const mediaType = 'application/octet-stream';
        const blob = new Blob([res], { type: mediaType });
        console.log('blob', blob);
        FileSaver.saveAs(blob, 're-base_index_' + new Date().toISOString() + '.csv');
        this.loading.hide();
      }, (error) => {
        this.loading.hide();
        console.log(error);
      }
    );
  }

  nextStep() {
    this.step.emit();
  }

  nextStage() {
    this.stage.emit(5.4);
  }


}
