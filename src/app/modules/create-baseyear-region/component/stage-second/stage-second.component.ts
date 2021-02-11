import { Component, OnInit, Output, Input, EventEmitter, ViewChild } from '@angular/core';
import { MatTableDataSource, PageEvent, MatSort, Sort } from '@angular/material';
import { ParamRequest } from 'src/app/shared/models/createBaseYear/InquireRegionStep';
import { ConditonGetBaseWeight, ConditionFilter } from 'src/app/shared/models/conditionFilter/ConditionFilter';
import { FilterDataComponent } from 'src/app/modules/create-info-baseyear/component/filter-data/filter-data.component';
import { AvgBaseWeightReq, RequestParam } from 'src/app/modules/create-info-baseyear/models/request-param';
import { NgxSpinnerService } from 'ngx-spinner';
import { RebaseServiceService } from 'src/app/core/service/rebase/rebase-service.service';
import { BaseWeight } from 'src/app/modules/create-info-baseyear/models/response-data';
import * as FileSaver from 'file-saver';
@Component({
  selector: 'app-stage-second',
  templateUrl: './stage-second.component.html',
  styleUrls: ['./stage-second.component.scss']
})
export class StageSecondComponent implements OnInit {
  @Input()
  stepNo: number;
  @Input()
  paramRequest: ParamRequest;
  @Output() step = new EventEmitter<any>();
  @Output() stage = new EventEmitter<any>();
  @ViewChild("wbar", { static: false }) wbarFilter: FilterDataComponent;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  pageEvent = new PageEvent();
  displayedColumns: string[] = ['0', '1', '2', '3', '4', '5'];
  columns: string[] = ['e.year_term', 'e.month_term', 'cpip.commodity_code', 'cpip.commodity_th_name',
    'cpip.commodity_level', 'e.weight'];
  colNames: string[] = ['e.year_term', 'e.month_term', 'cpip.commodity_code'];
  colOrders: string[] = ['asc', 'asc', 'asc'];
  colNamesPbar: string[] = ['b.baseYear', 'cpip.commodityCode'];
  colOrdersPbar: string[] = ['asc', 'asc'];
  dataSource = new MatTableDataSource();
  requestWbarFilter = new ConditonGetBaseWeight();
  sortMap: Map<string, MatSort> = new Map<string, MatSort>();
  pageSize = 25
  pageIndex = 0;
  pageSizeOptions: number[] = [10, 50, 100, 500];
  length = 0;
  avgBaseWeightReq = new AvgBaseWeightReq();
  conditionWbar = new ConditionFilter();
  constructor(
    private loading: NgxSpinnerService,
    private rebaseService: RebaseServiceService
  ) { }

  ngOnInit() {
  }

  preparePage() {
    this.sort = new MatSort();
    this.sort.active = '2';
    this.sort.direction = 'asc';
    this.pageEvent.pageIndex = this.pageIndex;
    this.pageEvent.pageSize = this.pageSize;
    this.pageEvent.length = this.length;
    this.setConditionFilterWbar();
    this.avgBaseWeightReq.indexGroup = this.paramRequest ? this.paramRequest.indexGroup : null;
    this.avgBaseWeightReq.regionId = this.paramRequest ? this.paramRequest.regionId : null;
    this.avgBaseWeightReq.provinceId = null;
    this.getBaseWeight(this.pageEvent, this.requestWbarFilter, this.avgBaseWeightReq);
  }

  setConditionFilterWbar() {
    this.conditionWbar.yearTerm = true;
    this.conditionWbar.monthTerm = true;
    this.conditionWbar.commodityCode = true;
    this.conditionWbar.commodityName = true;
    this.conditionWbar.btnSearch = true;
    this.wbarFilter.conditionInput(this.conditionWbar);
  }

  nextStep() {
    this.step.emit();
  }

  nextStage() {
    this.stage.emit(5.2);
  }

  getBaseWeight(pageEvent: PageEvent, requestWbarFilter: ConditonGetBaseWeight, avgBaseWeightReq: AvgBaseWeightReq): void {
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
    this.loading.show();
    this.rebaseService.getBaseWeight(requestParam).subscribe(
      (resp) => {
        this.dataSource = new MatTableDataSource<BaseWeight>(resp.data);
        this.length = resp.dataSize;
        this.loading.hide();
      }, (error) => {
        this.loading.hide();
        console.log(error);
      });
  }

  onSearchGetWBar(status) {
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

  exportWbar(): void {
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

  pageChange(e: PageEvent): PageEvent {
    this.pageEvent = e;
    this.getBaseWeight(this.pageEvent, this.requestWbarFilter, this.avgBaseWeightReq);
    return e;
  }

}
