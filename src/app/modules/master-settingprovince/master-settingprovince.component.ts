import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { ProvinceService } from './../../core/service/province/province.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatTableDataSource, MatSort } from '@angular/material';
import { DialogAddsettingprovinceComponent } from './components/dialog-addsettingprovince/dialog-addsettingprovince.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogEditsettingprovinceComponent } from './components/dialog-editsettingprovince/dialog-editsettingprovince.component';

@Component({
  selector: 'app-master-settingprovince',
  templateUrl: './master-settingprovince.component.html',
  styleUrls: ['./master-settingprovince.component.scss']
})
export class MasterSettingprovinceComponent implements OnInit {
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild("deleteSuccessSwal",{static:false}) deleteSuccessSwal:SwalComponent;
  displayedColumns: string[] = ['provinceName', 'surveyCode', 'sourceCode', 'commodityCode', 'action'];
  mockData = [
    { provinceCode: "71", provinceName: "กาญจนบุรี", surveyCode: "0103700001", sourceCode: "0102400001", commodityCode: "1011111010000000" },
    { provinceCode: "71", provinceName: "เชียงใหม่", surveyCode: "0100100001", sourceCode: "0104000001", commodityCode: "1011111020000000" },
    { provinceCode: "71", provinceName: "เชียงใหม่", surveyCode: "0100100002", sourceCode: "0101100002", commodityCode: "1011111010000000" },
    { provinceCode: "71", provinceName: "เชียงราย", surveyCode: "0100100002", sourceCode: "0101100001", commodityCode: "1011112000000000" },
    { provinceCode: "71", provinceName: "นครปฐม", surveyCode: "0100100002", sourceCode: "0101200001", commodityCode: "1011112010000000" },
    { provinceCode: "71", provinceName: "กาญจนบุรี", surveyCode: "0100100002", sourceCode: "0110100001", commodityCode: "1011112020000000" },
    { provinceCode: "71", provinceName: "ชลบุรี", surveyCode: "0101500001", sourceCode: "0101300001", commodityCode: "1011112030000000" },
    { provinceCode: "71", provinceName: "ลพบุรี", surveyCode: "0101300001", sourceCode: "0101500001", commodityCode: "1011112040000000" },
    { provinceCode: "71", provinceName: "พังงา", surveyCode: "0110100001", sourceCode: "0103300001", commodityCode: "1011112050000000" },
    { provinceCode: "71", provinceName: "กาญจนบุรี", surveyCode: "0101200001", sourceCode: "0100100003", commodityCode: "1011113000000000" }
  ]
  dataSource = new MatTableDataSource();
  provinceAll = new Array;
  // dataSource = new MatTableDataSource();
  constructor(
    private dialog: MatDialog,
    private provinceService: ProvinceService,
    private loading: NgxSpinnerService
  ) { }

  ngOnInit() {
    this.onViewData();
    this.dataSource.sort = this.sort;
  }

  onViewData() {
    this.loading.show();
    this.dataSource = new MatTableDataSource(this.mockData);
    this.setSelectProvince();
  }

  openAddDialog() {
    const dialogRef = this.dialog.open(DialogAddsettingprovinceComponent, {
      width: '760px',
      data: { province: this.provinceAll },
      position: {
        top: '10%',
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.mockData.push(result);
        this.onViewData();
      }
    });
  }

  openEditDialog(data) {
    const dialogRef = this.dialog.open(DialogEditsettingprovinceComponent, {
      width: '760px',
      data: { province: this.provinceAll, data: data },
      position: {
        top: '10%',
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.onEditData(result);
      }
    });
  }

  onEditData(data){
    let index = this.mockData.map(function(e){return e.surveyCode}).indexOf(data.surveyCode);
    this.mockData[index].sourceCode = data.sourceCode;
    this.mockData[index].commodityCode = data.commodityCode;
    this.mockData[index].provinceCode = data.province.provinceCode;
    this.mockData[index].provinceName = data.province.provinceName;
    this.onViewData();
  }

  onDeleteData(evt){
    let index = this.mockData.map(function(e){return e.surveyCode}).indexOf(evt.surveyCode);
    this.mockData.splice(index,1);
    this.deleteSuccessSwal.show();
  }

  setSelectProvince() {
    this.provinceService.getProvinceAll()
      .subscribe(
        (res) => {
          this.provinceAll = res;
          this.loading.hide();
        },
        (error) => {
          this.provinceAll = [];
          console.log(error);
          this.loading.hide();
        }
      )
  }
}
