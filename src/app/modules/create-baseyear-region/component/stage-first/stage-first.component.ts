import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { MatTableDataSource, PageEvent, MatSort, MatPaginator } from '@angular/material';
import { ConditionGetAvgBaseWeight, ConditionFilter } from 'src/app/shared/models/conditionFilter/ConditionFilter';
import { AvgBaseWeightReq, RequestParam } from 'src/app/modules/create-info-baseyear/models/request-param';
import { NgxSpinnerService } from 'ngx-spinner';
import { RebaseServiceService } from 'src/app/core/service/rebase/rebase-service.service';
import { AvgBaseWeight } from 'src/app/modules/create-info-baseyear/models/response-data';
import { FilterDataComponent } from 'src/app/modules/create-info-baseyear/component/filter-data/filter-data.component';
import { ParamRequest } from 'src/app/shared/models/createBaseYear/InquireRegionStep';
import * as FileSaver from 'file-saver';
import { RegionStepService } from 'src/app/core/service/regionStep/region-step.service';
@Component({
  selector: 'app-stage-first',
  templateUrl: './stage-first.component.html',
  styleUrls: ['./stage-first.component.scss']
})
export class StageFirstComponent implements OnInit {
  @Input()
  stepNo: number;
  @Input()
  paramRequest: ParamRequest;
  @ViewChild(FilterDataComponent, { static: true }) filterDataComponent: FilterDataComponent
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @Output() step = new EventEmitter<any>();
  @Output() stage = new EventEmitter<any>();
  displayedColumns: string[] = ['0', '1', '2', '3', '4', '5'];
  columns: string[] = ['baseYear', 'cpip.commodityCode', 'cpip.commodityThName',
    'cpip.commodityLevel', 'averageWeight', 'averagePrice'];
  dataSource = new MatTableDataSource();
  sortMap: Map<string, MatSort> = new Map<string, MatSort>();
  length = 0;
  pageEvent = new PageEvent();
  condition = new ConditionFilter();
  requestFilter = new ConditionGetAvgBaseWeight();
  avgBaseWeightReq = new AvgBaseWeightReq();
  pageSize = 25
  pageIndex = 0;
  pageSizeOptions: number[] = [10, 50, 100, 500];
  constructor(
    private loading: NgxSpinnerService,
    private rebaseService: RebaseServiceService,
    private regionStepService: RegionStepService
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
    this.paginator.firstPage();
    this.condition.commodityCode = true;
    this.condition.commodityName = true;
    this.condition.btnSearch = true;
    this.filterDataComponent.conditionInput(this.condition);
    console.log("paramRequest", this.paramRequest);
    this.avgBaseWeightReq.indexGroup = this.paramRequest ? this.paramRequest.indexGroup : null;
    this.avgBaseWeightReq.regionId = this.paramRequest ? this.paramRequest.regionId : null;
    this.avgBaseWeightReq.provinceId = null;
    this.getAvgBaseWeight(this.pageEvent, this.requestFilter, this.avgBaseWeightReq);
  }

  public getAvgBaseWeight(pageEvent: PageEvent, requestFilter: ConditionGetAvgBaseWeight, avgBaseWeightReq: AvgBaseWeightReq): void {
    const requestParam: RequestParam = new RequestParam();
    requestParam.page = pageEvent.pageIndex;
    requestParam.size = pageEvent.pageSize;
    const colNames: string[] = ['cpip.commodityCode','cpip.commodityThName'];
    const colOrders: string[] = ['asc','asc'];
    this.sortMap.forEach(k => {
      const colName = this.columns[this.displayedColumns.indexOf(k.active)];
      colNames.push(colName);
      let direction: string = k.direction;
      if (!direction) {
        direction = 'asc';
      }
      colOrders.push(direction);
    });
    requestParam.sortColumns = colNames;
    requestParam.sortOrders = colOrders;
    requestParam.condition = requestFilter;
    requestParam.avgBaseWeightReq = avgBaseWeightReq;
    this.loading.show();
    this.rebaseService.getAvgBaseWeight(requestParam).subscribe(
      (resp) => {
        this.dataSource = new MatTableDataSource<AvgBaseWeight>(resp.data);
        this.length = resp.dataSize;
        this.loading.hide();
      }, (error) => {
        this.loading.hide();
        console.log(error);
      });
  }

  onSearch(status) {
    if (status) {
      let filter = this.filterDataComponent.getConditionFilter();
      this.requestFilter.baseYear = filter.baseYear;
      this.requestFilter.commodityCode = filter.commodityCode;
      this.requestFilter.commodityName = filter.commodityName;
      this.pageEvent.pageIndex = 0;
      this.getAvgBaseWeight(this.pageEvent, this.requestFilter, this.avgBaseWeightReq);
    }
  }

  pageChange(e: PageEvent) {
    this.pageEvent = e;
    this.getAvgBaseWeight(this.pageEvent, this.requestFilter, this.avgBaseWeightReq);
    return e;
  }

  export(): void {
    this.loading.show();
    this.rebaseService.exportAvgBaseWeight(this.avgBaseWeightReq).subscribe(
      (res) => {
        const blob = new Blob([res], { type: 'text/csv;charset=utf-8' });
        console.log('blob', blob);
        FileSaver.saveAs(blob, 'avg_base_weight_' + new Date().toISOString() + '.csv');
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
    this.stage.emit(5.1);
  }

  sortChange(e){

  }
}
