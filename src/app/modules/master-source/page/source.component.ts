import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatDialog, MatSort} from '@angular/material';
import { DialogSourceComponent } from '../component/dialog-source/dialog-source.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
const ELEMENT_DATA = [
  {sourceCode: "0103700001", surveyCode:'0103700001', sourceName: 'บริษัท แหลมทองการแพทย์  จำกัด', sourcePhone:'5141112-3 '},
  {sourceCode: "0100100001", surveyCode:'0100100001', sourceName: 'กรมอุตสาหกรรมพื้นฐานและการเหมืองแร่', sourcePhone:'02-2023667-8 '},
  {sourceCode: "0100100002", surveyCode:'0100100002', sourceName: 'บริษัท แหลมทองฟู๊ดมาร์เก็ตติ้ง จำกัด', sourcePhone:'2523777'},
  {sourceCode: "0103000001", surveyCode:'0103000001', sourceName: 'กอง รักษาสิทธิประโยชน์ผู้บริโภค', sourcePhone:'221-6864 6236159 623'},
  {sourceCode: "0100100003", surveyCode:'0100100003', sourceName: 'บริษัท ปตท. จำกัด(มหาชน)', sourcePhone:'5373248,5372416-8,01-8251005'},
  {sourceCode: "0103300001", surveyCode:'0103300001', sourceName: 'บริษัท เหล่าติงกวง จำกัด', sourcePhone:'2814159,2817103'},
  {sourceCode: "0101500001", surveyCode:'0101500001', sourceName: 'บริษัท H.A.M. อินเตอร์เนชั่นแนล จำกัด', sourcePhone:'3901159,3922505'},
  {sourceCode: "0101300001", surveyCode:'0101300001', sourceName: 'บริษัท กรีนค๊อตตอน (ประเทศไทย) จำกัด', sourcePhone:'8606085'},
  {sourceCode: "0110100001", surveyCode:'0110100001', sourceName: 'บริษัท กรุงเทพคาร์ไบท์อุตสาหกรรม จำกัด', sourcePhone:'6395013-5'},
  {sourceCode: "0101200001", surveyCode:'0101200001', sourceName: 'บริษัท M&H แมนนูแฟคเจอริ่ง จำกัด', sourcePhone:'2545880'},
  {sourceCode: "0101100001", surveyCode:'0101100001', sourceName: 'บริษัท กีวี และคมคมโปรดักซ์ จำกัด', sourcePhone:'6838860-3'},
  {sourceCode: "0101100002", surveyCode:'0101100002', sourceName: 'บริษัท กุลธร เคอร์บี้ จำกัด (มหาชน)', sourcePhone:'3260831-6'},
  {sourceCode: "0104000001", surveyCode:'0104000001', sourceName: 'บริษัท กุลธร อิเลคทริค จำกัด (มหาชน) (ชื่อเดิม กุลธร ยูนิเวอร์แซล (มหาชน)', sourcePhone:'3260527-8 '},
  {sourceCode: "0102400001", surveyCode:'0102400001', sourceName: 'บริษัท กู๊ดเยียร์ (ประเทศไทย) จำกัด', sourcePhone:'2642700 ต่อ 301'},
];

@Component({
  selector: 'app-source',
  templateUrl: './source.component.html',
  styleUrls: ['./source.component.scss']
})
export class SourceComponent implements OnInit {
  @ViewChild('deleteSwalSource',{static:false}) private deleteSwalSource: SwalComponent;
  @ViewChild('deleteSwalSourceSuccess',{static:false}) private deleteSwalSourceSuccess: SwalComponent;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  displayedColumns: string[] = ['sourceCode','surveyCode','sourceName','sourcePhone','action'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);
  constructor(
    public dialog: MatDialog,
    private loading:NgxSpinnerService
  ) { }

  ngOnInit() {
    this.dataSource.sort = this.sort;
    console.log(this.dataSource.sort);
    this.loading.show();
    setTimeout(() => {
      this.loading.hide();
    }, 500);
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogSourceComponent, {
      width: '760px',
      data: "test",
      position: {
        top: '5%',
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  deleteFile(){
    this.deleteSwalSourceSuccess.show();
  }



}
