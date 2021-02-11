import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';

@Component({
  selector: 'app-dialog-editsettingprovince',
  templateUrl: './dialog-editsettingprovince.component.html',
  styleUrls: ['./dialog-editsettingprovince.component.scss']
})
export class DialogEditsettingprovinceComponent implements OnInit {
  @ViewChild("editDataSwal",{static:false}) editDataSwal:SwalComponent;
  @ViewChild("succussDataSwal",{static:false}) succussDataSwal:SwalComponent;
  
  editFormGroup:FormGroup;
  submitted = false;
  province:any;
  constructor(
    public dialogRef: MatDialogRef<DialogEditsettingprovinceComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _formBuilder:FormBuilder
  ) { }

  ngOnInit() {
    this.editFormGroup = this._formBuilder.group({
      province:['',Validators.required],
      surveyCode:['',Validators.required],
      sourceCode:['',Validators.required],
      commodityCode:['',Validators.required],
    })
    this.setFormEdit();
  }

  get f(){return this.editFormGroup.controls;}

  onSubmit(){
    this.submitted = true;
    if(this.editFormGroup.invalid){
      return;
    }
    else{
      this.editDataSwal.show();
    }
  }

  setFormEdit(){
    this.province = this.data.province;
    let province = this.province.find(x => x.provinceName == this.data.data.provinceName);
    this.editFormGroup.controls['province'].setValue(province);
    this.editFormGroup.controls['surveyCode'].setValue(this.data.data.surveyCode);
    this.editFormGroup.controls['sourceCode'].setValue(this.data.data.sourceCode);
    this.editFormGroup.controls['commodityCode'].setValue(this.data.data.commodityCode);
  }

  selectionChange(e){
    // console.log(e);
  }

  onEditData(){
    console.log(this.editFormGroup.value);
    this.succussDataSwal.show();
  }

  closeDialog(){
    this.dialogRef.close(this.editFormGroup.value);
  }
  

}
