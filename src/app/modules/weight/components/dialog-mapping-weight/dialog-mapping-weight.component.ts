import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, DateAdapter } from '@angular/material';
import { Observable } from 'rxjs';
import { FormControl, FormGroup, FormArray, Validators, FormBuilder } from '@angular/forms';
import { startWith, map } from 'rxjs/operators';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { WeightService } from 'src/app/core/service/weight/weight.service';
import { InsertAndUpdateMappingCPAWithWeightRequest } from 'src/app/shared/models/weight/request/InsertAndUpdateMappingCPAWithWeightRequest.model';
import { isNull } from 'util';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-dialog-mapping-weight',
  templateUrl: './dialog-mapping-weight.component.html',
  styleUrls: ['./dialog-mapping-weight.component.scss']
})
export class DialogMappingWeightComponent implements OnInit {

  @ViewChild('saveSwal', { static: false }) addSwal: SwalComponent;
  @ViewChild('succussSwal', { static: false }) succussSwal: SwalComponent;
  @ViewChild('errorSwal', { static: false }) errorSwal: SwalComponent;
  @ViewChild('warningSwal', { static: false }) warningSwal: SwalComponent;

  cpaForm = new FormControl();
  showEror = false;
  submitted = false;

  mapCPAForm: FormGroup;
  listMapCPA: FormArray;

  options = new Array();
  listCPAMapping = new Array();
  filteredOptions: Observable<any[]>;
  weightData: any;

  weigthSum = 0;
  weigthParent = 0;
  weightDiff = 0;

  isLoadingCPA = true;
  weight;
  listDefalut = new Array();
  deleteMode = false;

  constructor(
    public dialogRef: MatDialogRef<DialogMappingWeightComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private dateAdapter: DateAdapter<Date>,
    private weightService: WeightService,
    private insertAndUpdateMappingCPAWithWeightRequest: InsertAndUpdateMappingCPAWithWeightRequest,
    private loading: NgxSpinnerService,
  ) {
    dateAdapter.setLocale('th-TH');
  }


  ngOnInit() {
    console.log(this.data);
    this.weight = this.data.weight;
    this.cpaForm.setValidators(Validators.required);
    this.weightData = this.data.weightData;
    this.weigthParent = this.data.weightData.adjustedWeight;
    this.weightDiff = this.data.weightData.adjustedWeight;
    this.getCPALevel7List();
    this.mapCPAForm = this.formBuilder.group({
      listCPA: this.formBuilder.array([], Validators.required),
      weightId: [this.weight.weightId, Validators.required],
      weightDataId: [this.weightData.weightDataId, Validators.required]
    });
    if (this.data.weightData.listMsCpa.length > 0) {
      this.data.weightData.listMsCpa.forEach(element => {
        let tmp = element.cpa;
        let str = tmp.commodityThName + ' (' + tmp.commodityCode + ') ';
        tmp.autoCompleteName = str;
        element.cpa = tmp;
      });
      this.initMappingDBForm();
      this.deleteMode = true;
    }
    const myFormValueChanges$ = this.mapCPAForm.controls['listCPA'].valueChanges;
    myFormValueChanges$.subscribe(units => this.updateTotalUnitPrice(units));
    this.checkWeightParent(this.mapCPAForm.controls['listCPA'].value);
  }

  private updateTotalUnitPrice(units) {
    this.weigthSum = 0;
    units.forEach(element => {
      if (!isNull(element.weight)) {
        this.weigthSum += element.weight
      }
    });
    this.weightDiff = parseFloat((this.weigthParent - this.weigthSum).toFixed(5));
  }

  private mappingCPAInit() {
    this.options.sort(function (obj1, obj2) {
      return obj1.cpaId - obj2.cpaId;
    });
    this.filteredOptions = this.cpaForm.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
  }

  initMappingDBForm() {
    this.listMapCPA = this.mapCPAForm.get('listCPA') as FormArray;
    this.data.weightData.listMsCpa.forEach(element => {
      this.weigthSum += element.weight
      this.listMapCPA.push(this.createMappingFromDB(element.cpa, element.weight));
    });
  }

  private _filter(value: string): string[] {
    const filterValue = value;
    return this.options.filter(option => option.autoCompleteName.toLowerCase().includes(filterValue));
  }

  displayFn(val: any) {
    return val ? val.autoCompleteName : val;
  }

  addCPAFormMapping() {
    if (this.cpaForm.invalid) {
      this.showEror = true;
    }
    else {
      this.removeCPAOnselect(this.cpaForm.value);
      this.listMapCPA = this.mapCPAForm.get('listCPA') as FormArray;
      this.listMapCPA.push(this.createMapping(this.cpaForm.value));
      this.cpaForm.setValue('');
    }
  }

