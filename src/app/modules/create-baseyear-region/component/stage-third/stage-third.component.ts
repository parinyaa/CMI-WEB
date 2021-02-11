import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { MatTableDataSource, MatTabChangeEvent, PageEvent, MatSort, MatPaginator, Sort } from '@angular/material';
import { BaseWeight, AvgPbar, BaseIndex } from 'src/app/modules/create-info-baseyear/models/response-data';
import { ParamRequest } from 'src/app/shared/models/createBaseYear/InquireRegionStep';
import { FilterDataComponent } from 'src/app/modules/create-info-baseyear/component/filter-data/filter-data.component';
import { ConditionFilter, ConditionGetAvgBaseWeight, ConditonGetBaseWeight, ConditionGetBaseIndex } from 'src/app/shared/models/conditionFilter/ConditionFilter';
import { AvgBaseWeightReq, RequestParam } from 'src/app/modules/create-info-baseyear/models/request-param';
import { NgxSpinnerService } from 'ngx-spinner';
import { RebaseServiceService } from 'src/app/core/service/rebase/rebase-service.service';
import * as FileSaver from 'file-saver';
@Component({
  selector: 'app-stage-third',
  templateUrl: './stage-third.component.html',
  styleUrls: ['./stage-third.component.scss']
})
export class StageThirdComponent implements OnInit {
  @Input()
  stepNo: number;
  @Input()
  paramRequest: ParamRequest;
  @Output() step = new EventEmitter<any>();
  @Output() stage = new EventEmitter<any>();
  @ViewChild(FilterDataComponent, { static: false }) filterDataComponent: FilterDataComponent;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  displayedColumns: string[] = ['0', '1', '2', '3', '4', '5'];
  columns: string[] = ['e.year_term', 'e.month_term', 'cpa.commodity_code', 'cpa.commodity_th_name',
    'cpa.commodity_level', 'e.index_value'];
  colNames: string[] = ['e.year_term', 'e.month_term', 'cpa.commodity_code'];
  colOrders: string[] = ['asc', 'asc', 'asc'];
  length = 100;
  pageSize = 25;
  pageIndex = 0;
  pageSizeOptions: number[] = [10, 50, 100, 500];
  pageEvent: PageEvent = new PageEvent();
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  dataSource = new MatTableDataSource<BaseIndex>();
  sortMap: Map<string, MatSort> = new Map<string, MatSort>();
  condition = new ConditionFilter();
  requestFilter = new ConditionGetBaseIndex();
  avgBaseWeightReq = new AvgBaseWeightReq();
  constructor(
    private loading: NgxSpinnerService,
    private rebaseService: RebaseServiceService
  ) { }

  ngOnInit() {
  }

  preparePage(): void {
    this.sort = new MatSort();
    this.sort.active = '0';
    this.sort.direction = 'asc';
    this.pageEvent.pageIndex = this.pageIndex;
    this.pageEvent.pageSize = this.pageSize;
    this.pageEvent.length = this.length;
    this.paginator.firstPage();
    this.avgBaseWeightReq.indexGroup = this.paramRequest ? this.paramRequest.indexGroup : null;
    this.avgBaseWeightReq.regionId = this.paramRequest ? this.paramRequest.regionId : null;
    this.avgBaseWeightReq.provinceId = null;
    this.requestFilter = new ConditionGetBaseIndex();
    this.setConditionFilter();
    this.getBaseIndex(this.pageEvent, this.requestFilter, this.avgBaseWeightReq);
  }

  setConditionFilter() {
    this.condition.commodityCode = true;
    this.condition.commodityName = true;
    this.condition.btnSearch = true;
    this.filterDataComponent.conditionInput(this.condition);
  }

  public getBaseIndex(pageEvent: PageEvent, requestFilter: ConditionGetBaseIndex, avgBaseWeightReq: AvgBaseWeightReq): void {
    const requestParam: RequestParam = new RequestParam()
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
    requestParam.page = pageEvent.pageIndex;
    requestParam.sortColumns = this.colNames;
    requestParam.sortOrders = this.colOrders;
    requestParam.condition = requestFilter;
    requestParam.avgBaseWeightReq = avgBaseWeightReq;
    this.loading.show();
    this.rebaseService.getBaseIndex(requestParam).subscribe(
      (resp) => {
        this.dataSource = new MatTableDataSource<BaseIndex>(resp.data);
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

  pageChange(e: PageEvent): PageEvent {
    console.log(e);
    this.pageEvent = e;
    this.getBaseIndex(this.pageEvent, this.requestFilter, this.avgBaseWeightReq);
    return e;
  }

  onSearch(status) {
    if (status) {
      let filter = this.filterDataComponent.getConditionFilter();
      this.requestFilter.yearTerm = filter.baseYear;
      this.requestFilter.monthTerm = filter.monthTerm;
      this.requestFilter.commodityCode = filter.commodityCode;
      this.requestFilter.commodityName = filter.commodityName;
      this.pageEvent.pageIndex = 0;
      this.paginator.firstPage();
      this.getBaseIndex(this.pageEvent, this.requestFilter, this.avgBaseWeightReq);
    }
  }

  export(): void {
    this.loading.show();
    this.rebaseService.exportBaseIndex(this.avgBaseWeightReq).subscribe(
      (res) => {
        const mediaType = 'application/octet-stream';
        const blob = new Blob([res], { type: mediaType });
        console.log('blob', blob);
        FileSaver.saveAs(blob, 'base_index_' + new Date().toISOString() + '.csv');
        this.loading.hide();
      }, (error) => {
        this.loading.hide();
        console.log(error);
      }
    );
  }

  sortChange(e: Sort) {
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
    this.getBaseIndex(this.pageEvent, this.requestFilter, this.avgBaseWeightReq);
  }

  nextStep() {
    this.step.emit();
  }

  nextStage() {
    this.stage.emit(5.3);
  }
}
