import { ConditionGetSoRebaseIndex } from './../../../../shared/models/conditionFilter/ConditionFilter';
import { ConditionFilter } from 'src/app/shared/models/conditionFilter/ConditionFilter';
import { FilterDataComponent } from './../filter-data/filter-data.component';
import {Component, OnInit, ViewChild} from '@angular/core';
import {MatSort, MatTableDataSource, PageEvent, Sort} from '@angular/material';
import {RebaseIndex} from '../../models/response-data';
import {RebaseServiceService} from '../../../../core/service/rebase/rebase-service.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {RequestParam} from '../../models/request-param';
import FileSaver from 'file-saver';

@Component({
  selector: 'app-view-stage-thirteen',
  templateUrl: './view-stage-thirteen.component.html',
  styleUrls: ['./view-stage-thirteen.component.scss']
})
export class ViewStageThirteenComponent implements OnInit {
  @ViewChild(FilterDataComponent, { static: false }) filterDataComponent: FilterDataComponent;
  displayedColumns: string[] = ['0', '1', '2', '3', '4', '5', '6'
    , '7', '8', '9', '10', '11'];
  columns: string[] = ['e.year_term ', 'e.month_term', 'e.commodity_code',
    'commodity_level', 'index_value', 'change_mom', 'change_aoa', 'change_yoy',
    'base_index_value', 'change_base_mom', 'change_base_aoa', 'change_base_yoy'];
  length = 100;
  pageSize = 10;
  pageIndex = 0;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  pageEvent: PageEvent = new PageEvent();
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  dataSource = new MatTableDataSource<RebaseIndex>();
  sortMap: Map<string, MatSort> = new Map<string, MatSort>();
  requestFilter = new ConditionGetSoRebaseIndex();
  condition = new ConditionFilter();
  colNames: string[] =  [];
  colOrders: string[] =  [];
  constructor(
    private rebaseService: RebaseServiceService,
    private loading: NgxSpinnerService,
  ) {
    this.pageEvent.pageIndex = 0;
    this.pageEvent.pageSize = this.pageSize;
    this.pageEvent.length = this.length;
    this.condition.btnSearch = true;
    this.condition.yearTerm = true;
    this.condition.monthTerm = true;
    this.condition.commodityCode = true;
    this.condition.commodityName = true;
  }

  ngOnInit() {

  }
  public preparePage(): void {
    this.sort = new MatSort();
    this.sort.active = '0';
    this.sort.direction = 'asc';
    this.sortMap.clear();
    this.colOrders =  ['asc','asc','asc'];
    this.colNames = ['e.year_term ', 'e.month_term', 'e.commodity_code'];
    this.filterDataComponent.conditionInput(this.condition);
    this.getRebaseIndex(this.pageEvent , this.requestFilter);
  }

  public getRebaseIndex(pageEvent: PageEvent ,requestFilter :ConditionGetSoRebaseIndex ): void {
    const requestParam: RequestParam = new RequestParam();
    requestParam.page = pageEvent.pageIndex;
    requestParam.size = pageEvent.pageSize;
    console.log("this.sortMap",this.sortMap);
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
    requestParam.condition = requestFilter;
    this.loading.show();
    this.rebaseService.getSopRebaseIndex(requestParam).subscribe(
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

    this.getRebaseIndex(this.pageEvent, this.requestFilter);
  }
  pageChange(e: PageEvent): PageEvent {
    console.log(e);
    this.getRebaseIndex(e, this.requestFilter);
    return e;
  }

  export(): void {
    this.loading.show();
    this.rebaseService.exportSopRebaseIndex().subscribe(
      (res) => {
        const mediaType = 'application/octet-stream';
        const blob = new Blob([res], { type: mediaType });
        console.log('blob', blob);
        FileSaver.saveAs(blob, 'sop-re-base_index_' + new Date().toISOString() + '.csv');
        this.loading.hide();
      }, (error) => {
        this.loading.hide();
        console.log(error);
      }
    );
  }

  onSearch(status){
    if(status){
      let filter = this.filterDataComponent.getConditionFilter();
      this.sortMap.clear();
      this.colOrders =  ['asc','asc','asc'];
      this.colNames = ['e.year_term ', 'e.month_term', 'e.commodity_code'];
      this.requestFilter.yearTerm = filter.yearTerm;
      this.requestFilter.monthTerm = filter.monthTerm;
      this.requestFilter.commodityCode = filter.commodityCode;
      this.requestFilter.commodityName= filter.commodityName;
      this.pageEvent.pageIndex = 0;
      this.getRebaseIndex(this.pageEvent ,  this.requestFilter);
    }
  }

}
