import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { NgxSpinnerService } from 'ngx-spinner';
import { QuestionnaireService } from 'src/app/core/service/questionnaire/questionnaire.service';
import { UpdateQuestionRequest } from 'src/app/shared/models/questionnaire/request/UpdateQuestionRequest';
import { InputUtils } from 'src/app/core/utils/inputUtils/InputUtils';

@Component({
  selector: 'app-dialog-edit-question',
  templateUrl: './dialog-edit-question.component.html',
  styleUrls: ['./dialog-edit-question.component.scss']
})
export class DialogEditQuestionComponent implements OnInit {

  @ViewChild('addSwal', { static: false }) addSwal: SwalComponent;
  @ViewChild('succussSwal', { static: false }) succussSwal: SwalComponent;
  @ViewChild('errorSwal', { static: false }) errorSwal: SwalComponent;

  submitted = false;
  editQuestionForm: FormGroup;
  questionType = [];
  isStatusActive = false;

  constructor(
    public dialogRef: MatDialogRef<DialogEditQuestionComponent>,
    private _FormBuild: FormBuilder,
    private loading: NgxSpinnerService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private questionnaireService: QuestionnaireService,
    private updateQuestionRequest:UpdateQuestionRequest,
    public inputUtils:InputUtils
  ) { }

  ngOnInit() {

    this.questionType = this.data.questionType.info;

    this.editQuestionForm = this._FormBuild.group({
      questionNo: ['', Validators.required],
      questionType: ['', Validators.required],
      questionDesc: ['', Validators.required],
      questionId: ['', Validators.required],
    });

    this.editQuestionForm.controls['questionId'].setValue(this.data.question.questionId);
    this.editQuestionForm.controls['questionNo'].setValue(this.data.question.questionNo);
    this.editQuestionForm.controls['questionDesc'].setValue(this.data.question.description);
    this.editQuestionForm.controls['questionType'].setValue(this.data.question.questionType.paramInfoId);

  }

  get f() { return this.editQuestionForm.controls; }

  closeDialog() {
    this.dialogRef.close(true);
  }

  editQuestion() {
    this.loading.show();
    this.updateQuestionRequest.questionDesc = this.editQuestionForm.value.questionDesc;
    this.updateQuestionRequest.questionId = this.editQuestionForm.value.questionId;
    this.updateQuestionRequest.questionNo = this.editQuestionForm.value.questionNo;
    this.updateQuestionRequest.questionType = this.editQuestionForm.value.questionType;
    this.questionnaireService.updateQuestion(this.updateQuestionRequest).subscribe(
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
    this.submitted = true;
    if (this.editQuestionForm.invalid) {
      return
    } else {
      this.addSwal.show();
    }
  }

}
