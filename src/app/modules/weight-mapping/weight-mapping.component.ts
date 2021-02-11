import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, PageEvent, MatPaginator, MatDialog } from '@angular/material';
import { WeightMappingService } from 'src/app/core/service/weight-mapping/weight-mapping.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { InquiryWeightMaoppingRequest, DeletedWeightMappingRequest, UpdateWeightMappingRequest } from 'src/app/shared/models/weight/request/WeightMapping';
import { DialogSettingMappingComponent } from './component/dialog-setting-mapping/dialog-setting-mapping.component';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';

@Component({
  selector: 'app-weight-mapping',
  templateUrl: './weight-mapping.component.html',
  styleUrls: ['./weight-mapping.component.scss']
})
export class WeightMappingComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild("succussSwal", { static: false }) succussSwal: SwalComponent
  weightCode: string = "";
  weightName: string = "";
  commodityCode: string = "";
  commodityName: string = "";
  displayedColumns: string[] = ['weightCode', 'weightName', 'commodityCode', 'commodityName', 'action'];
  dataSource = new MatTableDataSource();
  pageEvent = new PageEvent();
  length = 0;
  pageSize = 10;
  pageSizeOptions = [5, 10, 100, 500, 100];
  constructor(
    private weightMappingService: WeightMappingService,
    private loading: NgxSpinnerService,
    private dialog: MatDialog
  ) {
    this.pageEvent.pageIndex = 0;
    this.pageEvent.pageSize = 10;
  }

  ngOnInit() {
    this.inquiryWeightMapping();
  }

  inquiryWeightMapping() {
    this.loading.show();
    let request = new InquiryWeightMaoppingRequest();
    request.weightCode = this.weightCode;
    request.weightDesc = this.weightName;
    request.commodityName = this.commodityName;
    request.commodityCode = this.commodityCode;
    this.weightMappingService.inquiryWeightMapping(request, this.pageEvent.pageIndex, this.pageEvent.pageSize).subscribe((res) => {
      console.log(res);
      this.dataSource = new MatTableDataSource(res.content);
      this.length = res.totalRecords;
      this.loading.hide();
    }, (error) => {
      this.loading.hide();
    })
  }

  onSearch() {
    this.paginator.firstPage();
    this.inquiryWeightMapping();
  }

  pageChange(e: PageEvent) {
    this.pageEvent = e;
    this.inquiryWeightMapping();
    return e;
  }

  openDialog(element): void {
    const dialogRef = this.dialog.open(DialogSettingMappingComponent, {
      width: '80%',
      data: element
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.clearFilter();
        this.onSearch();
      }
    });
  }

  onDeleted(element) {
    let request = new DeletedWeightMappingRequest();
    request.weightMappingId = element.weightMappingId;
    this.weightMappingService.deletedWeightMapping(request).toPromise().then((res) => {
      this.succussSwal.title = "ลบข้อมูลสำเร็จ"
      this.succussSwal.show();
      this.clearFilter();
      this.onSearch();
    })
  }

  clearFilter() {
    this.weightCode = "";
    this.weightName = "";
    this.commodityName = "";
    this.commodityCode = "";
  }
}
