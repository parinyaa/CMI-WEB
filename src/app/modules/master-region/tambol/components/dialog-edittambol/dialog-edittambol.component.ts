import { noWhitespaceValidator } from 'src/app/shared/common/noWhitespaceValidator';
import { TambolserviceService } from './../../../../../core/service/tambol/tambolservice.service';
import { TambolEditRequest } from 'src/app/shared/models/tambol/request/tambolEditRequest';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { InputUtils } from 'src/app/core/utils/inputUtils/InputUtils';

@Component({
  selector: 'app-dialog-edittambol',
  templateUrl: './dialog-edittambol.component.html',
  styleUrls: ['./dialog-edittambol.component.scss']
})
export class DialogEdittambolComponent implements OnInit {
  @ViewChild('editSwal', { static: false }) editSwal: SwalComponent;
  @ViewChild('succussSwal', { static: false }) succussSwal: SwalComponent;
  @ViewChild('errorTambolSwal', { static: false }) errorTambolSwal: SwalComponent;


  editTambolForm: FormGroup;
  submitted = false;
  constructor(
    private _formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<DialogEdittambolComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private tambolEditRequest: TambolEditRequest,
    private tambolService: TambolserviceService,
    private loading: NgxSpinnerService,
    private noWhitespaceValidator: noWhitespaceValidator,
    public inputUtils: InputUtils
  ) { }

  ngOnInit() {
    console.log('reqtam',this.data.cpipMsAmphur.amphurId)
    this.editTambolForm = this._formBuilder.group({
      tambolCode: ['', Validators.required, this.noWhitespaceValidator.noWhitespace],
      // postCode: ['', Validators.required, this.noWhitespaceValidator.noWhitespace],
      tambolName: ['', Validators.required]
    })
    console.log(this.data);
    this.editTambolForm.controls['tambolCode'].setValue(this.data.tambolCode);
    this.editTambolForm.controls['tambolName'].setValue(this.data.tambolName);
    // this.editTambolForm.controls['postCode'].setValue(this.data.postcode);
  }

  get f() { return this.editTambolForm.controls; }

  onSubmit() {
    this.submitted = true;
    if (this.editTambolForm.invalid) {
      return;
    } else {
      this.editSwal.show();
    }
  }

  onEditTambol() {
    this.loading.show();
    this.tambolEditRequest.tambolCode = this.editTambolForm.controls['tambolCode'].value
    this.tambolEditRequest.tambolName = this.editTambolForm.controls['tambolName'].value
    // this.tambolEditRequest.postCode = this.editTambolForm.controls['postCode'].value
    this.tambolEditRequest.amphurId = this.data.cpipMsAmphur.amphurId;
    this.tambolService.editTambol(this.tambolEditRequest).subscribe(
      (res) => {
        this.loading.hide();
        this.succussSwal.show();
      },
      (error) => {
        this.loading.hide();
        this.errorTambolSwal.title = error.error.messageTh;
        this.errorTambolSwal.text = error.error.messageEn;
        this.errorTambolSwal.show();
      }
    )
  }

  closeDialog() {
    this.dialogRef.close(true);
  }

}
