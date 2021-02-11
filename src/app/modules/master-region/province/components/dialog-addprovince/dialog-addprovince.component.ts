import { noWhitespaceValidator } from 'src/app/shared/common/noWhitespaceValidator';
import { ProvinceService } from './../../../../../core/service/province/province.service';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { ProvinceAddRequst } from './../../../../../shared/models/request/provinceAddRequest';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { InputUtils } from 'src/app/core/utils/inputUtils/InputUtils';

@Component({
  selector: 'app-dialog-addprovince',
  templateUrl: './dialog-addprovince.component.html',
  styleUrls: ['./dialog-addprovince.component.scss']
})
export class DialogAddprovinceComponent implements OnInit {
  @ViewChild('addProvinceSwal', { static: false }) addProvinceSwal: SwalComponent;
  @ViewChild('succussProvinceSwal', { static: false }) succussProvinceSwal: SwalComponent;
  @ViewChild('errorProvinceSwal', { static: false }) errorProvinceSwal: SwalComponent;
  addProvinceForm: FormGroup;
  submitted = false;
  constructor(
    public dialogRef: MatDialogRef<DialogAddprovinceComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _formBuilder: FormBuilder,
    private provinceAddRequest: ProvinceAddRequst,
    private provinceService: ProvinceService,
    private loading: NgxSpinnerService,
    private noWhitespaceValidator: noWhitespaceValidator,
    public inputUtils: InputUtils
  ) { }

  ngOnInit() {
    this.addProvinceForm = this._formBuilder.group({
      provinceCode: ['', Validators.required, this.noWhitespaceValidator.noWhitespace],
      provinceName: ['', Validators.required]
    })
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  get f() { return this.addProvinceForm.controls; }

  onSubmit() {
    this.submitted = true;
    if (this.addProvinceForm.invalid) {
      return;
    } else {
      this.addProvinceSwal.show();
    }
  }

  addProvince() {
    this.loading.show();
    this.provinceAddRequest.provinceCode = this.addProvinceForm.controls['provinceCode'].value;
    this.provinceAddRequest.provinceName = this.addProvinceForm.controls['provinceName'].value;
    this.provinceAddRequest.regionId = this.data.regionId;
    this.provinceService.createProvince(this.provinceAddRequest)
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
