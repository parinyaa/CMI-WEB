import { ParamGroupCreateRequest } from './../../../../shared/models/param/request/ParamGroupCreateRequest';
import { ParamService } from 'src/app/core/service/param/param.service';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-dialog-addparamsgroup',
  templateUrl: './dialog-addparamsgroup.component.html',
  styleUrls: ['./dialog-addparamsgroup.component.scss']
})
export class DialogAddparamsgroupComponent implements OnInit {
  @ViewChild("addParamGroupSwal",{static:false}) addParamGroupSwal:SwalComponent;
  @ViewChild("succussParamGroupSwal",{static:false}) succussParamGroupSwal:SwalComponent;
  
  addParamsGroupForm:FormGroup
  submitted = false;
  constructor(
    public dialogRef: MatDialogRef<DialogAddparamsgroupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _formBuilder:FormBuilder,
    private paramService:ParamService,
    private paramGroupCreateRequest:ParamGroupCreateRequest,
    private loading:NgxSpinnerService
  ) { }

  ngOnInit() {
    this.addParamsGroupForm = this._formBuilder.group({
      paramGroup:['',Validators.required],
      paramGroupNameTh:['',Validators.required],
      paramGroupNameEn:['',Validators.required]
    })
  }

  onSaveParamGroup(){
    this.loading.show();
    this.paramGroupCreateRequest.paramGroup = this.addParamsGroupForm.controls['paramGroup'].value;
    this.paramGroupCreateRequest.paramLocalDescription = this.addParamsGroupForm.controls['paramGroupNameTh'].value;
    this.paramGroupCreateRequest.paramEnDescription = this.addParamsGroupForm.controls['paramGroupNameEn'].value;
    this.paramService.createParamGroup(this.paramGroupCreateRequest).subscribe(
      (res) => {
        this.loading.hide();
        this.succussParamGroupSwal.show();
      },
      (error) => {
        this.loading.hide();
        console.log(error);
      }
    )
  }

  get f(){return this.addParamsGroupForm.controls;}

  onSubmit(){
    this.submitted = true;
    if(this.addParamsGroupForm.invalid){
      return;
    }else{
      this.addParamGroupSwal.show();
    }

  }

  closeDialog(){
    this.dialogRef.close(true);
  }

 


}
