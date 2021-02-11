import { DialogTypesecondcalComponent } from './components/dialog-typesecondcal/dialog-typesecondcal.component';
import { MatTableDataSource } from '@angular/material/table';
import * as FileSaver from 'file-saver';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import * as XLSX from 'xlsx';
import { MatStepper } from '@angular/material/stepper';
import { NgxSpinnerService } from 'ngx-spinner';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { MatDialog, MAT_PROGRESS_SPINNER_DEFAULT_OPTIONS, PageEvent } from '@angular/material';
import { DialogTypeonecalComponent } from './components/dialog-typeonecal/dialog-typeonecal.component';
import { DialogTypethirdcalComponent } from './components/dialog-typethirdcal/dialog-typethirdcal.component';
import { Router } from '@angular/router';
import { WeightService } from 'src/app/core/service/weight/weight.service';
import { isNull } from 'util';
import { InsertWeightDataRequest } from 'src/app/shared/models/weight/request/InsertWeightDataRequest';
import { DialogDeleteWeightDataComponent } from './components/dialog-delete-weight-data/dialog-delete-weight-data.component';
import { ParamService } from 'src/app/core/service/param/param.service';
import { DialogCancelWeightStepComponent } from './components/dialog-cancel-weight-step/dialog-cancel-weight-step.component';
import { DialogHistoryWeightComponent } from './components/dialog-history-weight/dialog-history-weight.component';
import { DialogMappingWeightComponent } from './components/dialog-mapping-weight/dialog-mapping-weight.component';
import { CalculateWeightNextStepRequest } from 'src/app/shared/models/weight/request/CalculateWeightNextStepRequest.model';
import { DialogViewCpaMappingComponent } from './components/dialog-view-cpa-mapping/dialog-view-cpa-mapping.component';
type AOA = any[][];
@Component({
  selector: 'app-calculate-weight',
  templateUrl: './calculate-weight.component.html',
  styleUrls: ['./calculate-weight.component.scss']
})
export class CalculateWeightComponent implements OnInit {
  @ViewChild('stepper', { static: false }) stepper: MatStepper;
  @ViewChild('deleteSwal', { static: false }) deleteSwal: SwalComponent;
  @ViewChild('typeFileSwal', { static: false }) typeFileSwal: SwalComponent;
  @ViewChild('createDataSwal', { static: false }) createDataSwal: SwalComponent;
  @ViewChild('createWeightSuccess', { static: false }) createWeightSuccess: SwalComponent;
  @ViewChild('warningSwal', { static: false }) warningSwal: SwalComponent;
  @ViewChild('deleteWeightSuccess', { static: false }) deleteWeightSuccess: SwalComponent;

  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  fourthFormGroup: FormGroup;

  newArray: any[] = [];
  dataSource: any;
  dataCalWeight = new MatTableDataSource();
  progressSubject: number;
  isEditable = false;
  resultCal = new Array;
  resultMap = new Array;
  dataSourceStepHistory = new MatTableDataSource();

  disableTab2 = false;
  disableTab3 = false;

  constructor(
    private _formBuilder: FormBuilder,
    private loading: NgxSpinnerService,
    private dialog: MatDialog,
    private router: Router,
    private weightService: WeightService,
    private insertWeightDataRequest: InsertWeightDataRequest,
    private paramService: ParamService,
    private calculateWeightNextStepRequest: CalculateWeightNextStepRequest
  ) {

  }
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

  displayedColumns: string[] = ['weightCode', 'weightSubcode', 'description', 'weight', 'ratio', 'status', 'action'];

