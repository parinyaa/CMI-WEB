import { noWhitespaceValidator } from './../../../../shared/common/noWhitespaceValidator';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { ParamService } from 'src/app/core/service/param/param.service';
import { ParamInfoCreateRequest } from './../../../../shared/models/param/request/ParamInfoCreateRequest';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-dialog-addparaminfo',
  templateUrl: './dialog-addparaminfo.component.html',
  styleUrls: ['./dialog-addparaminfo.component.scss']
})
export class DialogAddparaminfoComponent implements OnInit {
  @ViewChild('addParamInfoSwal',{static:false}) addParamInfoSwal:SwalComponent;
  @ViewChild('succussParamInfoSwal',{static:false}) succussParamInfoSwal:SwalComponent;
  addParamsInfoForm:FormGroup;
  submitted = false;
  constructor(
    public dialogRef: MatDialogRef<DialogAddparaminfoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _formBuilder:FormBuilder,
    private paramInfoCreateRequest:ParamInfoCreateRequest,
    private paramService:ParamService,
    private loading:NgxSpinnerService,
    private noWhitespaceValidator:noWhitespaceValidator
  
  ) { }

  ngOnInit() {
    this.addParamsInfoForm = this._formBuilder.group({
      paramCode:['',Validators.required,this.noWhitespaceValidator.noWhitespace],
      paramInfoNameTh:['',Validators.required,this.noWhitespaceValidator.noWhitespace],
      paramInfoNameEn:['',Validators.required,this.noWhitespaceValidator.noWhitespace],
      specialPurpose:[''],
      sortingOrder:['']
    })
  }

  get f(){return this.addParamsInfoForm.controls}

  onSubmit(){
    this.submitted = true;
    if(this.addParamsInfoForm.invalid){
      return
    }else{
      this.addParamInfoSwal.show();
    }
  }

  closeDialog(){
    this.dialogRef.close(true);
  }

  onSaveParamInfo(){
    this.loading.show();
    this.paramInfoCreateRequest.paramCode = this.addParamsInfoForm.controls['paramCode'].value;
    this.paramInfoCreateRequest.paramLocalDesc = this.addParamsInfoForm.controls['paramInfoNameTh'].value;
    this.paramInfoCreateRequest.paramEnDesc = this.addParamsInfoForm.controls['paramInfoNameEn'].value;
    this.paramInfoCreateRequest.paramGroup = this.data;
    this.paramInfoCreateRequest.specialPurpose = this.addParamsInfoForm.controls['specialPurpose'].value;
    this.paramInfoCreateRequest.sortingOrder = this.addParamsInfoForm.controls['sortingOrder'].value;
    this.paramService.createParamInfo(this.paramInfoCreateRequest).subscribe(
      (res) => {
        this.loading.hide();
        this.succussParamInfoSwal.show();
      },
      (error) => {
        this.loading.hide();
      }
    )
  }
  

}
