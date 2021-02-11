import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { ParamService } from './../../../../core/service/param/param.service';
import { DialogEditparaminfoComponent } from './../dialog-editparaminfo/dialog-editparaminfo.component';
import { DialogAddparaminfoComponent } from './../dialog-addparaminfo/dialog-addparaminfo.component';
import { MatTableDataSource, MatDialog, Sort, MatSort } from '@angular/material';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-master-paraminfo',
  templateUrl: './master-paraminfo.component.html',
  styleUrls: ['./master-paraminfo.component.scss']
})
export class MasterParaminfoComponent implements OnInit {
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild("succussParamInfoSwal", { static: false }) succussParamInfoSwal: SwalComponent;
  paramInfo = new Array();
  paramGroup: string;
  paramGroupName: String;
  dataSource = new MatTableDataSource();
  displayedColumns: string[] = ['no', 'paramInfo', 'paraminfoNameTH', 'paraminfoNameEN', 'specialPurpose', 'sortingOrder','isActive' ,'editInfo', 'deletedInfo'];
  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private paramService: ParamService,
    private router: Router,
    private loading: NgxSpinnerService
  ) { }

  ngOnInit() {
    if (history.state['paramgroup'] == undefined) {
      this.router.navigateByUrl("/params");
    }
    this.getParamsActiveRoute();
    this.getParamInfo();
  }

  getParamsActiveRoute() {
    let group = history.state;
    this.paramGroup = group['paramgroup'].paramGroup;
    console.log(this.paramGroup);

  }

  getParamInfo() {
    this.loading.show();
    this.paramService.getParamInfo(this.paramGroup).subscribe(
      (res) => {
        this.loading.hide();
        console.log(res.info);
        this.dataSource = new MatTableDataSource(res.info);
        this.dataSource.sort = this.sort;
      },
      (error) => {
        this.loading.hide();
        console.log(error);
      }
    )
    this.dataSource = new MatTableDataSource(this.paramInfo);
  }

  deleteParamInfo(e) {
    this.loading.show();
    this.paramService.deleteParamInfo(e.paramId,e.paramInfo).subscribe(
      (res) => {
        this.loading.hide();
        this.succussParamInfoSwal.show();
      },
      (error) => {
        this.loading.hide();
        console.log(error);
      }
    )
  }

  onAddParamsInfo(): void {
    const dialogRef = this.dialog.open(DialogAddparaminfoComponent, {
      width: '650px',
      position: {
        top: '10%'
      },
      data: this.paramGroup
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getParamInfo();
      }
    });
  }

  onEditParamsInfo(data): void {
    const dialogRef = this.dialog.open(DialogEditparaminfoComponent, {
      width: '550px',
      position: {
        top: '10%'
      },
      data: data
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getParamInfo();
      }
    });
  }

  onSortData(sort: Sort) {
    this.dataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'paramInfo': {
          return item['paramCode'];
        }
        case 'paraminfoNameTH': {
          return item['paramLocalDescription']
        }
        case 'paraminfoNameEN': {
          return item['paramEnDescription'];
        }
        case 'specialPurpose': {
          return item['specialPurpose'];
        }
        case 'sortingOrder': {
          return item['sortingOrder'];
        }
        default: return item[property];
      }
    };
  }

}
