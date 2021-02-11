import { noWhitespaceValidator } from 'src/app/shared/common/noWhitespaceValidator';
import { AmphurEditRequest } from './../../../../../shared/models/request/amphurEditRequest';
import { AmphurService } from './../../../../../core/service/amphur/amphur.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { InputUtils } from 'src/app/core/utils/inputUtils/InputUtils';

@Component({
  selector: 'app-dialog-editamphur',
  templateUrl: './dialog-editamphur.component.html',
  styleUrls: ['./dialog-editamphur.component.scss']
})
export class DialogEditamphurComponent implements OnInit {
  @ViewChild('editAmphurSwal', { static: false }) editAmphurSwal: SwalComponent;
  @ViewChild('succussAmphurSwal', { static: false }) succussAmphurSwal: SwalComponent;
  @ViewChild('errorAmphurSwal', { static: false }) errorAmphurSwal: SwalComponent;
  editAmphurForm: FormGroup;
  submitted = false;
  constructor(
    public dialogRef: MatDialogRef<DialogEditamphurComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _formBuilder: FormBuilder,
    private amphurSerivce: AmphurService,
    private loading: NgxSpinnerService,
    private requstAmphur: AmphurEditRequest,
    private noWhitespaceValidator: noWhitespaceValidator,
    public inputUtils: InputUtils
  ) { }

  ngOnInit() {
    this.editAmphurForm = this._formBuilder.group({
      amphurCode: ['', Validators.required, this.noWhitespaceValidator.noWhitespace],
      amphurName: ['', Validators.required]
    })
    this.editAmphurForm.controls['amphurCode'].setValue(this.data.amphur.amphurCode);
    this.editAmphurForm.controls['amphurName'].setValue(this.data.amphur.amphurName);
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  get f() { return this.editAmphurForm.controls; }

  onSubmit() {
    this.submitted = true;
    if (this.editAmphurForm.invalid) {
      return;
    } else {
      this.editAmphurSwal.show();
    }
  }

  editProvince() {
    this.loading.show();
    console.log('reqAm',this.data.amphur.cpipMsProvince.provinceId);
    this.requstAmphur.amphurCode = this.editAmphurForm.controls['amphurCode'].value;
    this.requstAmphur.amphurName = this.editAmphurForm.controls['amphurName'].value;
    this.requstAmphur.provinceId = this.data.amphur.cpipMsProvince.provinceId;
    this.amphurSerivce.updateAmphur(this.requstAmphur)
      .subscribe(
        (res) => {
          this.loading.hide();
          this.succussAmphurSwal.show();
        },
        (error) => {
          this.loading.hide();
          this.errorAmphurSwal.title = error.error.messageTh;
          this.errorAmphurSwal.text = error.error.messageEn;
          this.errorAmphurSwal.show();
        }
      )
  }

  closeDialog() {
    this.dialogRef.close(true);
  }

}
