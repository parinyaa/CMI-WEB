import { SopEditRequest } from './../../../../shared/models/soptree/request/SopEditRequest';
import { SoptreeService } from './../../../../core/service/soptree/soptree.service';
import { noWhitespaceValidator } from 'src/app/shared/common/noWhitespaceValidator';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { ThrowStmt } from '@angular/compiler';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-dialog-edittreesop',
  templateUrl: './dialog-edittreesop.component.html',
  styleUrls: ['./dialog-edittreesop.component.scss']
})
export class DialogEdittreesopComponent implements OnInit {
  @ViewChild("saveSopTreeSwal",{static:false}) saveSopTreeSwal:SwalComponent;
  @ViewChild("sucessSopTreeSwal",{static:false}) sucessSopTreeSwal:SwalComponent;
  editSopForm:FormGroup;
  submitted = false;
  constructor(
    public dialogRef: MatDialogRef<DialogEdittreesopComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _formBuilder:FormBuilder,
    private noWhitespaceValidator:noWhitespaceValidator,
    private soptreeService:SoptreeService,
    private sopEditRequest:SopEditRequest,
    private loading:NgxSpinnerService
  ) { }

  ngOnInit() {
    console.log(this.data);
    this.editSopForm = this._formBuilder.group({
      sopCode:['',Validators.required],
      sopThName:['',Validators.required,this.noWhitespaceValidator.noWhitespace],
      sopEnName:['',Validators.required,this.noWhitespaceValidator.noWhitespace]
    });
    this.setEditFormInput();
  } 

  setEditFormInput(){
    this.editSopForm.controls['sopCode'].setValue(this.data.sopCode);
    this.editSopForm.controls['sopThName'].setValue(this.data.sopThName);
    this.editSopForm.controls['sopEnName'].setValue(this.data.sopEnName);
  }

  get f(){return this.editSopForm.controls;}

  onSubmit(){
    this.submitted = true;
    if(this.editSopForm.invalid){
       return;
    }else{
      this.saveSopTreeSwal.show();
    }
  }

  closeDialog(){
    this.dialogRef.close(true);
  }

  onEditSopTree(){
    this.loading.show();
    this.sopEditRequest.sopThName = this.editSopForm.controls['sopThName'].value;
    this.sopEditRequest.sopEnName = this.editSopForm.controls['sopEnName'].value;
    this.sopEditRequest.sopId = this.data.sopId;
    this.soptreeService.editSopTree(this.sopEditRequest).subscribe(
      (res) => {
        this.loading.hide();
        this.sucessSopTreeSwal.show();
      },
      (error) => {
        this.loading.hide();
      }
    )
  }

}
