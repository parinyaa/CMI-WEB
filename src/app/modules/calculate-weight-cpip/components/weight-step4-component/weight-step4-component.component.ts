import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { MatTableDataSource, MatPaginator, PageEvent, MatDialog } from '@angular/material';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { WeightCalculatorService } from 'src/app/core/service/weightcalculator/weight-calculator.service';
import { WeightCpipService } from 'src/app/core/service/weightcpip/weight-cpip.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ParamService } from 'src/app/core/service/param/param.service';
import { UpdateStepRequest } from 'src/app/shared/models/weight/request/UpdateStepRequest.model';
import { DialogMappingWeightComponent } from '../dialog-mapping-weight/dialog-mapping-weight.component';
import { WeightMappingRequest } from 'src/app/shared/models/weight/request/WeightMappingRequest';

@Component({
  selector: 'app-weight-step4-component',
  templateUrl: './weight-step4-component.component.html',
  styleUrls: ['./weight-step4-component.component.scss']
})
export class WeightStep4ComponentComponent implements OnInit {

  @Input() weight;
  displayedColumnsMappingWeight: string[] = ['weightCode', 'description', 'countCpa','cpa', 'action'];
  displayedColumnsThailand: string[] = ['commodityCode', 'commodityThName', 'weight'];
  dataSource: MatTableDataSource<any>;
  paramInfoList  =  new Array();
  @ViewChild('warningSwal', { static: false }) warningSwal: SwalComponent;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  
  isEditStep = false;
  @Output() changeTabEvent = new EventEmitter<any>();
  @Output() changeWeightEvent = new EventEmitter<any>();
  originalWeight: any;
  currentStep;
  stepNo = 3;
  getweightId: any;
  sumWeightMapping = 0;
  dataSourceMapping = new MatTableDataSource();
  dataSourceThailand = new MatTableDataSource();

  pageSize = 25;
  pageIndex = 0;
  pageSizeOptions: number[] = [5, 25, 100, 1000];
  length = 0;
  pageEvent: PageEvent = new PageEvent();
  noDataSource = false;

  pageEventThailand: PageEvent = new PageEvent();
  pageSizeThailand = 25;
  pageIndexThailand = 0;
  pageSizeOptionsThailand: number[] = [5, 25, 100, 1000];
  lengthThailand = 0;

  sumWeightThailand = 0;

  constructor(
    private weightCalService: WeightCalculatorService,
    private weightService: WeightCpipService,
    private loading: NgxSpinnerService,
    public dialog: MatDialog,
    private paramService: ParamService
  ) {
    this.pageEvent.pageIndex = 0;
    this.pageEvent.pageSize = this.pageSize;
    this.pageEvent.length = this.length;

    this.pageEventThailand.pageIndex = 0;
    this.pageEventThailand.pageSize = this.pageSizeThailand;
    this.pageEventThailand.length = this.lengthThailand;
   }

  ngOnInit() {
    if(this.weight.region !== null && this.weight.region.regionCode === '5'){
      this.getCpip(this.pageEventThailand);
    }else{
      this.getWeightDataChildrenForMapping(this.pageEvent);
    }
    
  }

  getCpip(pageEventThailand: PageEvent) {
    this.loading.show();
    this.sumWeightMapping = 0;
    this.weightService.getCpip(this.weight.weightId, pageEventThailand.pageIndex, pageEventThailand.pageSize).subscribe((res) => {
      this.dataSourceThailand = new MatTableDataSource(res.listData.content);
      this.lengthThailand = res.listData.totalElements;
      this.sumWeightThailand = res.sumWeight;
      this.loading.hide();
    },
      (error) => {
        this.loading.hide();
      });
  }

