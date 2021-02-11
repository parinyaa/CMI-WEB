import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';

@Component({
  selector: 'app-dialog-addcommoditycal',
  templateUrl: './dialog-addcommoditycal.component.html',
  styleUrls: ['./dialog-addcommoditycal.component.scss']
})
export class DialogAddcommoditycalComponent implements OnInit {
  @ViewChild('addCommodityCalSwal',{static:false}) addCommodityCalSwal:SwalComponent;
  @ViewChild('succussCommodityCalSwal',{static:false}) succussCommodityCalSwal:SwalComponent;
  @ViewChild('errorCommodityCalSwal',{static:false}) errorCommodityCalSwal:SwalComponent;
  addCommodityCalForm:FormGroup;
  submitted = false;
  constructor(
    public dialogRef: MatDialogRef<DialogAddcommoditycalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _formBuilder:FormBuilder
  ) { }

  ngOnInit() {
    this.addCommodityCalForm = this._formBuilder.group({
      code:['',Validators.required],
      commodityCode:['',Validators.required]
    })
  }

  get f(){return this.addCommodityCalForm.controls;}

  onSubmit(){
    this.submitted = true;
    if(this.addCommodityCalForm.invalid){
      return;
    }else{
      this.addCommodityCalSwal.show();
    }
  }

  addCommodityCal(){
    this.succussCommodityCalSwal.show();
  }

  closeDialog(){
    this.dialogRef.close(this.addCommodityCalForm.value);
  }

}
