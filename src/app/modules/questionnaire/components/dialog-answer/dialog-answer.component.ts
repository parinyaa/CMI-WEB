import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { NgxSpinnerService } from 'ngx-spinner';
import { QuestionnaireService } from 'src/app/core/service/questionnaire/questionnaire.service';
import { InsertAndUpdateAnswerRequest } from 'src/app/shared/models/questionnaire/request/InsertAndUpdateAnswerRequest';
import { InputUtils } from 'src/app/core/utils/inputUtils/InputUtils';

@Component({
  selector: 'app-dialog-answer',
  templateUrl: './dialog-answer.component.html',
  styleUrls: ['./dialog-answer.component.scss']
})
export class DialogAnswerComponent implements OnInit {

  @ViewChild('addSwal', { static: false }) addSwal: SwalComponent;
  @ViewChild('succussSwal', { static: false }) succussSwal: SwalComponent;
  @ViewChild('errorSwal', { static: false }) errorSwal: SwalComponent;
  @ViewChild('invalidSwal', { static: false }) invalidSwal: SwalComponent;

  addAnswerForm: FormGroup;
  listAnswerArr: FormArray;
  submitted = false;
  question: any;
  listAnswerFromDB = [];
  isLoading = true;
  isActive = false;

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<DialogAnswerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private loading: NgxSpinnerService,
    private questionnaireService: QuestionnaireService,
    private insertAndUpdateAnswerRequest: InsertAndUpdateAnswerRequest,
    public inputUtils: InputUtils
  ) {

  }

  ngOnInit() {
    this.question = this.data.question
    this.getAnswerByQuestionId(this.question.questionId);
    this.addAnswerForm = this.formBuilder.group({
      questionId: [this.question.questionId, Validators.required],
      listAnswer: this.formBuilder.array([], Validators.required)
    });

    if (this.question.versionId.status == 'ACTIVE') {
      this.isActive = true;
    }
  }

  initNewFrom() {
    this.listAnswerArr = this.addAnswerForm.get('listAnswer') as FormArray;
    this.listAnswerArr.push(this.createAnswer());
    this.isLoading = false;
  }

  initAnswerFrom(data) {
    this.listAnswerArr = this.addAnswerForm.get('listAnswer') as FormArray;
    data.forEach(element => {
      let tmp = element;
      let otherFlag: boolean;
      let description = '';
      if (tmp.otherFlag == 'Y') {
        otherFlag = true;
        description = 'อื่นๆ'
      }
      else {
        otherFlag = false;
        description = tmp.description;
      }
      this.listAnswerArr.push(this.formBuilder.group({
        answerId: tmp.answerId,
        answerNo: [tmp.answerNo, Validators.required],
        description: [{ value: description, disabled: otherFlag }, Validators.required],
        otherFlag: [otherFlag, Validators.required]
      }));
    });
    this.isLoading = false;
  }

  get formData() { return this.addAnswerForm.get('listAnswer') as FormArray }

  createAnswer(): FormGroup {
    return this.formBuilder.group({
      answerId: '',
      answerNo: ['', Validators.required],
      description: ['', Validators.required],
      otherFlag: [false, Validators.required]
    });
  }

  addAnswer(): void {
    this.listAnswerArr = this.addAnswerForm.get('listAnswer') as FormArray;

    let isOther = false;
    let length = this.listAnswerArr.length - 1;

    this.listAnswerArr.value.forEach((element, index) => {
      if (element.otherFlag) {
        isOther = true;
      }
    });

    if (isOther) {
      this.listAnswerArr.insert(length, this.createAnswer());
    }
    else {
      this.listAnswerArr.push(this.createAnswer());
    }

  }

  get f() { return this.addAnswerForm.controls; }

  onSubmit() {
    console.log(this.addAnswerForm);
    this.submitted = true;
    if (this.addAnswerForm.invalid) {
      return
    } else {
      let checkDuplicate = false;
      let arrTmp = this.addAnswerForm.getRawValue().listAnswer;
      arrTmp.forEach(element => {
        let countAnswer = 0;
        arrTmp.forEach(element2 => {
          if (element.answerNo == element2.answerNo) {
            countAnswer++;
          }
        });
        if (countAnswer > 1) {
          checkDuplicate = true;
        }
      });
      if (!checkDuplicate) {
        this.addSwal.show();
      }
      else {
        this.invalidSwal.title = "เลขที่คำตอบซ้ำกัน";
        this.invalidSwal.show();
      }
    }
  }

  saveAnswer() {
    this.loading.show();
    this.insertAndUpdateAnswerRequest.questionId = this.addAnswerForm.value.questionId;
    this.insertAndUpdateAnswerRequest.listAnswer = this.addAnswerForm.getRawValue().listAnswer;
    this.questionnaireService.createAndUpdateAnswer(this.insertAndUpdateAnswerRequest).subscribe(
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

  closeDialog() {
    this.dialogRef.close(true);
  }

  get listAnswerForms() {
    return this.addAnswerForm.get('listAnswer') as FormArray;
  }

  removeGroup(i: number) {
    const listAnswer = <FormArray>this.addAnswerForm.controls['listAnswer'];
    listAnswer.removeAt(i);
  }

  getAnswerByQuestionId(id) {
    this.questionnaireService.getAnswerByQuestionId(id).subscribe(res => {
      if (res.length) {
        this.initAnswerFrom(res);
      }
      else {
        this.initNewFrom();
      }
    },
      (error) => {
        console.log(error.error.messageEn);
      })
  }

  changeFlag(event, answer) {
    if (event.checked) {
      answer.get('description').setValue('อื่นๆ');
      answer.get('description').disable();
    }
    else {
      answer.get('description').setValue('');
      answer.get('description').enable();
    }
  }

}