  getWeightDataChildrenForMapping(pageEvent: PageEvent) {
    this.loading.show();
    this.sumWeightMapping = 0;
    this.weightService.getWeightDataChildrenForMapping(this.weight.weightId, pageEvent.pageIndex, pageEvent.pageSize).subscribe((res) => {
      if (res.listData.length) {
        this.sumWeightMapping = res.sumCPAMappingWeight;
        this.originalWeight = res.originalWeight;
        console.log(res.listData);
        this.dataSourceMapping = new MatTableDataSource(res.listData);
        this.length = res.totalElements;
      }
      this.loading.hide();
    },
      (error) => {
        this.loading.hide();
      });
  }

  openDialogAddMapping(element) {

    let data = {
      weightData: element,
      weight: this.weight,
    }

    const dialogRef = this.dialog.open(DialogMappingWeightComponent, {
      width: '700px',
      position: {
        top: '10%'
      },
      data: data
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getWeightDataChildrenForMapping(this.pageEvent);
      }
    });
  }

  autoMapping() {
    this.loading.show();
    let req = new WeightMappingRequest();
    req.weightId = this.weight.weightId;
    this.weightService.autoMapping(req).subscribe((res) => {
      console.log('ressss === ',res);
      this.getWeightDataChildrenForMapping(this.pageEvent);
      
      // this.loading.hide();

      
    },
      (error) => {
        console.log(error);
        
        this.loading.hide();
      });
  }

  checkNextStep(step) {
    if (step == '-4') {
      // let checkCPAMapping = false;
      // this.dataSourceMapping.data.forEach(element => {
      //   let tmp: any = element;
      //   let sumCPAMapping = 0;
        
      //   sumCPAMapping  = tmp.listMsCpa.length;
      //   if (sumCPAMapping == 0) {
      //     checkCPAMapping = true;
      //   }
      // });

      this.warningSwal.title =
      'คุณต้องการย้อนกลับไปทำงาน <br />ขั้นตอนก่อนหน้า <br />';
    this.warningSwal.show().then(
      (result) => {
        if (result.value) {
          this.loading.show();
          let req = new UpdateStepRequest();
          req.weightId = this.weight.weightId;
          this.weightService.toBackStep(req).subscribe((res) => {
            this.loading.hide();

            this.changeTabEvent.emit();
            this.changeWeightEvent.emit(res);
          });
        }
      },
      (error) => {
        this.loading.hide();
      },
    );

      // if (!checkCPAMapping) {
      //   this.warningSwal.title = "คุณต้องการไปขั้นตอนแก้ไข<br />น้ำหนักใช่หรือไม่";
      //   this.warningSwal.show().then((result) => {
      //     if (result.value) {
      //       this.callBackStep(step);
      //     }
      //   });
      // }else {
      //   this.warningSwal.title = "กรุณาจับคู่น้ำหนัก CPA / <br />น้ำหนักรหัสย่อย ให้เรียบร้อย";
      //   this.warningSwal.showCancelButton = false;
      //   this.warningSwal.show();
      // }
      
    }else if (step == '4') {
      this.warningSwal.title = 'คุณต้องการจบขั้นตอนจัดทำน้ำหนัก <br />น้ำหนักใช่หรือไม่';
      this.warningSwal.show().then((result) => {
        if (result.value) {
          this.callNextStep(step);
        }
      });
    }
  }

  callNextStep(step) {
    this.loading.show();
    let req = new UpdateStepRequest();
    req.weightId = this.weight.weightId;
    this.weightService.toNextStep(req).subscribe((res) => {
      this.loading.hide();

      this.changeTabEvent.emit();
      this.changeWeightEvent.emit(res);
      
    },
      (error) => {
        this.loading.hide();
      });
  }

  pageChange(e){
    this.getWeightDataChildrenForMapping(e);
    return e;
  }

  pageChangeThailand(e){
    this.getCpip(e);
    return e;
  }

  callBackStep(step) {
    let req = new UpdateStepRequest();
    req.weightId = this.weight.weightId;
    this.weightService.toBackStep(req).subscribe(res => {
      this.loading.hide();

      this.changeTabEvent.emit();
      this.changeWeightEvent.emit(res);
    });

  }

  
}
