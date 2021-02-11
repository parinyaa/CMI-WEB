import { noWhitespaceValidator } from './../../../../shared/common/noWhitespaceValidator';
import { ParamInfoEditRequest } from './../../../../shared/models/param/request/ParamInfoEditRequest';
import { ParamService } from './../../../../core/service/param/param.service';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-dialog-editparaminfo',
  templateUrl: './dialog-editparaminfo.component.html',
  styleUrls: ['./dialog-editparaminfo.component.scss']
})
export class DialogEditparaminfoComponent implements OnInit {
  @ViewChild("editParamInfoSwal",{static:false}) editParamInfoSwal: SwalComponent;
  @ViewChild("succussParamInfoSwal",{static:false}) succussParamInfoSwal: SwalComponent;
  status = 'N';
  editParamsInfoForm:FormGroup;
  submitted = false;
  constructor(
    public dialogRef: MatDialogRef<DialogEditparaminfoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _formBuilder:FormBuilder,
    private paramService:ParamService,
    private paramInfoEditRequest:ParamInfoEditRequest,
    private loading:NgxSpinnerService,
    private noWhitespaceValidator:noWhitespaceValidator
  ) { }

  ngOnInit() {
    console.log(this.data);
    this.editParamsInfoForm = this._formBuilder.group({
      paramCode:['',Validators.required],
      paramInfoNameTh:['',Validators.required,this.noWhitespaceValidator.noWhitespace],
      paramInfoNameEn:['',Validators.required,this.noWhitespaceValidator.noWhitespace],
      specialPurpose:[''],
      sortingOrder:[''],
    })
    this.editParamsInfoForm.controls['paramCode'].setValue(this.data.paramCode);
    this.editParamsInfoForm.controls['paramInfoNameTh'].setValue(this.data.paramLocalDescription);
    this.editParamsInfoForm.controls['paramInfoNameEn'].setValue(this.data.paramEnDescription);
    this.editParamsInfoForm.controls['specialPurpose'].setValue(this.data.specialPurpose);
    this.editParamsInfoForm.controls['sortingOrder'].setValue(this.data.sortingOrder);
    this.status = this.data.isDeleted;
  }

  get f(){return this.editParamsInfoForm.controls}

  onSubmit(){
    this.submitted = true;
    if(this.editParamsInfoForm.invalid){
      return
    }else{
      this.editParamInfoSwal.show();
    }
  }

  closeDialog(){
    this.dialogRef.close(true);
  }

  onEditParamInfo(){
    this.loading.show();
    console.log(this.data);
    this.paramInfoEditRequest.paramInfoId = this.data.paramId;
    this.paramInfoEditRequest.paramCode = this.data.paramCode;
    this.paramInfoEditRequest.paramGroupId = this.data.paramGroupId;
    this.paramInfoEditRequest.paramLocalDesc = this.editParamsInfoForm.controls['paramInfoNameTh'].value;
    this.paramInfoEditRequest.paramEnDesc = this.editParamsInfoForm.controls['paramInfoNameEn'].value;
    this.paramInfoEditRequest.specialPurpose = this.editParamsInfoForm.controls['specialPurpose'].value;
    this.paramInfoEditRequest.sortingOrder = this.editParamsInfoForm.controls['sortingOrder'].value;
    this.paramInfoEditRequest.isDeleted = this.status;
    console.log( this.paramInfoEditRequest);
    this.paramService.editParamInfo(this.paramInfoEditRequest).subscribe(
      (res) => {
        this.loading.hide();
        this.succussParamInfoSwal.show();
      },
      (error) => {
        this.loading.hide();
        console.log(error);
      }
    )
  }
}
