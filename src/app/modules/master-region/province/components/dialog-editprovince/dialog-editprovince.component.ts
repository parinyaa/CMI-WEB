import { noWhitespaceValidator } from 'src/app/shared/common/noWhitespaceValidator';
import { ProvinceService } from './../../../../../core/service/province/province.service';
import { ProvinceEditRequest } from './../../../../../shared/models/request/provinceEditRequest';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { InputUtils } from 'src/app/core/utils/inputUtils/InputUtils';

@Component({
  selector: 'app-dialog-editprovince',
  templateUrl: './dialog-editprovince.component.html',
  styleUrls: ['./dialog-editprovince.component.scss']
})
export class DialogEditprovinceComponent implements OnInit {
  @ViewChild('updataProvinceSwal', { static: false }) updataProvinceSwal: SwalComponent;
  @ViewChild('succussProvinceSwal', { static: false }) succussProvinceSwal: SwalComponent;
  @ViewChild('errorProvinceSwal', { static: false }) errorProvinceSwal: SwalComponent;

  editProvinceForm: FormGroup;
  submitted = false;
  constructor(
    public dialogRef: MatDialogRef<DialogEditprovinceComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _formBuilder: FormBuilder,
    private editRequest: ProvinceEditRequest,
    private provinceService: ProvinceService,
    private loading: NgxSpinnerService,
    private noWhitespaceValidator: noWhitespaceValidator,
    public inputUtils: InputUtils
  ) { }

  ngOnInit() {
    this.editProvinceForm = this._formBuilder.group({
      provinceCode: ['', Validators.required, this.noWhitespaceValidator.noWhitespace],
      provinceName: ['', Validators.required]
    })
    this.editProvinceForm.controls['provinceCode'].setValue(this.data.province.provinceCode);
    this.editProvinceForm.controls['provinceName'].setValue(this.data.province.provinceName);
  }

  get f() { return this.editProvinceForm.controls; }

  onSubmit() {
    this.submitted = true;
    if (this.editProvinceForm.invalid) {
      return;
    } else {
      this.updataProvinceSwal.show();
    }
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  editProvince() {
    this.loading.show();
    this.editRequest.provinceCode = this.editProvinceForm.controls['provinceCode'].value;
    this.editRequest.provinceName = this.editProvinceForm.controls['provinceName'].value;
    this.provinceService.updateProvince(this.editRequest)
      .subscribe(
        (res) => {
          this.loading.hide();
          this.succussProvinceSwal.show();
        },
        (error) => {
          this.loading.hide();
          this.errorProvinceSwal.title = error.error.messageTh;
          this.errorProvinceSwal.text = error.error.messageEn;
          this.errorProvinceSwal.show();
        }
      )

  }

  closeDialog() {
    this.dialogRef.close(true);
  }

}
