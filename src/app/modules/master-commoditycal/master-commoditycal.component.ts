import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { DialogEditcommoditycalComponent } from './components/dialog-editcommoditycal/dialog-editcommoditycal.component';
import { DialogAddcommoditycalComponent } from './components/dialog-addcommoditycal/dialog-addcommoditycal.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatTableDataSource, MatSort } from '@angular/material';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-master-commoditycal',
  templateUrl: './master-commoditycal.component.html',
  styleUrls: ['./master-commoditycal.component.scss']
})
export class MasterCommoditycalComponent implements OnInit {
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild('deleteCommodityCalSwal',{static:false}) deleteCommodityCalSwal:SwalComponent;
  @ViewChild('succussDeleteCommodityCalSwal',{static:false}) succussDeleteCommodityCalSwal:SwalComponent;
  displayedColumns:String[] = ['code','commodityCode','action'];
  dataSource = new MatTableDataSource();
  mockData = [
    {code:"001",commodityCode:"1011111010000000"},
    {code:"002",commodityCode:"1011111020000000"},
    {code:"003",commodityCode:"1011111010000000"},
    {code:"004",commodityCode:"1011112000000000"},
    {code:"005",commodityCode:"1011112010000000"},
    {code:"006",commodityCode:"1011112020000000"},
    {code:"007",commodityCode:"1011112030000000"},
    {code:"008",commodityCode:"1011112040000000"},
    {code:"009",commodityCode:"1011112050000000"},
    {code:"010",commodityCode:"1011113000000000"},
  ]
  constructor(
    private dialog:MatDialog,
    private loading:NgxSpinnerService
  ) { }

  ngOnInit() {
    this.viewCommodityCal();
    this.dataSource.sort = this.sort;
  }

  viewCommodityCal(){
    this.loading.show();
    this.dataSource = new MatTableDataSource(this.mockData);
    this.loading.hide();
  }

  deleteCommodityCal(evt){
      let index = this.mockData.map(function (e) { return e.code; }).indexOf(evt.code);
      this.mockData.splice(index,1);
      this.succussDeleteCommodityCalSwal.show();
  }

  openAddDialog():void{
    const dialogRef = this.dialog.open(DialogAddcommoditycalComponent, {
      width: '760px',
      data: "test",
      position: {
        top: '10%',
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.mockData.push(result);
        this.viewCommodityCal();
      }
    });
  }


  openEditDialog(evt):void{
    const dialogRef = this.dialog.open(DialogEditcommoditycalComponent, {
      width: '760px',
      data: evt,
      position: {
        top: '10%',
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

}
