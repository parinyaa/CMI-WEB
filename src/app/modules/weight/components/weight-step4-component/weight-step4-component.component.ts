import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { MatTableDataSource, PageEvent } from '@angular/material';
import { NgxSpinnerService } from 'ngx-spinner';
import { WeightService } from 'src/app/core/service/weight/weight.service';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { CalculateWeightNextStepRequest } from 'src/app/shared/models/weight/request/CalculateWeightNextStepRequest.model';

@Component({
  selector: 'app-weight-step4-component',
  templateUrl: './weight-step4-component.component.html',
  styleUrls: ['./weight-step4-component.component.scss']
})
export class WeightStep4ComponentComponent implements OnInit {

  @ViewChild('warningSwal', { static: false }) warningSwal: SwalComponent;

  @Input() weight;
  @Output() changeTabEvent = new EventEmitter<any>();
  @Output() changeWeightEvent = new EventEmitter<any>();

  page = 0;
  size = 100;
  index = 0;
  length = 0;
  pageSize = 100;
  pageSizeOptions: number[] = [5, 10, 25, 100, 500, 1000];
  pageEvent: PageEvent = new PageEvent;
  checkBaseYear = false;

  displayedColumnsWeightCPA: string[] = ['weightCode', 'weightSubcode', 'description', 'commodityCode', 'commodityName', 'weight'];
  dataSource = new MatTableDataSource();

  constructor(
    private loading: NgxSpinnerService,
    private weightService: WeightService,
    private calculateWeightNextStepRequest: CalculateWeightNextStepRequest,
  ) { }

  ngOnInit() {
    this.getWeightCPAData();
  }

  pageChange(e: PageEvent): PageEvent {
    this.page = e.pageIndex;
    this.size = e.pageSize;
    this.getWeightCPAData();
    return e;
  }

  getWeightCPAData() {
    this.loading.show();
    this.weightService.getTrWeightCPAByWeightId(this.weight.weightId, this.page, this.size).subscribe((res) => {
      if (!res.empty) {
        if (res.content[0].weightData.weightId.baseYear.stepNo == 4.0) {
          this.checkBaseYear = true;
        }
        this.length = res.totalElements;
        this.dataSource = new MatTableDataSource(res.content);
      }
      this.loading.hide();
    }, (error) => {
      this.loading.hide();
    });
  }

  checkNextStep(step) {
    this.warningSwal.title = "คุณต้องการไปขั้นตอนแก้ไข<br />น้ำหนักใช่หรือไม่";
    this.warningSwal.show().then((result) => {
      if (result.value) {
        this.callNextStep(step);
      }
    });
  }

  callNextStep(step) {
    this.calculateWeightNextStepRequest.stepId = step;
    this.calculateWeightNextStepRequest.weightId = this.weight.weightId
    this.loading.show();
    this.weightService.calculateWeightNextStep(this.calculateWeightNextStepRequest).subscribe((res) => {
      this.loading.hide();
      this.weight = res;
      this.changeTabEvent.emit();
      this.changeWeightEvent.emit(res);
    },
      (error) => {
        this.loading.hide();
      });
  }

}
