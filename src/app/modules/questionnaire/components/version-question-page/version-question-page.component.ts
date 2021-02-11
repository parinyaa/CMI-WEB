import { Component, OnInit, ViewChild } from '@angular/core';
import { DialogAddVersionQuestionComponent } from '../dialog-add-version-question/dialog-add-version-question.component';
import { MatDialog, PageEvent } from '@angular/material';
import { QuestionnaireService } from 'src/app/core/service/questionnaire/questionnaire.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogEditVersionQuestionComponent } from '../dialog-edit-version-question/dialog-edit-version-question.component';
import { DialogAddQuestionComponent } from '../dialog-add-question/dialog-add-question.component';
import { Router } from '@angular/router';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-version-question-page',
  templateUrl: './version-question-page.component.html',
  styleUrls: ['./version-question-page.component.scss']
})
export class VersionQuestionPageComponent implements OnInit {

  noDataQuestionnaire = false;
  displayedColumns: string[] = ['position', 'verCode', 'verDesc', 'startDate', 'endDate', 'edit', 'setting', 'question', 'result', 'delete'];
  dataSource = [];

  length = 0;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100, 500, 1000];
  pageEvent: PageEvent = new PageEvent;


  page = 0;
  size = 10;
  index = 0;

  @ViewChild('deleteVersionSwal', { static: false }) deleteVersionSwal: SwalComponent;
  @ViewChild('succussDeleteSwal', { static: false }) succussDeleteSwal: SwalComponent;
  @ViewChild('errorSwal', { static: false }) errorSwal: SwalComponent;

  constructor(
    private dialog: MatDialog,
    private questionnaireService: QuestionnaireService,
    private loading: NgxSpinnerService,
    private router: Router
  ) { }

  ngOnInit() {
    this.getAllVersion(this.page, this.size);
  }

  openAddVersionDialog(): void {
    const dialogRef = this.dialog.open(DialogAddVersionQuestionComponent, {
      width: '700px',
      position: {
        top: '3%'
      },
      data: ""
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getAllVersion(this.page, this.size);
      }
    });
  }

  pageChange(e: PageEvent): PageEvent {
    console.log(e);
    this.index = e.pageIndex * e.pageSize;
    this.page = e.pageIndex;
    this.size = e.pageSize;
    this.getAllVersion(this.page, this.size);
    return e;
  }

  getAllVersion(page: number, size: number) {
    this.loading.show();
    this.questionnaireService.getAllVersion(this.page, this.size).subscribe(
      (res) => {
        this.loading.hide();
        if (res.empty) {
          this.noDataQuestionnaire = true;
        }
        else {
          this.noDataQuestionnaire = false;
          this.dataSource = res.content;
          this.dataSource.forEach(element => {
            let startDateTmp = new Date(element.startDate);
            let endDateTmp = new Date(element.endDate);
            if (startDateTmp > new Date()) {
              element.isEnable = true;
            }
            else {
              element.isEnable = false;
            }
            if (endDateTmp >= new Date()) {
              element.isEndQuestion = false;
            }
            else {
              element.isEndQuestion = true;
            }
          });
          console.log(this.dataSource);
          this.length = res.totalElements;
        }
      },
      (error) => {
        this.noDataQuestionnaire = true;
        console.log(error.error.messageEn);
        this.loading.hide();
      }
    );
  }

  openEditVersionDialog(data) {
    const dialogRef = this.dialog.open(DialogEditVersionQuestionComponent, {
      width: '700px',
      position: {
        top: '3%'
      },
      data: data
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getAllVersion(this.page, this.size);
      }
    });
  }

  gotoQuestionPage(element) {
    this.router.navigateByUrl('/questionnaire/question', { state: { 'element': element } });
  }

  gotoSendDataQuestionPage(id) {
    let idBase64 = btoa(id);
    this.router.navigateByUrl('/poll?id=' + idBase64);
  }

  deleteVersion(element) {
    this.deleteVersionSwal.title = 'ยืนยันที่จะลบ ?';
    this.deleteVersionSwal.text = 'แบบสอบถาม ' + element.description;
    this.deleteVersionSwal.show().then((result) => {
      if (result.value) {
        this.loading.show();
        this.questionnaireService.deleteVersion(element.versionId).subscribe(
          (res) => {
            this.loading.hide();
            this.getAllVersion(this.page, this.size);
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

  gotoDataResult(versionId) {
    this.router.navigateByUrl('/questionnaire/result', { state: { 'versionId': versionId } });
  }

}
