import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';

@Component({
  selector: 'app-dialog-editcommoditycal',
  templateUrl: './dialog-editcommoditycal.component.html',
  styleUrls: ['./dialog-editcommoditycal.component.scss']
})
export class DialogEditcommoditycalComponent implements OnInit {
  @ViewChild('editCommodityCalSwal',{static:false}) editCommodityCalSwal:SwalComponent;
  @ViewChild('succussCommodityCalSwal',{static:false}) succussCommodityCalSwal:SwalComponent;
  @ViewChild('errorCommodityCalSwal',{static:false}) errorCommodityCalSwal:SwalComponent;
  editCommodityCalForm: FormGroup;
  submitted = false;
  constructor(
    public dialogRef: MatDialogRef<DialogEditcommoditycalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.editCommodityCalForm = this._formBuilder.group({
      code: ['', Validators.required],
      commodityCode: ['', Validators.required]
    })
    this.editCommodityCalForm.controls['code'].setValue(this.data.code);
    this.editCommodityCalForm.controls['commodityCode'].setValue(this.data.commodityCode);
  }

  get f() { return this.editCommodityCalForm.controls; }

  onSubmit() {
    this.submitted = true;
    if (this.editCommodityCalForm.invalid) {
      return;
    } else {
      this.editCommodityCalSwal.show();
    }
  }

  editCommodityCal() {
    this.succussCommodityCalSwal.show();
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

}