  displayedColumnsResult: string[] = ['no', 'destinationCode', 'destinationSubcode', 'description', 'adjustweight'];
  displayedColumnsWeightStep: string[] = ['weightCode', 'actionedit', 'action2', 'action'];
  displayedColumnsCalWeight: string[] = ['weightCode', 'weightSubcode', 'description', 'weight', 'action', 'history'];
  fileName: string = 'SheetJS.xlsx';
  isNewWeight = false;
  baseYear;
  baseYearList;
  noBaseYear = false;
  dataArrayFromDB: any[] = [];
  isHaveWeight = false;
  weightCal: any[] = [];
  deleteAction: any;
  dataWeightStep: any[] = [];
  dataSourceWeightStep = new MatTableDataSource();
  step: number;
  listMapping: any[];
  dataSourceMapping = new MatTableDataSource();
  displayedColumnsMappingWeight: string[] = ['weightCode', 'weightSubcode', 'description', 'cpa', 'action', 'action2'];
  currentStep = 1;
  currentWeight: any;
  selectedIndex = 0;
  isLoadingStep = true;
  showDeleteWeight = false;
  totalWeight = 0;
  sumWeight = 0;

  editable = false;

  length = 0;
  pageSize = 100;
  pageSizeOptions: number[] = [5, 10, 25, 100, 500, 1000];
  pageEvent: PageEvent = new PageEvent;

  page = 0;
  size = 100;
  index = 0;

