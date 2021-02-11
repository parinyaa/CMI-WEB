import { Component, OnInit, Input, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MatTableDataSource, MAT_DIALOG_DATA } from '@angular/material';
import { DocumentService } from 'src/app/core/service/document/document.service';
import { GetDocumentFileRequest } from 'src/app/shared/models/document/request/GetDocumentFileRequest';
import { NgxSpinnerService } from 'ngx-spinner';
import { DownloadFileRequest } from 'src/app/shared/models/document/request/DownloadFileRequest';
import { DomSanitizer } from '@angular/platform-browser';
import {saveAs} from 'file-saver';

const ELEMENT_DATA = [
  { file: 'Hydrogen', download :''},
  { file: 'Helium',download :'' },
  {file: 'Lithium', download :''},
  {file: 'Beryllium',download :'' },
  {file: 'Boron', download :''},
  {file: 'Carbon', download :''},
  {file: 'Nitrogen',download :''},
  {file: 'Oxygen', download :''},
  {file: 'Fluorine',download :''},
  {file: 'Neon',download :''},
];
@Component({
  selector: 'app-dialog-file',
  templateUrl: './dialog-file.component.html',
  styleUrls: ['./dialog-file.component.scss']
})
export class DialogFileComponent implements OnInit {
  @Input() dialogProcess: number ;
  displayedColumns: string[] = ['file', 'download'];
  displayedLinkColumns: string[] = ['link'];
  dataSourceFile = new MatTableDataSource();
  dataSourcelink = new MatTableDataSource();
  fileList = new Array<any>();
  linkList = new Array<any>();
  fileUrl;
  fileName;

  constructor(
    private dialogRef: MatDialogRef<DialogFileComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private documentService : DocumentService,
    private getDocumentFileRequest : GetDocumentFileRequest,
    private loading:NgxSpinnerService,
    private dowloadFileRequest : DownloadFileRequest,
    private sanitizer: DomSanitizer
    )
    { }

  ngOnInit() {
    console.log(this.data)
    let processSeq = "PROCESS_SEQ_"+this.pad2(this.data.type);
    this.getDocumentFileRequest.baseYear = this.data.baseYear;
    this.getDocumentFileRequest.processSeq = processSeq;
    this.getFile(this.getDocumentFileRequest);



  }
  onNoClick(){
      this.dialogRef.close();
  }

  pad2(number) {

    return (number < 10 ? '0' : '') + number

}

getFile(request : GetDocumentFileRequest){
  this.loading.show();
  this.documentService.getDocumentFile(request).subscribe(
    (res)=>{
      this.loading.hide()
      res.forEach(element => {
          if(element.file != null){
            let obj = {file : element.file , download :'' , documentId : element.documentId}
            this.fileList.push(obj)

          }
          if(element.link !=null){
            console.log(element)
            let obj2 = {link : element.link }
            this.linkList.push(obj2)
          }
      });
      this.dataSourceFile = new MatTableDataSource(this.fileList);
      this.dataSourcelink = new MatTableDataSource(this.linkList);
    },
    (error)=>{
      this.loading.hide()
    }
  )

}

onDowloadFile(element){
  console.log(element)
  this.loading.show()
  this.dowloadFileRequest.documentId = element.documentId;
  this.dowloadFileRequest.originalFileName = element.file;
  this.documentService.downloadtFile(this.dowloadFileRequest).subscribe(
    (res)=>{
      this.loading.hide();
      console.log("onDowloadFile => ", res)
      console.log(res.size)
      console.log(res.type)
      console.log(res.text())




      var mediaType = 'application/octet-stream';
      var blob = new Blob([res], {type: mediaType});
      saveAs(blob,element.file)

    },
    (error) =>{
      this.loading.hide();
    }
  )
}

createFileType(e): string {
  let fileType: string = "";
  if (e == 'pdf' || e == 'csv') {
    fileType = `application/${e}`;
  }
  else if (e == 'jpeg' || e == 'jpg' || e == 'png') {
    fileType = `image/${e}`;
  }
  else if (e == 'txt') {
    fileType = 'text/plain';
  }

  else if (e == 'ppt' || e == 'pot' || e == 'pps' || e == 'ppa') {
    fileType = 'application/vnd.ms-powerpoint';
  }
  else if (e == 'pptx') {
    fileType = 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
  }
  else if (e == 'doc' || e == 'dot') {
    fileType = 'application/msword';
  }
  else if (e == 'docx') {
    fileType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
  }
  else if (e == 'xls' || e == 'xlt' || e == 'xla') {
    fileType = 'application/vnd.ms-excel';
  }
  else if (e == 'xlsx') {
    fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
  }

  return fileType;
}

}
