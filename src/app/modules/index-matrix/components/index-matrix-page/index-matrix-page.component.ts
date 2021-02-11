import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatTableDataSource, PageEvent } from '@angular/material';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';
import { identity } from 'rxjs';
import { IndexMatrixService } from 'src/app/core/service/indexmatrix/index-matrix.service';
import { ParamService } from 'src/app/core/service/param/param.service';
import { ApplicationConstant } from 'src/app/shared/constants/ApplicationConstant';
import { CpipMsIndexMatrixRequestForm } from 'src/app/shared/models/index-matrix/CpipMsIndexMatrixRequestForm';
import { InquiryProvinceNameResponse } from 'src/app/shared/models/weight/request/InquiryProvinceNameResponse.model';
import { DialogAddIndexMatrixComponent } from '../dialog-add-index-matrix/dialog-add-index-matrix.component';

const constants = ApplicationConstant;
@Component({
  selector: 'app-index-matrix-page',
  templateUrl: './index-matrix-page.component.html',
  styleUrls: ['./index-matrix-page.component.scss']
})
export class IndexMatrixPageComponent implements OnInit {
  @ViewChild("deleteIndexMatrixSwal",{static:false}) deleteIndexMatrixSwal:SwalComponent;
  @ViewChild("succussDeleteIndexMatrixSwal",{static:false}) succussDeleteIndexMatrixSwal:SwalComponent;

  displayedColumns: string[] = [];
  displayedRegionColumns: string[] = ['indexGroup', 'region', 'edit', 'delete'];
  displayedProvinceColumns: string[] = ['indexGroup', 'province', 'edit', 'delete'];
  dataSource = new MatTableDataSource();
  pageIndex = 0;
  listProvinceData = new Array<InquiryProvinceNameResponse>();
  listIndexGroup = new Array();
  listIndexMatrix = new Array();
  listIndexMatrixProvince = new Array();
  group;
  indexGroup;
  deleteIndexMatrixId;
  isShowRegionInput = false;
  isShowProvinceInput = false;
  isShowSearch = false;
  isShowAdd = false;
  isShowEdit = false;
  isShowRegion = false;
  isShowProvince = false;
  isShowTable = false;
  selectedIndex;
  regionId;
  provinceId;

  page = 0;
  size = 10;
  length = 0;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  pageEvent: PageEvent = new PageEvent;
  cpipMsIndexMatrixRequestForm: CpipMsIndexMatrixRequestForm;

  constructor(
    private loading: NgxSpinnerService,
    private indexMatrixService: IndexMatrixService,
    private paramService: ParamService,
    private dialog: MatDialog
  ) { 
    this.pageEvent.pageIndex = 0;
    this.pageEvent.pageSize = this.pageSize;
    this.pageEvent.length = this.length;
  }

  ngOnInit(): void {
    this.preparePage();
  }

  preparePage() {
    this.listIndexGroup = this.paramService.getParamByGroup(constants.ParamGroup.indexGroup);
  }

  selectIndexGroup() {
    this.group = this.listIndexGroup.find(i => i.paramId === this.indexGroup);
    this.isShowSearch = true;
    this.checkAddEdit('add');
  }

  checkAddEdit(action){
    this.indexMatrixService.getRegionOrProvinceByIndexMatrix(this.indexGroup).subscribe((res) => {
      let count = 0;
      if (this.group.paramInfo != 'CPIP') {
        count = res.regionNameList.length;
      } else {
        count = res.provinceNameList.length;
      }
      if(count>0){
        if(action === 'both'){
          this.isShowAdd = true;
          this.isShowEdit = true;
        } else if(action === 'add'){
          this.isShowAdd = true;
        } else {
          this.isShowEdit = true;
        }
      } else {
        if(action === 'both'){
          this.isShowAdd = false;
          this.isShowEdit = false;
        } else if(action === 'add'){
          this.isShowAdd = false;
        } else {
          this.isShowEdit = false;
        }
      }
    },(error) => {
      this.loading.hide();
    });
  }

  searchCpipMsIndexMatrixByIndexGroupId() {
    this.getCpipMsIndexMatrixByIndexGroupId();
    this.checkAddEdit('edit');
  }

  setProvinceData(){
    this.loading.show();
    let indexGroup = this.listIndexGroup.find(x => x.paramInfo === 'CPIP');
    if(indexGroup != null){
      this.indexMatrixService.inquiryIndexMatrix(indexGroup.paramId).subscribe((res) => {
        this.loading.hide();
        this.listProvinceData = res.provinceNameList;
      }, (error) => {
        this.loading.hide();
      });
    }
    
  }

  getCpipMsIndexMatrixByIndexGroupId() {
    this.loading.show();
    this.indexMatrixService.getCpipMsIndexMatrixByIndexGroupId(this.indexGroup, this.page, this.size).subscribe((res) => {
      console.log(res);
      this.length = res.totalElements;
      this.dataSource = new MatTableDataSource(res.content);
      this.isShowTable = true;
      if("CPIP" === this.group.paramInfo){
        this.displayedColumns = this.displayedProvinceColumns;
        this.isShowRegion = false;
        this.isShowProvince = true;
      } else {
        this.displayedColumns = this.displayedRegionColumns;
        this.isShowRegion = true;
        this.isShowProvince = true;
      }
      this.loading.hide();
    }, (error) => {
      this.loading.hide();
    });
  }

  pageChange(e: PageEvent): PageEvent {
    this.page = e.pageIndex;
    this.size = e.pageSize;
    this.getCpipMsIndexMatrixByIndexGroupId();
    return e;
  }

  openDialogAddCpipMsIndexMatrix(row): void {
    const dialogRef = this.dialog.open(DialogAddIndexMatrixComponent, {
      width: '650px',
      height: '250px',
      position: {
        top: '10%'
      },
      data: row
    });

    dialogRef.afterClosed().subscribe(result => {
      // if (result) {
      //   this.getParamInfo();
      // }
      this.getCpipMsIndexMatrixByIndexGroupId();
      this.checkAddEdit('both');
    });
  }

  onSubmit(indexMatrixId){
    this.deleteIndexMatrixId = indexMatrixId;
    this.deleteIndexMatrixSwal.show();
  }

  onDelete(){
    this.loading.show();
    this.cpipMsIndexMatrixRequestForm = new CpipMsIndexMatrixRequestForm();
    this.cpipMsIndexMatrixRequestForm.indexMatrixId = this.deleteIndexMatrixId;
    this.indexMatrixService.deleteCpipMsIndexMatrix(this.cpipMsIndexMatrixRequestForm).subscribe(
      (res) => {
        this.checkAddEdit('both');
        this.loading.hide();
        this.succussDeleteIndexMatrixSwal.show();
      },
      (error) => {
        this.loading.hide();
        console.log(error);
      }
    )
  }

  closeDialog(){
    this.getCpipMsIndexMatrixByIndexGroupId();
  }
  
}

