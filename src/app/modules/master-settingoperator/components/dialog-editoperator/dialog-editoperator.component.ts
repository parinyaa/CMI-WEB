import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, Inject, ViewChild } from '@angular/core';

@Component({
  selector: 'app-dialog-editoperator',
  templateUrl: './dialog-editoperator.component.html',
  styleUrls: ['./dialog-editoperator.component.scss']
})
export class DialogEditoperatorComponent implements OnInit {
  @ViewChild('editDataSwal',{static:false}) editDataSwal:SwalComponent;
  @ViewChild('succussDataSwal',{static:false}) succussDataSwal:SwalComponent;
  @ViewChild('errorSwal',{static:false}) errorSwal:SwalComponent;
  editFormGroup:FormGroup;
  submitted = false;
  constructor(
    public dialogRef: MatDialogRef<DialogEditoperatorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _formBuilder:FormBuilder
  ) { }

  ngOnInit() {
    console.log(this.data);
    this.editFormGroup = this._formBuilder.group({
      surveyCode:['',Validators.required],
      sourceCode:['',Validators.required],
      commodityCode:['',Validators.required]
    })
    this.editFormGroup.controls['surveyCode'].setValue(this.data.surveyCode);
    this.editFormGroup.controls['sourceCode'].setValue(this.data.sourceCode);
    this.editFormGroup.controls['commodityCode'].setValue(this.data.commodityCode);
  }

  get f(){return this.editFormGroup.controls;}

  onSubmit(){
    this.submitted = true;
    if(this.editFormGroup.invalid){
      return;
    }else{
      this.editDataSwal.show();
    }
  }

  onEditData(){
    this.succussDataSwal.show();
  }

  closeDialog(){
    this.dialogRef.close();
  }


}
