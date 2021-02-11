import { Component, OnInit, ViewChild } from '@angular/core';
import { ParamService } from 'src/app/core/service/param/param.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatDialog, PageEvent } from '@angular/material';
import { DialogAddQuestionComponent } from '../dialog-add-question/dialog-add-question.component';
import { QuestionnaireService } from 'src/app/core/service/questionnaire/questionnaire.service';
import { DialogEditQuestionComponent } from '../dialog-edit-question/dialog-edit-question.component';
import { DialogAnswerComponent } from '../dialog-answer/dialog-answer.component';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { isNull } from 'util';
import { Router } from '@angular/router';

@Component({
  selector: 'app-qustion-page',
  templateUrl: './qustion-page.component.html',
  styleUrls: ['./qustion-page.component.scss']
})
export class QustionPageComponent implements OnInit {

  questionType: any;
  noDataQuestionnaire = false;
  version: any;

  displayedColumns: string[] = ['questionNo', 'description', 'questionType', 'edit', 'answer', 'delete'];
  dataSource = [];

  length = 0;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100, 500, 1000];
  pageEvent: PageEvent = new PageEvent;

  page = 0;
  size = 10;
  index = 0;

  isStatusActive = false;

  @ViewChild('deleteQuestionSwal', { static: false }) deleteQuestionSwal: SwalComponent;
  @ViewChild('succussDeleteSwal', { static: false }) succussDeleteSwal: SwalComponent;
  @ViewChild('errorSwal', { static: false }) errorSwal: SwalComponent;

  constructor(
    private paramService: ParamService,
    private loading: NgxSpinnerService,
    private dialog: MatDialog,
    private questionnaireService: QuestionnaireService,
    private router: Router
  ) {
    this.getParamQuestionType();
  }

  ngOnInit() {
    if (isNull(history.state.element) || history.state.element == undefined) {
      this.router.navigateByUrl('/questionnaire');
    }
    else {
      this.version = history.state.element;
      new Date(this.version.startDate) <= new Date() ? this.isStatusActive = true : this.isStatusActive = false;
      this.getQuestionByVersionId(this.page, this.size);
    }
  }

  getParamQuestionType() {
    this.paramService.getParamInfoByGroup('QUESTION_TYPE').subscribe(res => {
      this.questionType = res;
    });
  }

  openAddQuestionDialog(): void {

    let questionRunNumber: number = 0;
    this.dataSource.forEach((element, index) => {
      if (index == this.dataSource.length - 1) {
        questionRunNumber = element.questionNo;
      }
    });

    let data = {
      version: this.version.versionId,
      questionType: this.questionType,
      questionRunNumber: questionRunNumber + 1
    }

    const dialogRef = this.dialog.open(DialogAddQuestionComponent, {
      width: '900px',
      position: {
        top: '10%'
      },
      data: data
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getQuestionByVersionId(this.page, this.size);
      }
    });
  }

  getQuestionByVersionId(page: number, size: number) {
    this.loading.show();
    this.questionnaireService.getQuestionByVersionId(this.version.versionId, page, size).subscribe(res => {
      this.loading.hide();
      if (res.empty) {
        this.noDataQuestionnaire = true;
      }
      else {
        this.noDataQuestionnaire = false;
        this.dataSource = res.content;
        this.length = res.totalElements;
      }
    },
      (error) => {
        this.noDataQuestionnaire = true;
        console.log(error.error.messageEn);
        this.loading.hide();
      });
  }

  openEditQuestionDialog(element) {

    let data = {
      question: element,
      questionType: this.questionType
    }

    const dialogRef = this.dialog.open(DialogEditQuestionComponent, {
      width: '900px',
      position: {
        top: '10%'
      },
      data: data
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getQuestionByVersionId(this.page, this.size);
      }
    });
  }

  openAnswerDialog(element) {

    let data = {
      question: element,
      questionType: this.questionType
    }

    const dialogRef = this.dialog.open(DialogAnswerComponent, {
      width: '65%',
      position: {
        top: '10%'
      },
      disableClose: false,
      hasBackdrop: true,
      data: data
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getQuestionByVersionId(this.page, this.size);
      }
    });
  }

  pageChange(e: PageEvent): PageEvent {
    console.log(e);
    this.index = e.pageIndex * e.pageSize;
    this.page = e.pageIndex;
    this.size = e.pageSize;
    this.getQuestionByVersionId(this.page, this.size);
    return e;
  }

  deleteQuestion(element) {
    this.deleteQuestionSwal.title = 'ยืนยันที่จะลบ ?';
    this.deleteQuestionSwal.text = 'คำถาม ' + element.description;
    this.deleteQuestionSwal.show().then((result) => {
      if (result.value) {
        this.loading.show();
        this.questionnaireService.deleteQuestion(element.questionId).subscribe(
          (res) => {
            this.loading.hide();
            this.getQuestionByVersionId(this.page, this.size);
            this.succussDeleteSwal.show();
          },
          (error) => {
            console.log(error);
            this.loading.hide();
            this.errorSwal.title = error.error.messageEn;
            this.errorSwal.show();
          }
        );
      }
    });
  }
}
