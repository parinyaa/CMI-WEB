import { noWhitespaceValidator } from 'src/app/shared/common/noWhitespaceValidator';
import { RegionAddRequest } from '../../../../../shared/models/region/request/regionAddRequest';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { RegionService } from 'src/app/core/service/region/region.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { InputUtils } from 'src/app/core/utils/inputUtils/InputUtils';

@Component({
  selector: 'app-dialog-addregion',
  templateUrl: './dialog-addregion.component.html',
  styleUrls: ['./dialog-addregion.component.scss']
})
export class DialogAddregionComponent implements OnInit {
  @ViewChild('addSwal', { static: false }) addSwal: SwalComponent;
  @ViewChild('succussSwal', { static: false }) succussSwal: SwalComponent;
  @ViewChild('errorSwal', { static: false }) errorSwal: SwalComponent;
  addRegionForm: FormGroup;
  submitted = false;
  constructor(
    public dialogRef: MatDialogRef<DialogAddregionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _FormBuild: FormBuilder,
    private regionService: RegionService,
    private regionAddRequest: RegionAddRequest,
    private loading: NgxSpinnerService,
    private noWhitespaceValidator: noWhitespaceValidator,
    public inputUtils: InputUtils
  ) { }

  ngOnInit() {
    this.addRegionForm = this._FormBuild.group({
      regionCode: ['', Validators.required, this.noWhitespaceValidator.noWhitespace],
      regionName: ['', Validators.required]
    })
  }

  get f() { return this.addRegionForm.controls; }

  onSubmit() {
    this.submitted = true;
    if (this.addRegionForm.invalid) {
      return
    } else {
      this.addSwal.show();
    }
  }

  addRegion() {
    this.loading.show();
    this.regionAddRequest.regionCode = this.addRegionForm.controls['regionCode'].value;
    this.regionAddRequest.regionName = this.addRegionForm.controls['regionName'].value;
    this.regionService.createRegion(this.regionAddRequest).subscribe(
      (res) => {
        this.loading.hide();
        this.succussSwal.show();
      },
      (error) => {
        console.log(error.error.messageEn);
        this.errorSwal.title = error.error.messageTh;
        this.errorSwal.text = error.error.messageEn;
        this.loading.hide();
        this.errorSwal.show();
      }
    )
  }

  closeDialog() {
    this.dialogRef.close(true);
  }


}
