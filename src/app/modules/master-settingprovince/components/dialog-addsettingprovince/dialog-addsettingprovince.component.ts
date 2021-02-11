import { ProvinceService } from './../../../../core/service/province/province.service';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, Inject, ViewChild } from '@angular/core';

@Component({
  selector: 'app-dialog-addsettingprovince',
  templateUrl: './dialog-addsettingprovince.component.html',
  styleUrls: ['./dialog-addsettingprovince.component.scss']
})
export class DialogAddsettingprovinceComponent implements OnInit {
  @ViewChild('addDataSwal',{static:false}) addDataSwal:SwalComponent;
  @ViewChild('succussDataSwal',{static:false}) succussDataSwal:SwalComponent;
  @ViewChild('errorSwal',{static:false}) errorSwal:SwalComponent;
  addFormGroup:FormGroup;
  submitted = false;
  province = new Array;
  result:any;
  constructor(
    public dialogRef: MatDialogRef<DialogAddsettingprovinceComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _formBuilder:FormBuilder
  ) { }

  ngOnInit() {
    this.province = this.data.province;
    this.addFormGroup = this._formBuilder.group({
      province:['',Validators.required],
      surveyCode:['',Validators.required],
      sourceCode:['',Validators.required],
      commodityCode:['',Validators.required],
    })
  }

  get f(){return this.addFormGroup.controls;}

  onSubmit(){
    this.submitted = true;
    if(this.addFormGroup.invalid){
      return;
    }else{
      this.addDataSwal.show();
    }
  }

  onAddData(){ 
    let province = this.addFormGroup.controls['province'].value;
    let data =  {provinceCode:province.provinceCode,
                provinceName:province.provinceName,
                surveyCode:this.addFormGroup.controls['surveyCode'].value,
                sourceCode:this.addFormGroup.controls['sourceCode'].value,
                commodityCode:this.addFormGroup.controls['commodityCode'].value};
    this.result = data;
    this.succussDataSwal.show();
  }

  closeDialog(){
    this.dialogRef.close(this.result);
  }

  selectionChange(evt){
    console.log(evt);
  }



}
