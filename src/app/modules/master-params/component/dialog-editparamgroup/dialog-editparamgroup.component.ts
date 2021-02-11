import { ParamGroupEditRequest } from './../../../../shared/models/param/request/ParamGroupEditRequest';
import { ParamService } from 'src/app/core/service/param/param.service';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-dialog-editparamgroup',
  templateUrl: './dialog-editparamgroup.component.html',
  styleUrls: ['./dialog-editparamgroup.component.scss']
})
export class DialogEditparamgroupComponent implements OnInit {
  @ViewChild("editParamGroupSwal",{static:false}) editParamGroupSwal: SwalComponent;
  @ViewChild("succussParamGroupSwal",{static:false}) succussParamGroupSwal: SwalComponent;
  editParamsGroupForm:FormGroup;
  submitted = false;
  groupDeleted = "Y";
  isNotDeleted = this.data.isDeleted != this.groupDeleted ? true : false;
  statusDelete = this.isNotDeleted;
  color = 'primary';
  txtStatus = this.statusDelete ? "เปิดการใช้งาน":"ปิดการใช้งาน";
  constructor(
    public dialogRef: MatDialogRef<DialogEditparamgroupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _formBuilder:FormBuilder,
    private paramService:ParamService,
    private paramGroupEditRequest:ParamGroupEditRequest,
    private loading:NgxSpinnerService
  ) { }

  ngOnInit() {
    this.editParamsGroupForm = this._formBuilder.group({
      paramGroup:['',Validators.required],
      paramGroupNameTh:['',Validators.required],
      paramGroupNameEn:['',Validators.required],
      // isStatusDeleted:[this.isNotDeleted]
    })
    this.editParamsGroupForm.controls['paramGroup'].setValue(this.data.paramGroup);
    this.editParamsGroupForm.controls['paramGroupNameTh'].setValue(this.data.paramLocalDescription);
    this.editParamsGroupForm.controls['paramGroupNameEn'].setValue(this.data.paramEnDescription);
    // this.editParamsGroupForm.controls['isStatusDeleted'].setValue(this.data.isDeleted);
    console.log(this.data);
  }

  get f(){return this.editParamsGroupForm.controls;}

  onSubmit(){
    this.submitted = true;
    if(this.editParamsGroupForm.invalid){
      return;
    }else{
      this.editParamGroupSwal.show();
    }

  }

  onEditParamGroup(){
    this.loading.show();
    this.paramGroupEditRequest.paramGroupId = this.data.paramGroupId;
    this.paramGroupEditRequest.paramGroup = this.data.paramGroup
    this.paramGroupEditRequest.paramLocalDescription = this.editParamsGroupForm.controls['paramGroupNameTh'].value;
    this.paramGroupEditRequest.paramEnDescription = this.editParamsGroupForm.controls['paramGroupNameEn'].value;
    // this.paramGroupEditRequest.isDeleted = this.editParamsGroupForm.controls['isStatusDeleted'].value ? "Y":"N";
    this.paramGroupEditRequest.isDeleted = this.statusDelete ? "N":"Y";
    this.paramService.editParamGroup(this.paramGroupEditRequest).subscribe(
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

  closeDialog(){
    this.dialogRef.close(true);
  }
  changeStatus(){
    this.statusDelete = !this.statusDelete;
    this.txtStatus = this.statusDelete ? "เปิดการใช้งาน":"ปิดการใช้งาน";
  }
}
