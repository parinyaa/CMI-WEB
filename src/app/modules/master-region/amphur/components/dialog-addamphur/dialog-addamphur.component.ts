import { noWhitespaceValidator } from 'src/app/shared/common/noWhitespaceValidator';
import { NgxSpinnerService } from 'ngx-spinner';
import { AmphurService } from './../../../../../core/service/amphur/amphur.service';
import { AmphurAddRequest } from './../../../../../shared/models/request/amphurAddRequest';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { InputUtils } from 'src/app/core/utils/inputUtils/InputUtils';

@Component({
  selector: 'app-dialog-addamphur',
  templateUrl: './dialog-addamphur.component.html',
  styleUrls: ['./dialog-addamphur.component.scss']
})
export class DialogAddamphurComponent implements OnInit {
  @ViewChild('addAmphurSwal', { static: false }) addProvinceSwal: SwalComponent;
  @ViewChild('succussAmphurSwal', { static: false }) succussAmphurSwal: SwalComponent;
  @ViewChild('errorAmphurSwal', { static: false }) errorAmphurSwal: SwalComponent;
  addAmphurForm: FormGroup;
  submitted = false;
  constructor(
    public dialogRef: MatDialogRef<DialogAddamphurComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _formBuilder: FormBuilder,
    private requstAmphur: AmphurAddRequest,
    private amphurService: AmphurService,
    private loading: NgxSpinnerService,
    private noWhitespaceValidator: noWhitespaceValidator,
    public inputUtils: InputUtils
  ) { }

  ngOnInit() {
    this.addAmphurForm = this._formBuilder.group({
      amphurCode: ['', Validators.required, this.noWhitespaceValidator.noWhitespace],
      amphurName: ['', Validators.required]
    })
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  get f() { return this.addAmphurForm.controls; }

  onSubmit() {
    this.submitted = true;
    if (this.addAmphurForm.invalid) {
      return;
    } else {
      this.addProvinceSwal.show();
    }
  }

  addAmphur() {
    this.loading.show();
    this.requstAmphur.amphurCode = this.addAmphurForm.controls['amphurCode'].value;
    this.requstAmphur.amphurName = this.addAmphurForm.controls['amphurName'].value;
    this.requstAmphur.provinceId = this.data;
    this.amphurService.createAmphur(this.requstAmphur)
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
