import { ConditionGetSopWeight } from './../../../../shared/models/conditionFilter/ConditionFilter';
import { ConditionFilter } from 'src/app/shared/models/conditionFilter/ConditionFilter';
import { FilterDataComponent } from './../filter-data/filter-data.component';
import {Component, OnInit, ViewChild} from '@angular/core';
import {MatSort, MatTableDataSource, PageEvent, Sort} from '@angular/material';
import {RebaseServiceService} from '../../../../core/service/rebase/rebase-service.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {RequestParam} from '../../models/request-param';
import FileSaver from 'file-saver';
import {SopWeight} from '../../models/response-data';

@Component({
  selector: 'app-view-stage-ten',
  templateUrl: './view-stage-ten.component.html',
  styleUrls: ['./view-stage-ten.component.scss']
})
export class ViewStageTenComponent implements OnInit {
  @ViewChild(FilterDataComponent, { static: false }) filterDataComponent: FilterDataComponent;
  displayedColumns: string[] = ['0', '1', '2', '3', '4','5'];
  columns: string[] = ['e.year_term', 'e.month_term', ' pms.commodity_code','pms.commodity_th_name',
    ' pms.commodity_level', ' e.weight'];
  length = 100;
  pageSize = 10;
  pageIndex = 0;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  pageEvent: PageEvent = new PageEvent();
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  dataSource = new MatTableDataSource<SopWeight>();
  sortMap: Map<string, MatSort> = new Map<string, MatSort>();
  condition = new ConditionFilter();
  requestFilter = new ConditionGetSopWeight();
  colNames = ['e.year_term', 'e.month_term', ' pms.commodity_code'];
  colOrders = ['asc','asc','asc'];
  constructor(
    private rebaseService: RebaseServiceService,
    private loading: NgxSpinnerService,
  ) {
    this.pageEvent.pageIndex = 0;
    this.pageEvent.pageSize = this.pageSize;
    this.pageEvent.length = this.length;
    this.condition.yearTerm = true;
    this.condition.monthTerm = true;
    this.condition.commodityCode = true;
    this.condition.commodityName = true;
    this.condition.btnSearch = true;
  }

  ngOnInit() {

  }

  public preparePage(): void {
    this.sort = new MatSort();
    this.sort.active = '0';
    this.sort.direction = 'asc';
    this.filterDataComponent.conditionInput(this.condition);
    this.getSopWeight(this.pageEvent , this.requestFilter);
  }

  public getSopWeight(pageEvent: PageEvent  , requestFilter :ConditionGetSopWeight): void {
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
    requestParam.condition = requestFilter;
    this.loading.show();
    this.rebaseService.getSopWeight(requestParam).subscribe(
      (resp) => {
        this.dataSource = new MatTableDataSource<SopWeight>(resp.data);
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
    this.getSopWeight(this.pageEvent , this.requestFilter);
  }
  pageChange(e: PageEvent): PageEvent {
    console.log(e);
    this.getSopWeight(e , this.requestFilter);
    return e;
  }

  export(): void {
    this.loading.show();
    this.rebaseService.exportSopWeight().subscribe(
      (res) => {
        const mediaType = 'application/octet-stream';
        const blob = new Blob([res], { type: mediaType });
        console.log('blob', blob);
        FileSaver.saveAs(blob, 'sop_weight' + new Date().toISOString() + '.csv');
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
      this.requestFilter.yearTerm = filter.yearTerm;
      this.requestFilter.monthTerm = filter.monthTerm;
      this.requestFilter.commodityCode = filter.commodityCode;
      this.requestFilter.commodityName= filter.commodityName;
      this.pageEvent.pageIndex = 0;
      this.getSopWeight(this.pageEvent ,  this.requestFilter);
    }
  }

}
