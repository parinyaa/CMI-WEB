import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, Inject, ViewChild } from '@angular/core';

@Component({
  selector: 'app-dialog-addoperator',
  templateUrl: './dialog-addoperator.component.html',
  styleUrls: ['./dialog-addoperator.component.scss']
})
export class DialogAddoperatorComponent implements OnInit {
  @ViewChild('addDataSwal',{static:false}) addDataSwal:SwalComponent;
  @ViewChild('succussDataSwal',{static:false}) succussDataSwal:SwalComponent;
  @ViewChild('errorSwal',{static:false}) errorSwal:SwalComponent;
  addDataMatrix:FormGroup;
  submitted = false;
  showprovince = false;
  constructor(
    public dialogRef: MatDialogRef<DialogAddoperatorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _formBuilder:FormBuilder
  ) { }

  ngOnInit() {
    this.addDataMatrix = this._formBuilder.group({
      surveyCode:['',Validators.required],
      sourceCode:['',Validators.required],
      commodityCode:['',Validators.required]
    })
  }

  get f(){return this.addDataMatrix.controls;}

  onSubmit(){
    this.submitted = true;
    if(this.addDataMatrix.invalid){
      return;
    }else{
      this.addDataSwal.show();
    }
  }

  onAddData(){
    this.succussDataSwal.show();
  }

  onChange(e){
    if(e == 1){
      this.showprovince = true;
    }else{
      this.showprovince = false;
    }
  }

  closeDialog(){
    this.dialogRef.close();
  }


}
