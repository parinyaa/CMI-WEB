import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { FormControl, FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { MatDialogRef, MAT_DIALOG_DATA, DateAdapter } from '@angular/material';
import { WeightService } from 'src/app/core/service/weight/weight.service';
import { InsertAndUpdateMappingCPAWithWeightRequest } from 'src/app/shared/models/weight/request/InsertAndUpdateMappingCPAWithWeightRequest.model';
import { NgxSpinnerService } from 'ngx-spinner';
import { isNull } from 'util';
import { startWith, map } from 'rxjs/operators';
import { CpipModel } from 'src/app/shared/models/weight/request/CpipModel';

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
  checkWeight: boolean = false;
  constructor(
    public dialogRef: MatDialogRef<DialogMappingWeightComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private dateAdapter: DateAdapter<Date>,
    private weightService: WeightService,
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
        let tmp = element;
        let str = tmp.commodityThName + ' (' + tmp.commodityCode + ') ';
        tmp.autoCompleteName = str;
        element = tmp;
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
      return obj1.cpipId - obj2.cpipId;
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
      this.listMapCPA.push(this.createMappingFromDB(element.cpip, element.weight, element.commodityCode, element.commodityThName));
    });
  }

  private _filter(value: string): string[] {
    
    const filterValue = value;
    
    return this.options.filter(option => 
      option.autoCompleteName ? option.autoCompleteName.toLowerCase().includes(filterValue): true);
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
      console.log('this.listMapCPA === ',this.listMapCPA);
      
    }
  }

  selectCPA() {
    this.showEror = false;
  }

  createMapping(cpa): FormGroup {
    return this.formBuilder.group({
      weight: [0],
      cpip: [cpa, Validators.required],
    });
  }

  createMappingFromDB(cpa, weight, commodityCode, commodityThName): FormGroup {
   let cpipModel = new CpipModel()
   cpipModel.cpipId = cpa;
   cpipModel.commodityCode  = commodityCode;
   cpipModel.commodityThName = commodityThName;
   let str = commodityThName + ' (' + commodityCode + ') ';
   cpipModel.autoCompleteName = str;

    return this.formBuilder.group({
      weight: [weight],
      cpip: [cpipModel,Validators.required],
      // commodityCode: [commodityCode],
      // commodityThName: [commodityThName]
    });
  }

  onSubmit() {
    this.submitted = true;
    this.checkWeight = false;
    if (this.mapCPAForm.invalid) {
      let listArr = <FormArray>this.mapCPAForm.controls['listCPA'];
      console.log(listArr.length);
      if (this.deleteMode && listArr.length == 0) {
        this.addSwal.show();
      }
      else {
        this.warningSwal.title = "กรุณาจับคู่ <br />CPIP"
        this.warningSwal.show();
        return
      }
    } else {
      let listArr = <FormArray>this.mapCPAForm.controls['listCPA'];
      let sumWeight = 0;
      listArr.value.forEach(element => {
        console.log(element);
        if(element.weight === 0  || element.weight ===  null){

          this.checkWeight = true;
        }
        // console.log('this.checkWeight ==== ',this.checkWeight);
        
        
        sumWeight += element.weight;
      });
      console.log('this.checkWeight ==== ',this.checkWeight);
      if(!this.checkWeight){
        if (sumWeight > this.weightData.adjustedWeight) {
            this.warningSwal.title = "น้ำหนักเกิน"
            this.warningSwal.text = "กรุณากำหนดน้ำหนักใหม่"
            this.warningSwal.show();
          } else if (this.weigthSum === 0) {
           this.warningSwal.title = "กรุณากำหนดน้ำหนัก<br />CPIP"
           this.warningSwal.show();
           return
          }
           else {
          this.addSwal.show();
          }
    }
    }
  }

  get formData() { 
    return this.mapCPAForm.get('listCPA') as FormArray 
  }
  testItem(item){
    console.log('item ====== ',item);
    
  }

  removeCPAOnselect(cpa) {
    let index = this.options.findIndex(x => x.cpipId == cpa.cpipId);
    this.options.splice(index, 1);
  }

  removeGroup(i: number) {
    const listArr = <FormArray>this.mapCPAForm.controls['listCPA'];
    console.log(listArr.get([i]).value.cpip);
    console.log(listArr.get([i]).value);
    this.options.push(listArr.get([i]).value.cpip);
    this.mappingCPAInit();
    listArr.removeAt(i);
  }

  submitMappingCPA() {
    this.loading.show();
    let insertAndUpdateMappingCPAWithWeightRequest = new InsertAndUpdateMappingCPAWithWeightRequest();
    insertAndUpdateMappingCPAWithWeightRequest.weightDataId = this.mapCPAForm.controls['weightDataId'].value;
    insertAndUpdateMappingCPAWithWeightRequest.weightId = this.mapCPAForm.controls['weightId'].value;
    insertAndUpdateMappingCPAWithWeightRequest.listMapping = [];
    const listArr = <FormArray>this.mapCPAForm.controls['listCPA'];
    let sumWeight = 0;
    console.log(listArr.value);
    
    listArr.value.forEach(element => {
      console.log(element);
      
      sumWeight += element.weight;
      let data = {
        'weight': element.weight,
        'cpipId': element.cpip.cpipId
        // 'cpipId': element.cpip.cpipId ? element.cpip.cpipId: element.cpip.cpip ? element.cpip.cpip : element.cpip
      }
      insertAndUpdateMappingCPAWithWeightRequest.listMapping.push(data);
    });
    this.weightService.mappingCPAWithWeight(insertAndUpdateMappingCPAWithWeightRequest).subscribe((res) => {
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
        console.log('element ==== ',res);
        res.listCPA.forEach(element => {
          let tmp = element;
          let str = tmp.commodityThName + ' (' + tmp.commodityCode + ') ';
          tmp.autoCompleteName = str;
          this.options.push(tmp);
          // console.log('tmp ==== ',tmp);
        });
        
      }
      if (res.listDefaultCPA.length > 0) {
        this.listMapCPA = this.mapCPAForm.get('listCPA') as FormArray;
        res.listDefaultCPA.forEach(element => {
          let tmp = element;
          let str = tmp.commodityThName + ' (' + tmp.commodityCode + ') ';
          tmp.autoCompleteName = str;
          this.listMapCPA.push(this.createMapping(tmp));
          console.log('tmp2 ==== ',tmp);
          
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
