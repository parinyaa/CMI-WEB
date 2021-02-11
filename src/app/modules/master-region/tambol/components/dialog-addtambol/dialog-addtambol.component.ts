import { noWhitespaceValidator } from 'src/app/shared/common/noWhitespaceValidator';
import { TambolserviceService } from './../../../../../core/service/tambol/tambolservice.service';
import { TambolAddRequest } from 'src/app/shared/models/tambol/request/tambolAddRequst';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { InputUtils } from 'src/app/core/utils/inputUtils/InputUtils';

@Component({
  selector: 'app-dialog-addtambol',
  templateUrl: './dialog-addtambol.component.html',
  styleUrls: ['./dialog-addtambol.component.scss']
})
export class DialogAddtambolComponent implements OnInit {
  @ViewChild('addSwal', { static: false }) addSwal: SwalComponent;
  @ViewChild('succussSwal', { static: false }) succussSwal: SwalComponent;
  @ViewChild('errorAmphurSwal', { static: false }) errorAmphurSwal: SwalComponent;


  addTambolForm: FormGroup;
  submitted = false;
  constructor(
    private _formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<DialogAddtambolComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private tambolService: TambolserviceService,
    private loading: NgxSpinnerService,
    private noWhitespaceValidator: noWhitespaceValidator,
    public inputUtils: InputUtils
  ) { }

  ngOnInit() {
    this.addTambolForm = this._formBuilder.group({
      tambolCode: ['', Validators.required, this.noWhitespaceValidator.noWhitespace],
      tambolName: ['', Validators.required]
    })
  }

  get f() { return this.addTambolForm.controls; }

  onSubmit() {
    this.submitted = true;
    if (this.addTambolForm.invalid) {
      return;
    } else {
      this.addSwal.show();
    }
  }

  onAddTambol() {
    this.loading.show();
    let request = new TambolAddRequest();
    request.amphurId = this.data ? this.data.amphurId : null;
    request.tambolCode = this.addTambolForm.controls['tambolCode'].value;
    request.tambolName = this.addTambolForm.controls['tambolName'].value;
    request.provinceId = this.data ? this.data.provinceId : null;
    this.tambolService.createTambol(request).subscribe(
      (res) => {
        this.loading.hide();
        this.succussSwal.show();
      },
      (error) => {
        this.errorAmphurSwal.title = error.error.messageTh;
        this.errorAmphurSwal.text = error.error.messageEn;
        this.loading.hide();
        this.errorAmphurSwal.show();
      }
    )
  }

  closeDialog() {
    this.dialogRef.close(true);
  }


}
