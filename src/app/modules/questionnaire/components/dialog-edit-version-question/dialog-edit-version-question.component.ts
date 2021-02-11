import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { NgxSpinnerService } from 'ngx-spinner';
import { DateAdapter } from '@angular/material';
import { InsertVersionRequest } from 'src/app/shared/models/questionnaire/request/InsertVersionRequest';
import { QuestionnaireService } from 'src/app/core/service/questionnaire/questionnaire.service';
import { UpdateVersionRequest } from 'src/app/shared/models/questionnaire/request/UpdateVersionRequest';

@Component({
  selector: 'app-dialog-edit-version-question',
  templateUrl: './dialog-edit-version-question.component.html',
  styleUrls: ['./dialog-edit-version-question.component.scss']
})
export class DialogEditVersionQuestionComponent implements OnInit {
  @ViewChild('addSwal', { static: false }) addSwal: SwalComponent;
  @ViewChild('succussSwal', { static: false }) succussSwal: SwalComponent;
  @ViewChild('errorSwal', { static: false }) errorSwal: SwalComponent;

  submitted = false;
  editVersionQuestionForm: FormGroup;
  checked = false;
  isDisabled = false;

  constructor(
    public dialogRef: MatDialogRef<DialogEditVersionQuestionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _FormBuild: FormBuilder,
    private loading: NgxSpinnerService,
    private dateAdapter: DateAdapter<Date>,
    private updateVersionRequest: UpdateVersionRequest,
    private questionnaireService: QuestionnaireService
  ) {
    dateAdapter.setLocale('th-TH');
  }

  ngOnInit() {

    this.editVersionQuestionForm = this._FormBuild.group({
      versionId: ['', Validators.required],
      versionCode: ['', Validators.required],
      versionDesc: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
    });

    this.editVersionQuestionForm.controls['versionId'].setValue(this.data.versionId);
    this.editVersionQuestionForm.controls['versionCode'].setValue(this.data.versionCode);
    this.editVersionQuestionForm.controls['versionDesc'].setValue(this.data.description);
    this.editVersionQuestionForm.controls['startDate'].setValue(new Date(this.data.startDate));
    this.editVersionQuestionForm.controls['endDate'].setValue(new Date(this.data.endDate));

  }

  onSubmit() {
    this.submitted = true;
    if (this.editVersionQuestionForm.invalid) {
      return
    } else {
      this.addSwal.show();
    }
  }

  editVersion() {
    this.loading.show();
    this.updateVersionRequest.versionId = this.editVersionQuestionForm.getRawValue().versionId;
    this.updateVersionRequest.versionCode = this.editVersionQuestionForm.getRawValue().versionCode;
    this.updateVersionRequest.versionDesc = this.editVersionQuestionForm.getRawValue().versionDesc;
    this.updateVersionRequest.startDate = this.editVersionQuestionForm.getRawValue().startDate;
    this.updateVersionRequest.endDate = this.editVersionQuestionForm.getRawValue().endDate;
    this.questionnaireService.updateVersion(this.updateVersionRequest).subscribe(
      (res) => {
        this.loading.hide();
        this.succussSwal.show();
      },
      (error) => {
        console.log(error.error.messageEn);
        this.errorSwal.text = error.error.messageEn;
        this.errorSwal.title = error.error.messageTh;
        this.loading.hide();
        this.errorSwal.show();
      }
    );
  }

  get f() { return this.editVersionQuestionForm.controls; }

  closeDialog() {
    this.dialogRef.close(true);
  }


}
