import { Component, OnInit, Input, ViewChild, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { MatDialog, MatTableDataSource, PageEvent, MatStepper } from '@angular/material';
import { NgxSpinnerService } from 'ngx-spinner';
import { WeightService } from 'src/app/core/service/weight/weight.service';
import { DialogMappingWeightComponent } from '../dialog-mapping-weight/dialog-mapping-weight.component';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import * as XLSX from 'xlsx';
import { isNull } from 'util';
import { CalculateWeightNextStepRequest } from 'src/app/shared/models/weight/request/CalculateWeightNextStepRequest.model';
import { InsertWeightCPARequest } from 'src/app/shared/models/weight/request/InsertWeightCPARequest.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as FileSaver from 'file-saver';
type AOA = any[][];

@Component({
  selector: 'app-weight-step3-component',
  templateUrl: './weight-step3-component.component.html',
  styleUrls: ['./weight-step3-component.component.scss']
})
export class WeightStep3ComponentComponent implements OnInit, AfterViewInit {

  @ViewChild('stepper', { static: false }) private myStepper: MatStepper;
  @ViewChild('typeFileSwal', { static: false }) typeFileSwal: SwalComponent;
  @ViewChild('warningSwal', { static: false }) warningSwal: SwalComponent;
  @ViewChild('infoSwal', { static: false }) infoSwal: SwalComponent;

  @Input() weight;
  @Input() paramList;
  @Output() changeTabEvent = new EventEmitter<any>();
  @Output() changeWeightEvent = new EventEmitter<any>();

  page = 0;
  size = 100;
  index = 0;
  length = 0;
  pageSize = 100;
  pageSizeOptions: number[] = [5, 10, 25, 100, 500, 1000];
  pageEvent: PageEvent = new PageEvent;
  newArray = new Array();
  buttonText = 'อัพโหลดไฟล์แก้ไขน้ำหนัก'

  isShowTable = false;
  isShowImport = false;

  dataSourceEdit = new MatTableDataSource();
  dataSourceMapping = new MatTableDataSource();
  displayedColumnsMappingWeight: string[] = ['weightCode', 'weightSubcode', 'description', 'countCpa','cpa', 'action'];
  displayedColumnsEditWeightCPA: string[] = ['weightCode', 'weightSubcode', 'description', 'commodityCode', 'commodityName', 'weight'];

  afuConfig = {
    uploadAPI: {
      url: "https://example-file-upload-api"
    },
    formatsAllowed: ".csv,.xlsx",
    maxSize: "20",
    hideResetBtn: true,
    theme: "dragNDrop",
    replaceTexts: {
      selectFileBtn: 'เลือกไฟล์',
      resetBtn: 'ยกเลิก',
      uploadBtn: 'อัพโหลด',
      dragNDropBox: 'Drag and Drop',
      afterUploadMsg_success: 'อัพโหลดเสร็จสิ้น',
      afterUploadMsg_error: 'อัพโหลดผิดพลาด!'
    }
  };
  data: any;
  wopts: XLSX.WritingOptions = { bookType: 'xlsx', type: 'array' };
  fileName: string = 'SheetJS.xlsx';
  showImport = false;
  showButton = false;
  showTable = false;
  isShowEditTable = false;
  weight2_1 = 0;
  originalWeight = 0;
  sumWeightMapping = 0;
  isLoadingStep = true;
  stepperIndex = 0;
  isFirstStepDone = true;
  isSecondStepDone = false;
  firstFormGroup: FormGroup;
  sumChildrenWeight = 0;
  sumTableWeight = 0;

  constructor(
    private dialog: MatDialog,
    private loading: NgxSpinnerService,
    private weightService: WeightService,
    private calculateWeightNextStepRequest: CalculateWeightNextStepRequest,
    private insertWeightCPARequest: InsertWeightCPARequest,
    private _formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: [this.weight.stepNo == 3.1 ? '' : true, Validators.required]
    });
    if (this.weight.stepNo == 3.1 || this.weight.stepNo >= 4.0) {
      this.stepperIndex = 0;
      this.getWeightDataChildrenForMapping();
    }
    else if (this.weight.stepNo == 3.2) {
      this.stepperIndex = 1;
      this.showImport = true;
    }
    this.getSumChildrenWeight();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      if (this.weight.stepNo == 3.2) {
        this.myStepper.next();
      }
    }, 0);
  }

  checkShowStep() {
    console.log('checkShowStep', this.weight);
    if (this.weight.stepNo == 3.1) {
      this.firstFormGroup.controls['firstCtrl'].setValue('');
      this.stepperIndex = 0;
      this.getWeightDataChildrenForMapping();
    }
    else if (this.weight.stepNo == 3.2) {
      this.firstFormGroup.controls['firstCtrl'].setValue(true);
      this.stepperIndex = 1;
      this.showImport = true;
    }
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
        this.getWeightDataChildrenForMapping();
      }
    });
  }

  getWeightDataChildrenForMapping() {
    this.isLoadingStep = true;
    this.sumWeightMapping = 0;
    this.weightService.getWeightDataChildrenForMapping(this.weight.weightId, this.page, this.size).subscribe((res) => {
      if (res.listData.length) {
        this.sumWeightMapping = res.sumCPAMappingWeight;
        this.originalWeight = res.originalWeight;
        console.log(res.listData);
        this.dataSourceMapping = new MatTableDataSource(res.listData);
        this.length = res.totalElements;
      }
      this.isLoadingStep = false;
    },
      (error) => {
        this.isLoadingStep = false;
      });
  }


  pageChange(e: PageEvent): PageEvent {
    this.page = e.pageIndex;
    this.size = e.pageSize;
    this.getWeightDataChildrenForMapping();
    return e;
  }

  financial(n) {
    return Number.parseFloat(n).toFixed(5);
  }

  allowDrop(evt: DragEvent) {
    evt.preventDefault();
  }

  drop(event) {
    event.preventDefault();
    let type = event.dataTransfer.files[0].type;
    if (type == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
      this.onDropLoadFile(event);
    } else {
      this.typeFileSwal.show();
    }
  }

  onDropLoadFile(evt: any) {
    this.loading.show();
    this.newArray = [];
    var file = evt.dataTransfer.files[0];
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];
      this.data = <AOA>(XLSX.utils.sheet_to_json(ws, { header: 1 }));
      let data = Object.values(this.data);
      console.log('file', data);
      Object.keys(data).forEach((key, index) => {
        if (index != 0) {
          if (!isNull(data[key][1]) && !isNull(data[key][2]) && !isNull(data[key][3])) {
            this.newArray.push({
              'weightCode': data[key][0],
              'weightSubCode': data[key][1],
              'description': data[key][2],
              'commodityCode': data[key][3],
              'commodityName': data[key][4],
              'weight': parseFloat(this.financial(data[key][5]))
            })
            this.sumTableWeight += parseFloat(this.financial(data[key][5]));
          }
        }
      })
      if (this.newArray.length > 0) {
        this.isShowEditTable = true;
        console.log(this.newArray);
        this.dataSourceEdit = new MatTableDataSource(this.newArray);
      }
      this.loading.hide();
    };
    reader.readAsBinaryString(file);
  }

  onFileChange(evt: any) {
    this.loading.show();
    this.newArray = [];
    const target: DataTransfer = <DataTransfer>(evt.target);
    if (target.files.length !== 1) {
      this.loading.hide();
      return;
    };
    this.fileName = target.files.item(0).name;
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];
      this.data = <AOA>(XLSX.utils.sheet_to_json(ws, { header: 1 }));
      let data = Object.values(this.data);
      console.log('file', data);
      Object.keys(data).forEach((key, index) => {
        if (index != 0) {
          if (!isNull(data[key][1]) && !isNull(data[key][2]) && !isNull(data[key][3])) {
            this.newArray.push({
              'weightCode': data[key][0],
              'weightSubCode': data[key][1],
              'description': data[key][2],
              'commodityCode': data[key][3],
              'commodityName': data[key][4],
              'weight': parseFloat(this.financial(data[key][5]))
            })
            this.sumTableWeight += parseFloat(this.financial(data[key][5]));
          }
        }
      })
      if (this.newArray.length > 0) {
        console.log(this.newArray);
        this.isShowEditTable = true;
        this.dataSourceEdit = new MatTableDataSource(this.newArray);
      }
      this.loading.hide();
    };
    reader.readAsBinaryString(target.files[0]);
  }

  checkNextStep(step) {
    if (step == 3.1) {
      let checkCPAMapping = false;
      this.dataSourceMapping.data.forEach(element => {
        let tmp: any = element;
        let sumCPAMapping = 0;
        // tmp.listMsCpa.forEach(element2 => {
          // sumCPAMapping += element2.weight;
        // });
        // if (sumCPAMapping != tmp.adjustedWeight) {
        //   checkCPAMapping = true;
        // }
        sumCPAMapping  = tmp.listMsCpa.length;
        if (sumCPAMapping == 0) {
          checkCPAMapping = true;
        }
      });
      if (!checkCPAMapping) {
        this.warningSwal.title = "คุณต้องการไปขั้นตอนแก้ไข<br />น้ำหนักใช่หรือไม่";
        this.warningSwal.show().then((result) => {
          if (result.value) {
            this.callNextStep(step);
          }
        });
      }else {
        this.warningSwal.title = "กรุณาจับคู่น้ำหนัก CPA / <br />น้ำหนักรหัสย่อย ให้เรียบร้อย";
        this.warningSwal.showCancelButton = false;
        this.warningSwal.show();
      }
    }
    else if (step == 3.2) {
      this.warningSwal.title = "คุณต้องการบันทึกน้ำหนัก <br />ใช่หรือไม่";
      this.warningSwal.show().then((result) => {
        if (result.value) {
          this.onSaveLastStep();
        }
      });
    }
    else if (step == -3.1 || step == -3.2) {
      this.warningSwal.title = "คุณต้องการย้อนกลับไปขั้นตอนแก้ไข <br />ใช่หรือไม่";
      this.warningSwal.show().then((result) => {
        if (result.value) {
          this.callNextStep(step);
        }
      });
    }
  }

  callNextStep(step) {
    this.calculateWeightNextStepRequest.stepId = step;
    this.calculateWeightNextStepRequest.weightId = this.weight.weightId
    this.loading.show();
    this.weightService.calculateWeightNextStep(this.calculateWeightNextStepRequest).subscribe((res) => {
      this.loading.hide();
      if (step == 3.1 || step == -3.2 || step == -3.1) {
        this.weight = res;
        this.changeTabEvent.emit();
        this.changeWeightEvent.emit(res);
      }
      this.checkShowStep();
    },
      (error) => {
        this.loading.hide();
      });
  }

  onSaveLastStep() {
    if (!this.isShowEditTable) {
      this.loading.show()
      this.weightService.copyDataWeightCPA(this.weight.weightId).subscribe((res) => {
        this.loading.hide();
        this.changeTabEvent.emit();
        this.changeWeightEvent.emit(res);
      });
    }
    else {
      let weightStart = this.sumChildrenWeight;
      let weightTable = 0;
      console.log('weightStart', weightStart);
      this.insertWeightCPARequest.baseYearId = this.weight.baseYear.baseYearId;
      this.insertWeightCPARequest.weightId = this.weight.weightId;
      this.dataSourceEdit.data.forEach(element => {
        let tmp: any = element;
        let data = {
          weightCode: tmp.weightCode,
          weightSubCode: tmp.weightSubCode,
          description: tmp.description,
          commodityCode: tmp.commodityCode,
          commodityName: tmp.commodityName,
          weight: tmp.weight
        }
        this.insertWeightCPARequest.listData.push(data);
        weightTable += tmp.weight;
      });
      console.log('weightTable', weightTable);
      if (weightStart == weightTable) {
        this.loading.show();
        this.weightService.insertDataWeightCPA(this.insertWeightCPARequest).subscribe((res) => {
          this.loading.hide();
          this.changeTabEvent.emit();
          this.changeWeightEvent.emit(res);
        },
          (error) => {
            this.loading.hide();
          });
      }
      else if (weightStart < weightTable) {
        this.infoSwal.title = 'น้ำหนักเกิน';
        this.infoSwal.text = 'กรุณาแก้ไขน้ำหนักใหม่';
        this.infoSwal.show();
      }
      else if (weightStart > weightTable) {
        this.infoSwal.title = 'น้ำหนักน้อยกว่า';
        this.infoSwal.text = 'กรุณาแก้ไขน้ำหนักใหม่';
        this.infoSwal.show();

      }
    }
  }

  selectionChangeStep(event) {
    if (event.selectedIndex == 0) {
      this.page = 0;
      this.size = 100;
      this.getWeightDataChildrenForMapping();
    }
    else if (event.selectedIndex == 1) {
      if (this.weight.stepNo == 3.2) {
        this.showImport = true;
      }
      else if (this.weight.stepNo > 3.2) {
        this.showImport = false;
      }
    }
  }

  exportExcelWeightCPA() {
    this.loading.show();
    this.weightService.exportExcelWeighCPA(this.weight.weightId).subscribe((res) => {
      let mediaType = 'application/octet-stream';
      const blob = new Blob([res], { type: mediaType });
      FileSaver.saveAs(blob, 'export_weight_' + new Date().toISOString() + '.xlsx');
      this.loading.hide();
    },
      (error) => {
        this.loading.hide();
        console.log(error);
      });
  }

  getSumChildrenWeight() {
    this.weightService.sumChildrenWeight(this.weight.weightId).subscribe((res) => {
      this.sumChildrenWeight = res;
    }, (error) => {
      console.log(error);
    })
  }

  weightChanged() {
    this.sumTableWeight = 0;
    this.dataSourceEdit.data.forEach(element => {
      let tmp: any = element;
      this.sumTableWeight += tmp.weight;
    });
  }

}
