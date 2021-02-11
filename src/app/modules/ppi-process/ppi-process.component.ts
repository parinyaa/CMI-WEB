import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatStepper } from '@angular/material/stepper';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSort } from '@angular/material';
import { BaseyearService } from 'src/app/core/service/baseyear/baseyear.service';
import { DocumentService } from 'src/app/core/service/document/document.service';
import { GetDocumentRequest } from 'src/app/shared/models/document/request/GetDocumentRequest';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig} from '@angular/material/dialog';
import { DialogFileComponent } from './components/dialog-file/dialog-file.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';
import { ParamService } from 'src/app/core/service/param/param.service';

@Component({
  selector: 'app-ppi-process',
  templateUrl: './ppi-process.component.html',
  styleUrls: ['./ppi-process.component.scss']
})
export class PpiProcessComponent implements OnInit {
  @ViewChild('stepper', { static: false }) stepper: MatStepper;
  @ViewChild(MatSort, { static: true }) sort:MatSort;
  displayedColumns:string[] = ['year','content','description','file']
  typePageId:number
  processType:string ;
  typePageName:string;
  dataSource = new MatTableDataSource();
  flagYear:boolean = false;
  yearForm:FormGroup;
  step :number = 1 ;
  filterBaseYearOptions: Observable<any[]>;
  filterBaseYearControl = new FormControl();
  baseYearAll = new Array();
  checkMode = new Array();
  baseYearMs: any;
  paramsProcess: any;
  addProcessType: string ;
  processSeqType: any;



  history = new Array<any>();
  yearList  = new Array<String>();
  yearSelect:string;
  showTable = false;
  currentBaseYear: any;
  test: number;
  editMode: boolean;
  showFrom: boolean;
  constructor(
    private  route:ActivatedRoute,
    private baseYearService :BaseyearService,
    private documentService : DocumentService,
    private getDocumentRequest :GetDocumentRequest,
    private router:Router,
    private _formBuilder:FormBuilder,
    private dialog: MatDialog,
    private loading:NgxSpinnerService,
    private paramService: ParamService,
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = function(){
      return false;
    }
   }

  ngOnInit() {
    this.getSeqType();
    this.getAllCheckModeBaseYear()
    this.getAllBaseYear();
    
    this.getParamsActiveRoute();
    this.yearForm = this._formBuilder.group({
      year:['',Validators.required]
    })


    // this.getParamsProcess('PROCESS_SEQ_01');
 

  }

  getParamsActiveRoute() {
    this.route.params.subscribe(params => {
      this.typePageId = params['type'];
    })
  }

  setTypePageName(e){
    this.typePageName = e;
  }

  resetStep(e){
    console.log(e);
    if(e){
      this.stepper.reset();
    }
  }

  onchange(){
    console.log("Frsfsefs");
  }

  onChangeBaseYear(even) {


    this.baseYearMs = this.filterBaseYearControl.value;
    console.log('baseYearMs === ',this.baseYearMs);

    this.currentBaseYear = this._filterBaseYearList(this.filterBaseYearControl.value);
    console.log('currentBaseYear === ',this.currentBaseYear);
    this.showFrom = true;
  }

  selectionChange(event){
    console.log("selectionChangeeeee ",event);
    this.yearSelect = this.yearForm.controls['year'].value;
    this.getProcess(+this.yearSelect);
    // if( this.yearSelect == undefined){
    //   this.showTable = false;
    // }else{
    //   this.showTable = true;
    // }
  }

  public onStepChange(event: any): void {
    console.log("onStepChange " ,event);

        this.step = event.selectedIndex+1;

  }
  getAllBaseYear(){
    this.baseYearService.getAllBaseYear().subscribe(
      (res)=>{
        console.log("base year all =>" , res)
        res.forEach(element => {
          this.yearList.push(element.baseYear+"");
         
        });
           this.flagYear = true;
      
      },
      (error)=>{

      }
    )
  }

  getAllCheckModeBaseYear(){
    this.baseYearService.getModeAllBaseYear().subscribe(
      (res)=>{
        console.log("base year all =>" , res)
        // res.forEach(element => {
        //   this.yearList.push(element.baseYear+"");
         
        // });
        this.baseYearAll = res;

        this.filterBaseYearOptions = this.filterBaseYearControl.valueChanges
        .pipe(
          startWith(''),
          map(value => {
            console.log(value);
            
            
            return value ? this._filterBaseYearList(value) : this.baseYearAll.slice();
          })
        );
        
      
      },
      (error)=>{
        console.log(error);
      }
    )
  }

  getParamsProcess(paramGroup: string,typeSeq :string) {//PROCESS_SEQ_TYPE
    this.paramsProcess = this.paramService.getParamByGroupCodeAndInfoCode(paramGroup, typeSeq);
    return this.paramsProcess.paramLocalMessage;

  }

  getSeqType(){
    this.paramService.getParamInfoByGroup("PROCESS_SEQ_TYPE").subscribe(
      (res) => {
          
        this.processSeqType = res.info;
        this.processSeqType.forEach(info => {
          
          let typeNum = info.paramInfo.replace("PROCESS_SEQ_" , "");
          let number = +typeNum
          // if(number == type){
            this.typePageName = info.paramLocalMessage;
            this.addProcessType = info.paramInfo;
          
          // }
        });
      }
    );
    }

  getProcess(baseYear : number){
    this.loading.show();
    this.documentService.getProcess(baseYear).subscribe(
      (res)=>{
        this.loading.hide();
        this.history = [];
          console.log(res)
          if(res!=null){
          res.forEach(element => {
            let obj = {type : 0 , name : "" , description : "" , file : "" }

            let typeNum = element.processSeq.paramCode.replace("PROCESS_SEQ_" , "");
            let number = +typeNum
            obj.type = number;
            obj.name = element.processSeq.paramLocalDescription
            obj.description = element.description
            console.log("obj =>" , obj)
            this.history.push(obj)
            this.history.sort(
              (a,b): number =>{
                if(a.type<b.type) return -1;
                else if (a.type>b.type) return 1;
                return 0;
              }
            )
            
            this.dataSource = new MatTableDataSource(this.history);
          
            this.showTable = true;

          
          });
        }else{
          this.showTable = false;
          
        }
      },
      (error)=>{
        this.loading.hide();
      }
      )
  }
  selectedTabChange(event){
    if(event.index == 1){
      this.yearSelect = this.yearForm.controls['year'].value;
      this.getProcess(+this.yearSelect);
    }
    
  }

  openDialogFile(element){
    console.log("openDialogFile =>",element);


    
    const dialogRef = this.dialog.open(DialogFileComponent,{
      data: {type :element.type , baseYear :this.yearForm.controls['year'].value}
    });

    dialogRef.afterClosed().subscribe(
        data => console.log("Dialog output:", data)
    );  
 
  }

  private _filterBaseYearList(baseYear: number): any[] {
    const filterValue = baseYear.toString();
  

    this.checkMode = this.baseYearAll.filter(option => 
      option.baseYear.toString().startsWith(filterValue)
    )
    console.log('Mode =====> ',this.checkMode);
    
    return this.checkMode;
  }
 


}
