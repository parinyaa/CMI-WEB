import {Component, OnInit, ViewChild} from '@angular/core';
import {MatSort, MatTableDataSource, PageEvent, Sort} from '@angular/material';
import {CpaIndex, CpaWeight} from '../../models/response-data';
import {RebaseServiceService} from '../../../../core/service/rebase/rebase-service.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {RequestParam} from '../../models/request-param';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-view-stage-seventh',
  templateUrl: './view-stage-seventh.component.html',
  styleUrls: ['./view-stage-seventh.component.scss']
})
export class ViewStageSeventhComponent implements OnInit {


  displayedColumns: string[] = ['0', '1', '2', '3', '4', '5','6'];
  columns: string[] = ['yearTerm', 'monthTerm','commodityCode' ,'commodityThName', 'commodityLevel',
    'indexValue', 'baseIndexValue'];
  length = 100;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  pageEvent: PageEvent = new PageEvent();
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  dataSource = new MatTableDataSource<CpaIndex>();
  sortMap: Map<string, MatSort> = new Map<string, MatSort>();

  constructor(
    private rebaseService: RebaseServiceService,
    private loading: NgxSpinnerService,
  ) {
    this.pageEvent.pageIndex = 0;
    this.pageEvent.pageSize = this.pageSize;
    this.pageEvent.length = this.length;
  }

  ngOnInit() {

  }

  public preparePage(): void {
    this.sort = new MatSort();
    this.sort.active = '0';
    this.sort.direction = 'asc';
    this.getCpaIndex(this.pageEvent);
  }

  public getCpaIndex(pageEvent: PageEvent): void {
    const requestParam: RequestParam = new RequestParam();
    requestParam.page = pageEvent.pageIndex;
    requestParam.size = pageEvent.pageSize;
    const colNames: string[] = [];
    const colOrders: string[] = [];
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
    this.loading.show();
    this.rebaseService.getCpaIndex(requestParam).subscribe(
      (resp) => {
        this.dataSource = new MatTableDataSource<CpaIndex>(resp.data);
        this.length = resp.dataSize;
        this.pageEvent.length = resp.dataSize;
        console.log(resp);
        this.loading.hide();
      }, (error) => {
        this.loading.hide();
        console.log(error);
      });
  }

  sortChange(e: Sort) {
    console.log(e);
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

    this.getCpaIndex(this.pageEvent);
  }
  pageChange(e: PageEvent): PageEvent {
    console.log(e);
    this.getCpaIndex(e);
    return e;
  }

  export(): void {
    this.loading.show();
    this.rebaseService.exportCpaIndex().subscribe(
      (res) => {
        const mediaType = 'application/octet-stream';
        const blob = new Blob([res], { type: mediaType });
        console.log('blob', blob);
        FileSaver.saveAs(blob, 'cpa_index_' + new Date().toISOString() + '.csv');
        this.loading.hide();
      }, (error) => {
        this.loading.hide();
        console.log(error);
      }
    );
  }

}