  selectCPA() {
    this.showEror = false;
  }

  createMapping(cpa): FormGroup {
    return this.formBuilder.group({
      weight: [0],
      cpa: [cpa, Validators.required],
    });
  }

  createMappingFromDB(cpa, weight): FormGroup {
    return this.formBuilder.group({
      weight: [weight],
      cpa: [cpa, Validators.required],
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.mapCPAForm.invalid) {
      let listArr = <FormArray>this.mapCPAForm.controls['listCPA'];
      console.log(listArr.length);
      if (this.deleteMode && listArr.length == 0) {
        this.addSwal.show();
      }
      else {
        this.warningSwal.title = "กรุณาจับคู่ <br />CPA"
        this.warningSwal.show();
        return
      }
    } else {
      let listArr = <FormArray>this.mapCPAForm.controls['listCPA'];
      let sumWeight = 0;
      listArr.value.forEach(element => {
        sumWeight += element.weight;
      });
      if (sumWeight > this.weightData.adjustedWeight) {
        this.warningSwal.title = "น้ำหนักเกิน"
        this.warningSwal.text = "กรุณากำหนดน้ำหนักใหม่"
        this.warningSwal.show();
      }
      else {
        this.addSwal.show();
      }
    }
  }

  get formData() { return this.mapCPAForm.get('listCPA') as FormArray }

  removeCPAOnselect(cpa) {
    let index = this.options.findIndex(x => x.cpaId == cpa.cpaId);
    this.options.splice(index, 1);
  }

  removeGroup(i: number) {
    const listArr = <FormArray>this.mapCPAForm.controls['listCPA'];
    console.log(listArr.get([i]).value.cpa);
    this.options.push(listArr.get([i]).value.cpa);
    this.mappingCPAInit();
    listArr.removeAt(i);
  }

  submitMappingCPA() {
    this.loading.show();
    this.insertAndUpdateMappingCPAWithWeightRequest.weightDataId = this.mapCPAForm.controls['weightDataId'].value;
    this.insertAndUpdateMappingCPAWithWeightRequest.weightId = this.mapCPAForm.controls['weightId'].value;
    this.insertAndUpdateMappingCPAWithWeightRequest.listMapping = [];
    const listArr = <FormArray>this.mapCPAForm.controls['listCPA'];
    let sumWeight = 0;
    listArr.value.forEach(element => {
      sumWeight += element.weight;
      let data = {
        'weight': element.weight,
        'cpaId': element.cpa.cpaId
      }
      this.insertAndUpdateMappingCPAWithWeightRequest.listMapping.push(data);
    });
    this.weightService.mappingCPAWithWeight(this.insertAndUpdateMappingCPAWithWeightRequest).subscribe((res) => {
      this.loading.hide();
      this.succussSwal.show();
    },
      (error) => {
        this.loading.hide();
        this.dialogRef.close(false);
      });
  }

  closeDialog() {
    this.dialogRef.close(true);
  }

  getCPALevel7List() {
    this.weightService.getCPALevel7(this.weight.weightId, this.weightData.weightDataId).subscribe((res) => {
      if (res.listCPA.length > 0) {
        res.listCPA.forEach(element => {
          let tmp = element;
          let str = tmp.commodityThName + ' (' + tmp.commodityCode + ') ';
          tmp.autoCompleteName = str;
          this.options.push(tmp);
        });
      }
      if (res.listDefaultCPA.length > 0) {
        this.listMapCPA = this.mapCPAForm.get('listCPA') as FormArray;
        res.listDefaultCPA.forEach(element => {
          let tmp = element;
          let str = tmp.commodityThName + ' (' + tmp.commodityCode + ') ';
          tmp.autoCompleteName = str;
          this.listMapCPA.push(this.createMapping(tmp));
        });
      }
      this.mappingCPAInit();
      this.isLoadingCPA = false;
    });
  }

  checkWeightParent(list) {
    this.weigthSum = 0;
    list.forEach(element => {
      if (!isNull(element.weight)) {
        this.weigthSum += element.weight
      }
    });
    this.weightDiff = parseFloat((this.weigthParent - this.weigthSum).toFixed(5));
  }

  autoAddWeight(form: FormGroup) {
    if (this.weightDiff > 0) {
      let oldWeight: number = form.controls['weight'].value
      form.controls['weight'].setValue(this.weightDiff + oldWeight);
    }
  }

}
