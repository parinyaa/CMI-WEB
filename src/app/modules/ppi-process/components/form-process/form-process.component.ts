import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { DocumentService } from 'src/app/core/service/document/document.service';
import { BaseyearService } from 'src/app/core/service/baseyear/baseyear.service';
import { FormControl, FormControlName, FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { GetDocumentRequest } from 'src/app/shared/models/document/request/GetDocumentRequest';
import { ParamService } from 'src/app/core/service/param/param.service';
import { type } from 'os';
import { AddDocumentRequest } from 'src/app/shared/models/document/request/AddDocumentRequest';
import { DocumentFileRequest } from 'src/app/shared/models/document/request/DocumentFileRequest';
import { decode, encode } from 'universal-base64';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import { Observable, throwError } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { GetDocumentFileRequest } from 'src/app/shared/models/document/request/GetDocumentFileRequest';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { DeleteDucumentRequest } from 'src/app/shared/models/document/request/DeleteDucumentRequest';
import { DownloadFileRequest } from 'src/app/shared/models/document/request/DownloadFileRequest';

@Component({
  selector: 'app-form-process',
  templateUrl: './form-process.component.html',
  styleUrls: ['./form-process.component.scss']
})
export class FormProcessComponent implements OnInit {
  @ViewChild('saveSwal', { static: false }) saveSwal: SwalComponent;
  @ViewChild('successSwal', { static: false }) successSwal: SwalComponent;
  @ViewChild('errorSwal', { static: false }) errorSwal: SwalComponent;
  @ViewChild('fileInput',{ static: true }) fileInput: any;
  @Input() typePageId: number ;
  @Input() currentBaseYear: any ;
  @Input() filterBaseYearControl: FormControl;
  @Input() set baseYearMs(baseYearMs: any) {
    console.log('baseYearMs ===== ',baseYearMs);
    
    if (baseYearMs !== undefined && this.typePageId === 1) {
      this.getDocumentFileRequest.baseYear = baseYearMs;
      this.getMaxBaseYear(baseYearMs);
      if(this.currentBaseYear[0] !== undefined) {
      if (this.currentBaseYear[0].modeFlag === 'EDIT') {
        this.editMode = true;
      }
    }
    
}
 else {
  if(this.typePageId === 1) {
      this.getMaxBaseYear(this.filterBaseYearControl.value);
      
  if(this.currentBaseYear[0].modeFlag === 'EDIT') {
    this.editMode = true;
  }
  }


}
}

  @ViewChild('FilePaginator', {static: true}) filePaginator: MatPaginator;
  @ViewChild('LinkPaginator', {static: true}) linkPaginator: MatPaginator;
  @ViewChild('deleteSwalSuccess', { static: false }) deleteSwalSuccess: SwalComponent;

  @Output() btnResetStep: EventEmitter<boolean> = new EventEmitter<boolean>();
  typePage = [
  ];
  typePageName: string;
  baseYear: any;
  processSeqType: any;
  processGroup: FormGroup;
  addProcessType: string ;
  currenSelectYear: string;
  fileList = new Array<any>();
  linkList = new Array<any>();
  blankList = new Array<any>();

  file = [];
  baseYearInput: FormControl;
  descriptionInput: FormControl;
  baseYearAll = new Array();
  checkMode = new Array();
  filterBaseYearOptions: Observable<any[]>;
  displayedColumns: string[] = ['position','file', 'download','action'];
  displayedLinkColumns: string[] = ['position','link','action'];
  dataSourceFile = new MatTableDataSource();
  dataSourcelink = new MatTableDataSource();
  yearTest: any;
  switchTab = 0;
  conditionTab0 = true;
  conditionTab1 = true;
  editMode: boolean;
  wheelHandler: EventListenerOrEventListenerObject;
  disableFile: boolean = true;
  disableSave: boolean;
  item: number = 1;
  constructor(

    private documentService : DocumentService,
    private baseYearService :BaseyearService,
    private getDocumentRequest :GetDocumentRequest,
    private addDocumentRequest : AddDocumentRequest,
    private paramService : ParamService,
    private getDocumentFileRequest : GetDocumentFileRequest,
    private fb:FormBuilder,
    private loading:NgxSpinnerService,
    private deleteDocumentFile : DeleteDucumentRequest,
    private dowloadFileRequest : DownloadFileRequest,
    private ducumentFile:DocumentFileRequest

  ) { 

  }

  ngOnInit() {
    this.processGroup = this.fb.group({
      baseYearInput: [''],
      descriptionInput: [''],
      url: this.fb.array([]),

    });
    const url = this.processGroup.controls.url as FormArray;
    url.push(this.fb.group({
      urlData: ['']
    }));
    
    if(this.typePageId !== 1) {
      this.getMaxBaseYear(this.filterBaseYearControl.value);
    }

   

  }



  get urlForms() {
    return this.processGroup.get('url') as FormArray;
  }
  addUrl() {
    const url = this.processGroup.controls.url as FormArray;
    url.push(this.fb.group({
      urlData: ['']
    }));
  }

  removeUrl(i: number) {
    const control = this.processGroup.controls.url as FormArray;
    control.removeAt(i);
  }

  onSaveProcess() {
    this.addDocumentRequest.originalUrl = [];
    if(this.typePageId > 1){
      this.addDocumentRequest.baseYear = this.filterBaseYearControl.value;
    }
    else{
      this.addDocumentRequest.baseYear = this.filterBaseYearControl.value;
    }
   
    this.addDocumentRequest.description = this.processGroup.controls['descriptionInput'].value;
    this.addDocumentRequest.processSeq = this.addProcessType;
    this.processGroup.controls['url'].value.forEach(element => {
      console.log(element)
      this.addDocumentRequest.originalUrl.push(element.urlData)

      });

  }

  resetStep() {
    this.btnResetStep.emit(true);
    console.log(this.btnResetStep.emit);
    this.disableSave = false;

    this.addDocumentRequest = new AddDocumentRequest();
    this.file = [];
    const control = <FormArray>this.processGroup.controls['url'];
            control.clear();
            const url = this.processGroup.controls['url'] as FormArray;
            url.push(this.fb.group({
              urlData: ['']
            }));
  }

  removeSelectedFile(index) {

    if(index === 0 && this.processGroup.controls['url'].value[0].urlData === '') {
      this.disableSave = false;
    }


    this.addDocumentRequest.files[index] = new DocumentFileRequest();
    this.file[index] = new Array<any>();
    console.log('addDoc & file => ', this.addDocumentRequest.files[index]+' '+this.file);

    
    this.file.splice(index, 1);
    this.addDocumentRequest.files.splice(index , 1)
   }

  onSelectFile(event) {

    console.log(' === ',this.filterBaseYearControl.value);
    
    if(event && this.processGroup.controls['descriptionInput'].value && this.filterBaseYearControl.value || this.processGroup.controls['url'].value[0].urlData) {
      this.disableSave = true;

    } 
    
    this.disableFile = true;
    if(this.addDocumentRequest.files.length === 0) {
      this.addDocumentRequest = new AddDocumentRequest();
      this.file = [];
      console.log('this.file => ', this.file);
    }
    let selectedFile = event.target.files[0];
     const formData = new FormData();
    formData.append("file", selectedFile);
    console.log(formData);
    console.log('sssss ',selectedFile);
    let documentFileRequest = new DocumentFileRequest();
  
    if (event.target.files && event.target.files[0]) {
      let fileReader = new FileReader() ;
      fileReader.readAsArrayBuffer(event.target.files[0]);
      fileReader.onload = function () {
        
        // event.target.files[0].getAsBinary();
        console.log("getAsBinary =>" , fileReader)
        var blob = new Blob([fileReader.result])
        var reader = new FileReader();
        reader.readAsDataURL(blob)
        reader.onload = function(){
          console.log("reader = >" ,reader)
        let base64File = reader.result.toString().split(",")
        documentFileRequest.file =base64File[1];  
        };
      };
      fileReader.onerror = function (error) {
        console.log('Error: ', error);
      };
      var filesAmount = event.target.files.length;
        this.file.push(event.target.files[0]);

        documentFileRequest.originalFile = event.target.files[0].name;
       
        this.addDocumentRequest.files.push(documentFileRequest);
        console.log('reqAddDocumentFileRequest==== ',this.addDocumentRequest);
        
      }

      this.fileInput.nativeElement.value = '';

    }

    getMaxBaseYear(baseYearMs: number){
      console.log('inputBaseYear === ',this.filterBaseYearControl);
      this.baseYearService.getMaxBaseYear().subscribe(
        (res) => {
            if (res.baseYear > 0) {
               this.baseYear = res.baseYear;
          
                console.log(this.baseYear)
                if(this.typePageId !== 1) {
                   this.getSeqType(this.typePageId,this.filterBaseYearControl.value);
                } else {
                  this.getSeqType(this.typePageId,baseYearMs);
                  
                } 
             
            }
            else{
              this.baseYear = '';

            }

        },
        (error) => {
          console.log(error);
        });
    }

    getFile(request : GetDocumentFileRequest){
      console.log('requestGetFile==> ',request);
      
      this.loading.show();
      this.documentService.getDocumentFile(request).subscribe(
        (res)=>{
          console.log('resDocumentService== >',res)
          this.loading.hide()
          if(res !== null) {
              this.fileList = new Array<any>();
              this.linkList = new Array<any>();
          res.forEach(element => {
              if(element.file != null){
                let obj = {file : element.file , download :'' , documentId : element.documentId}
                this.fileList.push(obj)
    
              }
              if(element.link !=null){
                console.log(element)
                let obj2 = {link : element.link , download :'' , documentId : element.documentId}
                this.linkList.push(obj2)
              }
          });
          this.dataSourceFile = new MatTableDataSource(this.fileList);
          this.dataSourcelink = new MatTableDataSource(this.linkList);
          this.dataSourceFile.paginator = this.filePaginator;
          this.dataSourcelink.paginator = this.linkPaginator;
          this.conditionTab0 = false;
          console.log(this.linkList);

          if(this.linkList.length === 0) {
            this.conditionTab0 = true;
            this.conditionTab1 = false;
          }
          if(this.fileList.length === 0) {
            this.conditionTab0 = false;
            this.conditionTab1 = true;
          }

          if(this.switchTab === 1) {
            this.conditionTab0 = true;
            this.conditionTab1 = false; 
          } else {
            this.conditionTab0 = false; 
            this.conditionTab1 = true;
          }

          
        } else{
          this.dataSourceFile = new MatTableDataSource(this.blankList);
          this.dataSourcelink = new MatTableDataSource(this.blankList);
          this.conditionTab0 = true
          this.conditionTab1 = true
          
        }
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

    getDocument(baseYear: number , seqType: string) {
      console.log('baseYear ======>>>> ',baseYear);
      
      this.loading.show();
      this.getDocumentRequest.baseYear = baseYear;
      this.getDocumentRequest.processSeqType = seqType;
      this.documentService.getDocument(this.getDocumentRequest).subscribe(
        (res) => {
          console.log('resGetDocument === >',res);
          this.loading.hide();
          if (res.baseYear > 0) {
          this.processGroup.controls.baseYearInput.setValue(res.baseYear);
          this.processGroup.controls.descriptionInput.setValue( res.description);
          } else {
            this.processGroup.controls.baseYearInput.setValue('');
            this.processGroup.controls.descriptionInput.setValue( res.description);
          }

        },
        (error) => {
          this.loading.hide();
        }

      );
    }

    getSeqType(type :number, baseYearMs: number){
      this.paramService.getParamInfoByGroup("PROCESS_SEQ_TYPE").subscribe(
        (res) => {
         
         
          this.processSeqType = res.info;
          console.log('resss === >',res.info);
          
 
          this.processSeqType.forEach(info => {
            
            let typeNum = info.paramInfo.replace("PROCESS_SEQ_" , "");
            let number = +typeNum
            if(number == type){
              this.typePageName = info.paramLocalMessage;
              this.addProcessType = info.paramInfo;
            if(baseYearMs && this.filterBaseYearControl.value){
              this.getDocument(baseYearMs,info.paramInfo);
              console.log('input====>',this.currentBaseYear);
            }
           
            
            }
          });


          if(this.typePageId !== 1 && this.filterBaseYearControl.value) { 
            this.getDocumentFileRequest.baseYear = this.filterBaseYearControl.value;
            this.getDocumentFileRequest.processSeq = this.addProcessType;
            this.getFile(this.getDocumentFileRequest);
          } else  if(this.filterBaseYearControl.value){
            this.getDocumentFileRequest.processSeq = this.addProcessType;
            this.getDocumentFileRequest.baseYear = baseYearMs;
            this.getFile(this.getDocumentFileRequest);
          }
          
          if(this.currentBaseYear[0].modeFlag === 'EDIT') {
            this.editMode = true;
          }
  
  
        },
        (error) => {
          console.log(error);
        }
        
      )
    }

    addDocument() {
      this.loading.show();
      this.documentService.addDocument(this.addDocumentRequest).subscribe(
        (res) => {
          this.loading.hide();
          this.successSwal.show();

            console.log(res);
            this.getFile(this.getDocumentFileRequest);
            this.addDocumentRequest = new AddDocumentRequest();
            this.ducumentFile = new DocumentFileRequest();
            this.disableFile = false;
            this.file = [];
            this.addDocumentRequest.files = [];


            const control = <FormArray>this.processGroup.controls['url'];
            control.clear();
            const url = this.processGroup.controls['url'] as FormArray;
            url.push(this.fb.group({
              urlData: ['']
            }));

            this.disableSave = false;
            
            

        },
        (error) => {
          this.loading.hide();
          if (error.error.code === 'E2401' || error.error.code === 'DOC400') {
           this.errorSwal.text = error.error.messageTh;
           this.errorSwal.show();
        }
        }

      )
    }
    errorDialog() {

        location.reload();
    }

    selectedTabChange(even) {
      this.switchTab = even.index;
      console.log('switchTab ===', this.switchTab);
      if (this.switchTab === 1) {
        this.conditionTab0 = true;
        this.conditionTab1 = false;
      } else {
        this.conditionTab0 = false;
        this.conditionTab1 = true;
      }

    }

    deleteDucument(ducument) {

      console.log('ducument===== ', ducument);
      this.deleteDocumentFile.documentId = ducument.documentId;

      this.loading.show();
      this.documentService.deleteDocumentFile(this.deleteDocumentFile).subscribe(
        (res) => {
          this.loading.hide();
          this.deleteSwalSuccess.show();
          this.getFile(this.getDocumentFileRequest);
        },
        (error) => {
          console.log(error);
          this.loading.hide();
        }
      );

    }

    modelChanged(even,i) {
      
      console.log('evennn === ',even);
      
      if(even && this.processGroup.controls['descriptionInput'].value  && this.filterBaseYearControl.value && this.processGroup.controls['url'].value[0].urlData) {
        this.disableSave = true;

      } 
      else {
        if(this.filterBaseYearControl.value === '' || this.processGroup.controls['descriptionInput'].value === '' || this.processGroup.controls['url'].value[0].urlData === '') {
          
          if(this.addDocumentRequest.files.length > 0 && this.processGroup.controls['descriptionInput'].value && this.filterBaseYearControl.value ) {
              this.disableSave = true;
          } else {

            this.disableSave = false;
          }
        
        }
      }

    }
  }
