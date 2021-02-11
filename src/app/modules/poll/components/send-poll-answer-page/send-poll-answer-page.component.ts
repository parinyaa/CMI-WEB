import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { QuestionnaireService } from 'src/app/core/service/questionnaire/questionnaire.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormBuilder, FormArray, FormGroup, Validators } from '@angular/forms';
import { InsertPollDataRequest } from 'src/app/shared/models/poll/InsertPollDataRequest.model';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
declare var $: any;

@Component({
  selector: 'app-send-poll-answer-page',
  templateUrl: './send-poll-answer-page.component.html',
  styleUrls: ['./send-poll-answer-page.component.scss']
})
export class SendPollAnswerPageComponent implements OnInit {

  @ViewChild('invalidSwal', { static: false }) invalidSwal: SwalComponent;
  @ViewChild('addSwal', { static: false }) addSwal: SwalComponent;
  @ViewChild('succussSwal', { static: false }) succussSwal: SwalComponent;
  @ViewChild('errorSwal', { static: false }) errorSwal: SwalComponent;

  versionId;
  versionDesc = '';
  versionCode = '';
  dataQuestion = [];
  addPollDataForm: FormGroup;
  dataArray: FormArray;
  requireQuestion = [];
  ip: string;

  constructor(
    private route: ActivatedRoute,
    private questionnaireService: QuestionnaireService,
    private loading: NgxSpinnerService,
    private _formBuilder: FormBuilder,
    private insertPollDataRequest: InsertPollDataRequest,
  ) { }

  ngOnInit() {
    this.loading.show();
    this.versionId = atob(this.route.snapshot.queryParamMap.get('id'));
    this.getPollInitData(this.versionId);
    this.addPollDataForm = this._formBuilder.group({
      listData: this._formBuilder.array([], Validators.required)
    });
    this.getIpAddress();
  }

  getPollInitData(id) {
    this.questionnaireService.getQuestionWithAnswerByVersionId(id).subscribe(res => {
      console.log(res);
      if (res.length) {
        this.dataQuestion = res;
        this.versionDesc = res[0].versionId.description;
        this.versionCode = res[0].versionId.versionCode;
        res.forEach((element, index) => {
          if (element.questionType.paramCode == 'ONE_CHOICE') {
            let val = { index: index, questionId: element.questionId };
            this.requireQuestion.push(val);
          }
          else if (element.questionType.paramCode == 'TEXT_INPUT') {
            let val = {
              index: index,
              questionId: element.questionId,
              answerId: element.listAnswer[0].answerId,
            };
            this.requireQuestion.push(val);
          }
        });
      }
      this.loading.hide();
    });
  }

  createData(): FormGroup {
    return this._formBuilder.group({
      answerId: ['', Validators.required],
      remark: [''],
      questionId: ['']
    });
  }

  onCheckChange(event, answer) {
    if (event.source != undefined) {
      this.dataArray = this.addPollDataForm.get('listData') as FormArray;
      if (event.checked) {
        this.dataArray.push(this._formBuilder.group({
          answerId: [answer.answerId, Validators.required],
          remark: [''],
          otherFlag: [answer.otherFlag],
        }));
      }
      else if (!event.checked) {
        this.dataArray.controls.forEach((item, index) => {
          if (item.value.answerId == answer.answerId) {
            this.dataArray.removeAt(index);
          }
        });
      }
    }
  }

  onRadioChange(event, question, answer) {
    if (event.source != undefined) {
      this.dataArray = this.addPollDataForm.get('listData') as FormArray;
      this.dataArray.controls.forEach((item, index) => {
        if (item.value.questionId == question.questionId) {
          this.dataArray.removeAt(index);
        }
      });
      this.dataArray.push(this._formBuilder.group({
        answerId: [answer.answerId, Validators.required],
        remark: [''],
        questionId: [question.questionId],
        otherFlag: [answer.otherFlag],
      }));
    }
  }

  onSubmit() {
    console.log(this.ip);
    this.dataArray = this.addPollDataForm.get('listData') as FormArray;
    console.log('form', this.dataArray);
    if (this.dataArray.length) {
      let invalidOther;
      this.dataArray.controls.forEach(element => {
        let index = this.requireQuestion.findIndex(f => f.questionId == element.value.questionId);
        if (index >= 0) {
          this.requireQuestion.splice(index, 1);
        }
      });
      if (this.requireQuestion.length) {
        console.log(this.requireQuestion);
        let text = '';
        this.requireQuestion.forEach(element => {
          text += element.index + 1;
          text += ',';
        });
        this.invalidSwal.title = 'กรอกข้อมูลในข้อ ' + text.slice(0, text.length - 1);;
        this.invalidSwal.show();
      }
      else {
        this.dataArray.controls.forEach((item, index) => {
          let tmpInvalid = false;
          if (item.value.otherFlag == 'Y') {
            $('#input' + item.value.answerId).val().length < 1 ? tmpInvalid = true : tmpInvalid = false;
            item.value.remark = $('#input' + item.value.answerId).val();
          }
          else {
            item.value.remark = ' ';
          }
          if (tmpInvalid) {
            invalidOther = true;
          }
        });
        if (invalidOther) {
          this.invalidSwal.title = 'กรอกข้อมูลให้ครบถ้วน';
          this.invalidSwal.show();
        }
        else {
          this.addSwal.show();
        }
      }
    }
    else {
      this.invalidSwal.title = 'กรุณาตอบคำถาม';
      this.invalidSwal.show();
    }

  }

  savePollData() {
    this.loading.show();
    this.insertPollDataRequest.listData = this.addPollDataForm.value.listData;
    this.insertPollDataRequest.ip = sessionStorage.getItem('ip');
    this.questionnaireService.createPollData(this.insertPollDataRequest).subscribe(
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

  createTextAreaDataRequire(answerId, questionId) {
    this.dataArray = this.addPollDataForm.get('listData') as FormArray;
    let haveAnswer = false;
    let indexArr;
    this.dataArray.controls.forEach((item, index) => {
      if (item.value.answerId == answerId) {
        haveAnswer = true;
        indexArr = index;
      }
    });
    if ($('#input' + answerId).val().length < 1) {
      if (haveAnswer) {
        this.dataArray.removeAt(indexArr);
      }
    }
    else {
      if (!haveAnswer) {
        this.dataArray.push(this._formBuilder.group({
          answerId: [answerId, Validators.required],
          remark: [''],
          otherFlag: ['Y'],
          questionId: [questionId]
        }));
      }
    }
  }

  createTextAreaData(answerId) {
    this.dataArray = this.addPollDataForm.get('listData') as FormArray;
    let haveAnswer = false;
    let indexArr;
    this.dataArray.controls.forEach((item, index) => {
      if (item.value.answerId == answerId) {
        haveAnswer = true;
        indexArr = index;
      }
    });
    if ($('#input' + answerId).val().length < 1) {
      if (haveAnswer) {
        this.dataArray.removeAt(indexArr);
      }
    }
    else {
      if (!haveAnswer) {
        this.dataArray.push(this._formBuilder.group({
          answerId: [answerId, Validators.required],
          remark: [''],
          otherFlag: ['Y'],
        }));
      }
    }
  }

  getIpAddress() {
    return $.getJSON('https://api.ipify.org?format=jsonp&callback=?', function (data) {
      sessionStorage.setItem('ip', data.ip);
    });
  }

}
