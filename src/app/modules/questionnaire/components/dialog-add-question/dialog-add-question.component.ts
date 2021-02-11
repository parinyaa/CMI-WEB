import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { InsertQuestionRequest } from 'src/app/shared/models/questionnaire/request/InsertQuestionRequest';
import { QuestionnaireService } from 'src/app/core/service/questionnaire/questionnaire.service';
import { InputUtils } from 'src/app/core/utils/inputUtils/InputUtils';


@Component({
  selector: 'app-dialog-add-question',
  templateUrl: './dialog-add-question.component.html',
  styleUrls: ['./dialog-add-question.component.scss']
})
export class DialogAddQuestionComponent implements OnInit {

  @ViewChild('addSwal', { static: false }) addSwal: SwalComponent;
  @ViewChild('succussSwal', { static: false }) succussSwal: SwalComponent;
  @ViewChild('errorSwal', { static: false }) errorSwal: SwalComponent;

  submitted = false;
  addQuestionForm: FormGroup;
  questionType = [];
  isShowError = false;

  constructor(
    public dialogRef: MatDialogRef<DialogAddQuestionComponent>,
    private _FormBuild: FormBuilder,
    private loading: NgxSpinnerService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private insertQuestionRequest: InsertQuestionRequest,
    private questionnaireService: QuestionnaireService,
    public inputUtils:InputUtils
  ) { }

  ngOnInit() {

    this.questionType = this.data.questionType.info;

    this.addQuestionForm = this._FormBuild.group({
      questionNo: [this.data.questionRunNumber, Validators.required],
      questionType: ['', Validators.required],
      questionDesc: ['', Validators.required],
      versionId: ['', Validators.required],
    });

    this.addQuestionForm.controls['versionId'].setValue(this.data.version);

  }

  addQuestion() {
    this.loading.show();
    this.insertQuestionRequest.questionDesc = this.addQuestionForm.value.questionDesc;
    this.insertQuestionRequest.questionNo = this.addQuestionForm.value.questionNo;
    this.insertQuestionRequest.questionType = this.addQuestionForm.value.questionType;
    this.insertQuestionRequest.versionId = this.addQuestionForm.value.versionId;
    this.questionnaireService.createQuestion(this.insertQuestionRequest).subscribe(
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

  onSubmit() {
    console.log(this.addQuestionForm);
    this.submitted = true;
    if (this.addQuestionForm.invalid) {
      return
    } else {
      this.addSwal.show();
    }
  }

  get f() { return this.addQuestionForm.controls; }

  closeDialog() {
    this.dialogRef.close(true);
  }

}