  ngOnInit() {
    this.loading.show();
    this.getBaseYear();
    this.getParamWeightCalType();
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
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

  allowDrop(evt: DragEvent) {
    evt.preventDefault();
  }

  uploadFile(event: any) {
    console.log(event);
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
              'weight': parseFloat(this.financial(data[key][3]))
            })
          }
        }
      })
      if (this.newArray.length > 0) {
        this.insertWeightDataRequest.listData = this.newArray;
        this.insertWeightDataRequest.baseYearId = this.baseYear.baseYearId;
        this.weightService.insertWeightData(this.insertWeightDataRequest).subscribe(res => {
          this.loading.hide();
          this.isNewWeight = false;
          this.isHaveWeight = true;
          this.getWeightDataFromDB(1.1);
        },
          (error) => {
            console.log(error.error.messageEn);
            this.loading.hide();
          });
      }
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
              'weight': parseFloat(this.financial(data[key][3]))
            })
          }
        }
      })
      if (this.newArray.length > 0) {
        console.log(this.baseYear);
        this.insertWeightDataRequest.listData = this.newArray;
        this.insertWeightDataRequest.baseYearId = this.baseYear.baseYearId;
        this.weightService.insertWeightData(this.insertWeightDataRequest).subscribe(res => {
          this.isNewWeight = false;
          this.isHaveWeight = true;
          this.loading.hide();
          this.getWeightDataFromDB(1.1);
        },
          (error) => {
            console.log(error.error.messageEn);
            this.loading.hide();
          });
      }
    };
    reader.readAsBinaryString(target.files[0]);

  }

  selectionChangeStep1(event) {
    console.log(event);
    if (event.selectedIndex == 0) {
      this.currentStep = 1.1;
      this.page = 0;
      this.size = 100;
      this.getWeightDataFromDB(1.1);
    }
    else if (event.selectedIndex == 1) {
      this.currentStep = 1.2;
      this.page = 0;
      this.size = 100;
      this.getWeightDataFromDB(1.2);
    }
    else if (event.selectedIndex == 2) {
      this.page = 0;
      this.getWeightStepByBaseYear(1);
    }
  }

  selectionChangeStep2(event) {
    if (event.selectedIndex == 0) {
      this.page = 0;
      this.size = 100;
      this.getWeightDataFromDB(2);
    }
    else if (event.selectedIndex == 1) {
      this.page = 0;
      this.size = 100;
      this.getWeightStepByBaseYear(2);
    }
  }

  onselectTypeCal(evt, value) {
    console.log(evt, value);
    if (evt != 0) {
      if (evt.value.paramInfo == "PROPORTION") {
        this.typeProportionCalWeight(evt.value.paramId, value);
      }
      else if (evt.value.paramInfo == "AVERAGE") {
        this.typeAverageCalWeight(evt.value.paramId, value);
      }
      else if (evt.value.paramInfo == "COMBINE") {
        this.typeCombineCalWeight(evt.value.paramId, value);
      }
    }
  }

  typeCombineCalWeight(actionId, value) {
    console.log(actionId, value);
    const dialogRef = this.dialog.open(DialogTypeonecalComponent, {
      width: '750px',
      data: { "value": value, "step": this.currentStep, 'actionId': actionId, 'baseYearId': this.baseYear.baseYearId, 'baseYearStatus': this.baseYear.status }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getWeightDataFromDB(this.currentStep);
    });
  }


  typeAverageCalWeight(actionId, value) {
    const dialogRef = this.dialog.open(DialogTypesecondcalComponent, {
      width: '750px',
      data: { "value": value, "step": this.currentStep, 'actionId': actionId, 'baseYearId': this.baseYear.baseYearId, 'baseYearStatus': this.baseYear.status }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getWeightDataFromDB(this.currentStep);
    });
  }


  typeProportionCalWeight(actionId, value) {
    const dialogRef = this.dialog.open(DialogTypethirdcalComponent, {
      width: '750px',
      data: { "value": value, "step": this.currentStep, 'actionId': actionId, 'baseYearId': this.baseYear.baseYearId, 'baseYearStatus': this.baseYear.status }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getWeightDataFromDB(this.currentStep);
    });
  }


  financial(n) {
    return Number.parseFloat(n).toFixed(5);
  }

  onCreateWeight() {
    this.createWeightSuccess.show();
  }

  goToWeight() {
    this.router.navigateByUrl('calculateweight/resultweight', { state: { 'result': this.newArray } });
  }

  onResetSteps() {
    this.stepper.reset();
  }

  getBaseYear() {
    this.weightService.getBaseYear().subscribe(res => {
      this.loading.hide();
      if (res.length) {
        this.baseYearList = res;
      }
      else {
        this.noBaseYear = true;
      }
    },
      (error) => {
        console.log(error.error.messageEn);
        this.loading.hide();
      });
  }

  selectBaseYear(event) {
    this.loading.show();
    this.baseYear = event.value;
    this.isLoadingStep = true;
    this.weightService.getWeightAndWeightDataByBaseYear(this.baseYear.baseYearId, this.baseYear.status, this.page, this.size, 1.1).subscribe((res) => {
      this.dataArrayFromDB = [];
      this.isLoadingStep = false;
      this.showDeleteWeight = false;
      if (res.weightStatus == 'NEW') {
        if (res.listWeightData.length > 0) {
          this.currentWeight = res.listWeightData[0].weightId;
          this.checkDisableTab(res.listWeightData[0].weightId.stepNo);
          if (res.listWeightData[0].weightId.stepNo == 3) {
            this.showDeleteWeight = true;
          }
          res.listWeightData.forEach(element => {
            this.dataArrayFromDB.push({
              'weightCode': element.weightCode,
              'weight': parseFloat(element.adjustedWeight),
              'weightDataId': element.weightDataId,
              'listHistory': element.listHistory,
              'weightSubcode': element.weightSubcode,
              'description': element.description,
              'status': element.status
            });
          });
          this.totalWeight = res.totalWeight;
          this.sumWeight = res.listWeightData[0].weightId.originalWeight;
          this.currentStep = res.listWeightData[0].weightId.stepNo;
          this.dataSource = new MatTableDataSource(this.dataArrayFromDB);
          this.length = res.totalElements;
          this.isNewWeight = false;
          this.isHaveWeight = true;
        }
        else {
          this.isHaveWeight = false;
          this.isNewWeight = true;
        }
      }
      else if (res.weightStatus == 'ACTIVE') {
        if (res.listWeightData.length > 0) {
          if (res.listWeightData[0].weightId.stepNo == 3) {
            this.showDeleteWeight = true;
          }
          res.listWeightData.forEach(element => {
            this.dataArrayFromDB.push({
              'weightCode': element.weightCode,
              'weight': parseFloat(element.adjustedWeight),
              'weightDataId': element.weightDataId,
              'listHistory': element.listHistory,
              'weightSubcode': element.weightSubcode,
              'description': element.description,
              'status': element.status
            });
          });
          this.totalWeight = res.totalWeight;
          this.sumWeight = res.listWeightData[0].weightId.originalWeight;
          this.dataSource = new MatTableDataSource(this.dataArrayFromDB);
          this.isNewWeight = false;
          this.isHaveWeight = true;
        }
        else {
          this.isNewWeight = false;
          this.isHaveWeight = false;
          this.warningSwal.title = "ไม่ได้จัดเก็บข้อมูลปีฐาน";
          this.warningSwal.show();
        }
      }
      this.loading.hide();
    },
      (error) => {
        console.log(error)
        this.loading.hide();
      });
  }

  openDeleteDialog(element) {
    let data = {
      weight: element,
      action: this.deleteAction
    }
    const dialogRef = this.dialog.open(DialogDeleteWeightDataComponent, {
      width: '750px',
      data: data
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getWeightDataFromDB(1.1);
      }
    });
  }

  getWeightDataFromDB(step: number) {
    this.isLoadingStep = true
    this.weightService.getWeightAndWeightDataByBaseYear(this.baseYear.baseYearId, this.baseYear.status, this.page, this.size, step).subscribe((res) => {
      this.dataArrayFromDB = [];
      this.isLoadingStep = false;
      if (res.listWeightData) {
        this.currentWeight = res.listWeightData[0].weightId;
        this.checkDisableTab(res.listWeightData[0].weightId.stepNo);
        this.totalWeight = 0;
        res.listWeightData.forEach(element => {
          this.dataArrayFromDB.push({
            'weightCode': element.weightCode,
            'weight': parseFloat(element.adjustedWeight),
            'weightDataId': element.weightDataId,
            'weightSubcode': element.weightSubcode,
            'description': element.description,
            'listHistory': element.listHistory,
            'status': element.status
          });
        });
        this.totalWeight = res.totalWeight;
        this.currentStep = res.listWeightData[0].weightId.stepNo;
        this.sumWeight = res.listWeightData[0].weightId.originalWeight;
        this.dataSource = new MatTableDataSource(this.dataArrayFromDB);
        this.length = res.totalElements;
      }
      this.loading.hide();
    },
      (error) => {
        console.log(error)
        this.isLoadingStep = false;
      });
  }

  getParamWeightCalType() {
    this.paramService.getParamInfoByGroup('WEIGHT_ACTION').subscribe(res => {
      res.info.forEach(element => {
        if (element.paramInfo != 'DELETE') {
          this.weightCal.push(element);
        }
        else {
          this.deleteAction = element
        }
      });
    });
  }


  getWeightStepByBaseYear(currentStep: number) {
    this.step = null;
    this.loading.show();
    this.weightService.getWeightStepByBaseYear(this.baseYear.baseYearId, currentStep).subscribe(res => {
      this.dataWeightStep = res;
      let firstEdit = false;
      this.dataWeightStep.forEach(element => {
        if (element.status == 'NEW') {
          if (!firstEdit) {
            element.isCancel = true;
            firstEdit = true;
          }
          else {
            element.isEdit = false;
          }
        }
      });
      this.dataSourceWeightStep = new MatTableDataSource(this.dataWeightStep);
      this.loading.hide();
    },
      (error) => {
        this.loading.hide();
      });
  }

  openCancleStepDialog(element) {
    console.log(element);
    let data = {
      weightStep: element,
    }

    const dialogRef = this.dialog.open(DialogCancelWeightStepComponent, {
      width: '550px',
      position: {
        top: '10%'
      },
      data: data
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getWeightStepByBaseYear(this.currentStep);
    });
  }

  getWeightHistory(element, itemIndex) {
    this.step = itemIndex;
    this.loading.show()
    this.weightService.getWeightHistoryByWeightStep(element.weightStepId).subscribe((res) => {
      this.loading.hide();
      this.dataSourceStepHistory = new MatTableDataSource(res);
    },
      (error) => {
        this.loading.hide();
      });
  }

  openDataHistoryDialog(element) {
    console.log(element);
    let data = {
      history: element.listHistory,
    }

    const dialogRef = this.dialog.open(DialogHistoryWeightComponent, {

      data: data
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {

      }
    });
  }

  getWeightDataChildrenForMapping() {
    // this.loading.show();
    // this.weightService.getWeightDataChildrenForMapping(this.baseYear.baseYearId, this.baseYear.status, this.page, this.size).subscribe((res) => {
    //   this.dataSourceMapping = new MatTableDataSource(res.listData);
    //   this.length = res.totalElements;
    //   this.loading.hide();
    // },
    //   (error) => {
    //     console.log(error)
    //     this.loading.hide();
    //   });
  }

  openDialogAddMapping(element) {

    let data = {
      weightData: element,
      baseYear: this.baseYear
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

  openDialogViewMapping(element) {

    let data = {
      weightData: element.listMsCpa,
    }

    const dialogRef = this.dialog.open(DialogViewCpaMappingComponent, {
      width: '700px',
      position: {
        top: '10%'
      },
      data: data
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {

      }
    });
  }

  pageChange(e: PageEvent, step: number): PageEvent {
    this.page = e.pageIndex;
    this.size = e.pageSize;
    this.getWeightDataFromDB(step);
    return e;
  }

  pageChange2(e: PageEvent): PageEvent {
    this.index = e.pageIndex * e.pageSize;
    this.page = e.pageIndex;
    this.size = e.pageSize;
    this.getWeightDataFromDB(2);
    return e;
  }

  pageChange3(e: PageEvent): PageEvent {
    this.index = e.pageIndex * e.pageSize;
    this.page = e.pageIndex;
    this.size = e.pageSize;
    this.getWeightDataChildrenForMapping();
    return e;
  }

  checkStep(step: number) {
    this.calculateWeightNextStepRequest.stepId = step;
    this.calculateWeightNextStepRequest.weightId = this.currentWeight.weightId
    this.loading.show();
    this.weightService.calculateWeightNextStep(this.calculateWeightNextStepRequest).subscribe((res) => {
      this.currentWeight = res;
      this.loading.hide();
      if (step == 1.1 || step == 1.2) {
        this.selectedIndex = 1;
        this.getWeightDataFromDB(2);
      }
      else if (step == 2.1) {
        this.selectedIndex = 2;
      }
      else if (step == -1) {
        this.selectedIndex = 0;
        this.getWeightDataFromDB(1);
      }
    },
      (error) => {
        this.loading.hide();
      });
  }

  onTabClick(event) {
    if (event.index == 0) {
      this.page = 0
      this.size = 100;
      this.currentStep = 1.1;
      this.getWeightDataFromDB(1.1);
    }
    else if (event.index == 1) {
      this.page = 0
      this.size = 100;
      this.currentStep = 2
      this.getWeightDataFromDB(2);
    }
    else if (event.index == 2) {
      this.page = 0
      this.size = 100;
      this.currentStep = 3;
      this.getWeightDataChildrenForMapping();
    }
  }

  checkDisableTab(step: number) {
    if (step == 1.1 || step == 1.2) {
      this.disableTab2 = true;
      this.disableTab3 = true;
    }
    else if (step == 2.1) {
      this.disableTab2 = false;
      this.disableTab3 = true;
    }
    else if (step == 3) {
      this.disableTab2 = false;
      this.disableTab3 = false;
    }
  }

  exportExcelWeightCPA() {
    // this.loading.show();
    // this.weightService.exportExcelWeighCPA(this.baseYear.baseYearId, this.baseYear.baseYear, 1).subscribe((res) => {
    //   let mediaType = 'application/octet-stream';
    //   const blob = new Blob([res], { type: mediaType });
    //   FileSaver.saveAs(blob, 'export_weight_' + new Date().toISOString() + '.xlsx');
    //   this.loading.hide();
    // },
    //   (error) => {
    //     this.loading.hide();
    //     console.log(error);
    //   });

  }

  deleteWeight() {
    this.loading.show();
    this.weightService.deleteWeight(this.currentWeight.weightId).subscribe((res) => {
      this.loading.hide();
      this.deleteWeightSuccess.show();
    },
      (error) => {
        console.log(error);
        this.loading.hide();
      });
  }

  refresh() {
    window.location.reload();
  }

}