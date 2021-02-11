import { DetailStakeholderComponent } from './../component/detail-stakeholder/detail-stakeholder.component';
import { StakeholderEditRequest } from './../../../shared/models/stakeholder/request/stakeholderEditRequest';
import { ProvinceService } from './../../../core/service/province/province.service';
import { TambolserviceService } from './../../../core/service/tambol/tambolservice.service';
import { TambolSearchRequest } from './../../../shared/models/request/tambolsearchRequest';
import { SortedList } from './../../../shared/models/stakeholder/request/sortedList';
import { StakeholderService } from './../../../core/service/stakeholder/stakeholder.service';
import { StakeholderPageableRequest } from './../../../shared/models/stakeholder/request/stakeholderpageablerequest';
import { DialogStakeholderComponent } from './../component/dialog-stakeholder/dialog-stakeholder.component';
import { MatTableDataSource, MatDialog, MatSort, Sort } from '@angular/material';
import { NgxSpinnerService } from 'ngx-spinner';
import { Pageable } from 'src/app/shared/models/stakeholder/request/pageable';
import { FormControl, FormGroup, Validators, FormBuilder, FormArray } from '@angular/forms';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Observable, fromEvent } from 'rxjs';
import { startWith, map, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { noWhitespaceValidator } from 'src/app/shared/common/noWhitespaceValidator';
import { ActivatedRoute, Router } from '@angular/router';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';

@Component({
  selector: 'app-stakeholder',
  templateUrl: './stakeholder.component.html',
  styleUrls: ['./stakeholder.component.scss']
})
export class StakeholderComponent implements OnInit {
  @ViewChild('automatAutocomplete', { static: false }) provinceSearchInput: ElementRef;
  @ViewChild('deleteSwal', { static: false }) deleteSwal: SwalComponent;
  @ViewChild('deleteSwalSuccess', { static: false }) deleteSwalSuccess: SwalComponent;
  @ViewChild(MatSort, { static: false }) set conent(sort: MatSort) { this.dataStakeholder.sort = sort; }
  txtStakeholderName = "ผู้มีส่วนได้ส่วนเสีย";
  txtStakeholderCode = "Stakeholder";
  btnSaveStakeholder = true;
  displayStakeholder = true;
  dataStakeholder = new MatTableDataSource();
  stakeholderEditActice:any;
  tabSettingStakeholder = false;
  totalRecords: number;
  pageSize = 10;
  page = 1;
  stakeholderCodeActive: string;
  searchLoading = false;
  options:any;
  displayedColumns: string[] = ['stakeholderCode', 'stakeholderName','stakeholderAddr', 'view','deleted'];
  searchFilter = {provinceName:"",stakeholderCode:"",stakeholderName:""};
  provinceAll = new Array();
  filterProvinceOptions: Observable<any[]>;
  filterProvinceControl = new FormControl();
  editStakeholder: FormGroup;
  constructor(
    public dialog: MatDialog,
    private loading: NgxSpinnerService,
    private stakeholderPageableRequest: StakeholderPageableRequest,
    private stakeholderService: StakeholderService,
    private pageable: Pageable,
    private sortedList: SortedList,
    private tambolSearchRequest: TambolSearchRequest,
    private tambolService: TambolserviceService,
    private provinceService:ProvinceService,
    private _formBuilder:FormBuilder,
    private noWhitespaceValidator:noWhitespaceValidator,
    private stakeholderEditRequest: StakeholderEditRequest,
    private route:Router,
    ) { }

  ngOnInit() {
    this.editStakeholder = this._formBuilder.group({
      stakeholderCodeEdit: ['',Validators.required],
      stakeholderNameEdit: ['',Validators.required,this.noWhitespaceValidator.noWhitespace],
      stakeholderTaxNoEdit:['',Validators.required,this.noWhitespaceValidator.noWhitespace],
      stakeholderPostCodeEdit:['',Validators.required],
      stakeholderAddrEdit:['',Validators.required],
      stakeholderAddressEdit:['',Validators.required,this.noWhitespaceValidator.noWhitespace],
    });
    this.getStakeholderPageable(this.page, this.pageSize);
    this.getProvinceAll();
    this.filterProvinceOptions = this.filterProvinceControl.valueChanges
    .pipe(
      startWith(''),
      map(value => {
        console.log(value);
        return typeof value === 'string' ? value : value.provinceName;
      }),
      map(provinceName => {
        return provinceName ? this._filterProvinceList(provinceName) : this.provinceAll.slice();
      })
    );
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogStakeholderComponent, {
      width: '80%',
      height:'70%',
      data: "test",
      position: {
        top: '2%',
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getStakeholderPageable(this.page, this.pageSize);
      }
    });
  }

  private _filter(name: string): any {
    console.log(name);
    const filterValue = name.toLowerCase();
    // return this.options.filter(option => option.name.toLowerCase().indexOf(filterValue) === 0);
  }

  applyFilter(filterValue: string) {
    this.dataStakeholder.filter = filterValue.trim().toLowerCase();
    console.log( this.dataStakeholder);
  }

  detailStakeholder(data: any) {
    console.log(data);
    const dialogRef = this.dialog.open(DetailStakeholderComponent, {
      width: '80%',
      height:'70%',
      data: data,
      position: {
        top: '2%',
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getStakeholderPageable(this.page, this.pageSize);
      }
    });
  }

  private _filterProvinceList(name: string): any[] {
    const filterValue = name;
    return this.provinceAll.filter(option => option.provinceName.startsWith(filterValue));
  }

  getStakeholderPageable(page, pageSize) {
    this.loading.show();
    this.stakeholderPageableRequest.direction = "ASC";
    this.stakeholderPageableRequest.page = page;
    this.page = page;
    this.stakeholderPageableRequest.size = pageSize;
    this.pageSize = pageSize;
    this.stakeholderPageableRequest.provinceName = this.searchFilter.provinceName;
    this.stakeholderPageableRequest.stakeholderCode = this.searchFilter.stakeholderCode;
    this.stakeholderPageableRequest.stakeholderName = this.searchFilter.stakeholderName;
    console.log( this.stakeholderPageableRequest);
    this.stakeholderService.getStakeholder(this.stakeholderPageableRequest).subscribe(
      (res) => {
        this.loading.hide();
        this.dataStakeholder = new MatTableDataSource(res.data);
        this.totalRecords = res.totalRecords;
        console.log(res);
      },
      (error) => {
        console.log(error);
        this.loading.hide();
      }
    )
  }

  closeTabs() {
    this.tabSettingStakeholder = false;
    this.displayStakeholder = true;
    this.btnSaveStakeholder = true;
    this.route.navigate([{ outlets: { dataconfig: null } }])
           .then(() => this.route.navigate(['survey']));
    this.txtStakeholderName = "ผู้ให้ข้อมูล";
    this.txtStakeholderCode = "Survey";
    this.getStakeholderPageable(this.page, this.pageSize);
  }

  getProvinceAll(){
    this.provinceService.getProvinceAll().subscribe(
      (res) => {
        this.provinceAll = res;
      },
      (error) => {
        console.log(error);
      }
    )
  }

  displayFn(province: any): string | undefined {
    return province ? province : undefined;
  }

  onSortData(sort: Sort) {
    this.dataStakeholder.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'stakeholderCode': {
          return item['stakeholder'].stakeholderCode;
        }
        case 'stakeholderName': {
          return item['stakeholder'].stakeholderName;
        }
        case 'stakeholderAddr': {
          return item['stakeholder'].ppiMsTambol.tambolName;
        }
        default: return item[property];
      }
    };
  }

  editProvinceAutoComplete(){
    fromEvent(this.provinceSearchInput.nativeElement, 'keyup').pipe(
      map((event: any) => {
        this.searchLoading = true;
        return event.target.value;
      }),
      debounceTime(1000),
      distinctUntilChanged()
    ).subscribe((text: string) => {
      console.log(text);
      var arr = text.split(" ");
      this.tambolSearchRequest.provinceName = arr[0] != undefined ? arr[0] : "";
      this.tambolSearchRequest.amphurName = arr[1] != undefined ? arr[1] : "";
      this.tambolSearchRequest.tambolName = arr[2] != undefined ? arr[2] : "";
      this.tambolService.searchTambol(this.tambolSearchRequest)
        .subscribe(
          (res) => {
            this.options = res;
            this.searchLoading = false;
          },
          (error) => {
            this.options = [];
            this.searchLoading = false;
          }
        )
    }
    )
  }

  deleteStakeholder(stakeholder) {
    this.loading.show();
    this.stakeholderService.deleteStakeholder(stakeholder.stakeholder.stakeholderCode).subscribe(
      (res) => {
        this.loading.hide();
        this.getStakeholderPageable(this.page, this.pageSize);
        this.deleteSwalSuccess.show();
      },
      (error) => {
        console.log(error);
        this.loading.hide();
      }
    )
  }

  onSearch(){
    console.log("searchFilter",this.searchFilter);
    this.getStakeholderPageable(1,this.pageSize);
  }

  updatePagination(event) {
    this.getStakeholderPageable(event.pageIndex + 1,event.pageSize);
  }
}
