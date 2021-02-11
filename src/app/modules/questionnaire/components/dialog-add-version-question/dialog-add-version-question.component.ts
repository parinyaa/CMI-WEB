import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { NgxSpinnerService } from 'ngx-spinner';
import { DateAdapter } from '@angular/material';
import { InsertVersionRequest } from 'src/app/shared/models/questionnaire/request/InsertVersionRequest';
import { QuestionnaireService } from 'src/app/core/service/questionnaire/questionnaire.service';
import {MatSnackBar} from '@angular/material/snack-bar';




@Component({
  selector: 'app-dialog-add-version-question',
  templateUrl: './dialog-add-version-question.component.html',
  styleUrls: ['./dialog-add-version-question.component.scss']
})
export class DialogAddVersionQuestionComponent implements OnInit {

  @ViewChild('addSwal', { static: false }) addSwal: SwalComponent;
  @ViewChild('succussSwal', { static: false }) succussSwal: SwalComponent;
  @ViewChild('errorSwal', { static: false }) errorSwal: SwalComponent;

  submitted = false;
  addVersionQuestionForm: FormGroup;

  minStartDate = new Date();
  minEndDate = new Date();


  constructor(
    public dialogRef: MatDialogRef<DialogAddVersionQuestionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _FormBuild: FormBuilder,
    private loading: NgxSpinnerService,
    private dateAdapter: DateAdapter<Date>,
    private insertReq: InsertVersionRequest,
    private questionnaireService: QuestionnaireService,
    private _snackBar: MatSnackBar
  ) {
    dateAdapter.setLocale('th-TH');
  }

  ngOnInit() {

    this.addVersionQuestionForm = this._FormBuild.group({
      versionCode: ['', Validators.required],
      versionDesc: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: [{value: '', disabled: true}, Validators.required],
    });

  }

  onSubmit() {
    console.log(this.addVersionQuestionForm);
    this.submitted = true;
    if (this.addVersionQuestionForm.invalid) {
      return
    } else {
      this.addSwal.show();
    }
  }

  addVersion() {
    this.loading.show();
    this.insertReq.versionCode = this.addVersionQuestionForm.value.versionCode;
    this.insertReq.versionDesc = this.addVersionQuestionForm.value.versionDesc;
    this.insertReq.startDate = this.addVersionQuestionForm.value.startDate;
    this.insertReq.endDate = this.addVersionQuestionForm.value.endDate;
    this.questionnaireService.createVersion(this.insertReq).subscribe(
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

  get f() { return this.addVersionQuestionForm.controls; }

  closeDialog() {
    this.dialogRef.close(true);
  }

  chooseStartDate(event) {
    this.addVersionQuestionForm.controls['endDate'].enable();
    this.minEndDate = event.value;
  }

  openSnackBar() {
    this._snackBar.open("กรุณากดบันทึก", "Close", {
      duration: 2000,
    });
  }

}
