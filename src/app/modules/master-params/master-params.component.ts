import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { Router } from '@angular/router';
import { DialogEditparamgroupComponent } from './component/dialog-editparamgroup/dialog-editparamgroup.component';
import { DialogAddparamsgroupComponent } from './component/dialog-addparamsgroup/dialog-addparamsgroup.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ParamService } from 'src/app/core/service/param/param.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-master-params',
  templateUrl: './master-params.component.html',
  styleUrls: ['./master-params.component.scss']
})
export class MasterParamsComponent implements OnInit {
  @ViewChild("delSuccussParamGroupSwal",{static:false}) delSuccussParamGroupSwal:SwalComponent;
  paramGroup = new Array;
  groupDeleted = "Y";
  constructor(
    private dialog:MatDialog,
    private paramService:ParamService,
    private router:Router,
    private loading:NgxSpinnerService,

  ) { }

  ngOnInit() {
    this.getParamGroup();
  }

  getParamGroup(){
    this.loading.show();
    this.paramService.getParamsGroup().subscribe(
      (res) => {
        this.paramGroup = res.sort((a, b) => a.isDeleted.localeCompare(b.isDeleted));
        // this.paramGroup = res;
        this.loading.hide();
      },
      (error) => {
        this.loading.hide();
      }
    )
  }

  deleteParamGroup(e){
    this.loading.show();
    this.paramService.deleteParamGroup(e.paramGroup).subscribe(
      (res) => {
        this.loading.hide();
        this.delSuccussParamGroupSwal.show();
      },
      (error) => {
        this.loading.hide();
      }
    )
  }

  onAddParamsGroup(): void {
    const dialogRef = this.dialog.open(DialogAddparamsgroupComponent, {
      width: '650px',
      position:{
        top:'10%'
      },
      data: ""
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.getParamGroup();
      }
    });
  }

  onEditParamsGroup(e): void {
    const dialogRef = this.dialog.open(DialogEditparamgroupComponent, {
      width: '550px',
      position:{
        top:'10%'
      },
      data: e
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.getParamGroup();
      }
    });
  }

  goToParamInfo(param){
    this.router.navigateByUrl("params/paraminfo",{ state: { 'paramgroup': param } });
  }

}
