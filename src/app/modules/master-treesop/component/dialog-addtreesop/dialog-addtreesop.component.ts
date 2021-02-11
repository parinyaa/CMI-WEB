import { Observable } from 'rxjs';
import { PpitreeService } from './../../../../core/service/ppitree/ppitree.service';
import { SoptreeService } from './../../../../core/service/soptree/soptree.service';
import { noWhitespaceValidator } from 'src/app/shared/common/noWhitespaceValidator';
import { SopCreateRequest } from './../../../../shared/models/soptree/request/SopCreateRequest';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'app-dialog-addtreesop',
  templateUrl: './dialog-addtreesop.component.html',
  styleUrls: ['./dialog-addtreesop.component.scss']
})
export class DialogAddtreesopComponent implements OnInit {
  @ViewChild("saveSopTreeSwal",{static:false}) saveSopTreeSwal:SwalComponent;
  @ViewChild("sucessSopTreeSwal",{static:false}) sucessSopTreeSwal:SwalComponent;
  typeSop = true;
  submitted = false;
  addSopForm:FormGroup;
  myControl = new FormControl();
  options = new Array();
  filteredOptions: Observable<string[]>;
  cpaIsMap = null;
  constructor(
    public dialogRef: MatDialogRef<DialogAddtreesopComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _formBuilder:FormBuilder,
    private noWhitespaceValidator:noWhitespaceValidator,
    private sopCreateRequest:SopCreateRequest,
    private soptreeService:SoptreeService,
    private loading:NgxSpinnerService,
    private ppitreeService:PpitreeService
  ) { }

  ngOnInit() {
    if(this.data.sopLevel < 6 || this.data == 0){
      this.typeSop = true;
      this.addSopForm = this._formBuilder.group({
        sopCode:['',Validators.required],
        sopThName:['',Validators.required,this.noWhitespaceValidator.noWhitespace],
        sopEnName:['',Validators.required,this.noWhitespaceValidator.noWhitespace]
      });
    }else{
      this.getCpaList();
      this.onFilteredOptions();
      this.typeSop = false;
      this.addSopForm = this._formBuilder.group({
        cpaCode:['',Validators.required],
        cpaThName:[''],
        cpaEnName:['',],
        sopCodeMap:['',Validators.required]
      });
    }

  }

  closeDialog(){
    this.dialogRef.close(true);
  }

  getCpaList(){
    this.ppitreeService.getCpaList().subscribe(
      (res) => {
        this.options = res;
        // this.onFilteredOptions();
      },
      (error) => {
        console.log(error);
      }
    )
  }

  onCreateSopTree(){
    console.log("onCreateSopTree");
    this.loading.show();
    if(this.typeSop){
      this.sopCreateRequest.sopCode = this.addSopForm.controls['sopCode'].value;
      this.sopCreateRequest.sopThName = this.addSopForm.controls['sopThName'].value;
      this.sopCreateRequest.sopEnName = this.addSopForm.controls['sopEnName'].value;
      this.sopCreateRequest.parentId = this.data.sopId?this.data.sopId:0;
    }else{
      this.sopCreateRequest.sopCode = this.addSopForm.controls['sopCodeMap'].value;
      this.sopCreateRequest.parentId = this.data.sopId?this.data.sopId:0;
      this.sopCreateRequest.cpaId = this.cpaIsMap;
      this.sopCreateRequest.sopThName = this.addSopForm.controls['cpaThName'].value;
      this.sopCreateRequest.sopEnName = this.addSopForm.controls['cpaEnName'].value;
    }
    this.soptreeService.createSopTree(this.sopCreateRequest).subscribe(
      (res) => {
        this.loading.hide();
        this.sucessSopTreeSwal.show();
      },
      (error) => {
        this.loading.hide();
        console.log(error);
      }
    )
  }

  optionSelected(e){
    console.log("optionSelected",e);
    let value = e.option.value;
    this.cpaIsMap = value.cpaId;
    this.addSopForm.controls['cpaCode'].setValue(value.commodityCode);
    this.addSopForm.controls['cpaThName'].setValue(value.commodityThName);
    this.addSopForm.controls['cpaEnName'].setValue(value.commodityEnName);
  }

  get f(){return this.addSopForm.controls;}

  onSubmit(){
    console.log("onSubmit");
    this.submitted = true;
    if(this.addSopForm.invalid){
      console.log("invalid");
      return;
    }else{
     this.saveSopTreeSwal.show();
    }
  }

  onFilteredOptions(){
    console.log(this.myControl);
    this.filteredOptions = this.myControl.valueChanges
    .pipe(
      startWith(''),
      map(value => this._filter(value))
    );
  }

  displayFn(options: any): string | undefined {
    console.log("options",options);
    return options ? options : "";
  }

  private _filter(value: string): string[] {
    const filterValue = value;
    return this.options.filter(option => option.commodityCode.includes(filterValue));
  }



}
