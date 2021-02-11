import { MatTableDataSource } from '@angular/material/table';
import { Component, OnInit, ViewChild } from '@angular/core';
import { DialogMockComponent } from '../component/dialog-mock/dialog-mock.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogMock2Component } from '../component/dialog-mock2/dialog-mock2.component';
import { MatDialog } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
const ELEMENT_DATA = [
  {productCode: "2011111011110101", productDetail:'ลิกไนต์  สินแร่', produectUnit:'ตัน',
   surveyName:'กรมอุตสาหกรรมพื้นฐานและการเหมืองแร่',sourceName:'กรมอุตสาหกรรมพื้นฐานและการเหมืองแร่',
   pricePrevious:'960',productLink:'0',priceRel:'100'},
   {productCode: "2012111011110101", productDetail:'น้ำมันดิบ', produectUnit:'ลิตร',
   surveyName:'บริษัท ปตท. จำกัด(มหาชน)',sourceName:'บริษัท ปตท. จำกัด(มหาชน)',
   pricePrevious:'12.38',productLink:'3',priceRel:'99.04'},
   {productCode: "2012121011110101", productDetail:'ก๊าซธรรมชาติ (NG)', produectUnit:'ล้านบีทียู',
   surveyName:'บริษัท ปตท. จำกัด(มหาชน)',sourceName:'บริษัท ปตท. จำกัด(มหาชน)',
   pricePrevious:'266.88',productLink:'3',priceRel:'99.43'},
   {productCode: "2012121021110101", productDetail:'คอนเดนเสท ลักษณะเป็นของเหลวสีดำ (ยูโนแคล)', produectUnit:'ลิตร',
   surveyName:'บริษัท ปตท. จำกัด(มหาชน)',sourceName:'บริษัท ปตท. จำกัด(มหาชน)',
   pricePrevious:'13.23',productLink:'3',priceRel:'99.02'},
  //  {productCode: "2021111011110101", productDetail:'ตะกั่ว สินแร่', produectUnit:'ตัน',
  //  surveyName:'กรมอุตสาหกรรมพื้นฐานและการเหมืองแร่',sourceName:'กรมอุตสาหกรรมพื้นฐานและการเหมืองแร่',
  //  pricePrevious:'62806.45',productLink:'0',priceRel:'94.47'},
  //  {productCode: "2021111021110101", productDetail:'สังกะสี', produectUnit:'ตัน',
  //  surveyName:'กรมอุตสาหกรรมพื้นฐานและการเหมืองแร่',sourceName:'กรมอุตสาหกรรมพื้นฐานและการเหมืองแร่',
  //  pricePrevious:'91861.61',productLink:'0',priceRel:'97.52'},
  //  {productCode: "2021111031110101", productDetail:'ดีบุก  เป็นโลหะ มีแร่ดีบุก 72% เป็นผงสีดำ คล้ายเม็ดทราย', produectUnit:'ตัน',
  //  surveyName:'กรมอุตสาหกรรมพื้นฐานและการเหมืองแร่',sourceName:'กรมอุตสาหกรรมพื้นฐานและการเหมืองแร่',
  //  pricePrevious:'666973.87',productLink:'0',priceRel:'93.42'},
  //  {productCode: "2021111041110101", productDetail:'แร่วุลแฟรม', produectUnit:'หาบหลวง',
  //  surveyName:'กรมอุตสาหกรรมพื้นฐานและการเหมืองแร่',sourceName:'กรมอุตสาหกรรมพื้นฐานและการเหมืองแร่',
  //  pricePrevious:'18900',productLink:'0',priceRel:'100'},
  //  {productCode: "2021111041110102", productDetail:'แร่วุลแฟรม', produectUnit:'ตัน',
  //  surveyName:'กรมอุตสาหกรรมพื้นฐานและการเหมืองแร่',sourceName:'กรมอุตสาหกรรมพื้นฐานและการเหมืองแร่',
  //  pricePrevious:'466551.71',productLink:'0',priceRel:'97.18'},
  //  {productCode: "2021111051110101", productDetail:'แร่วุลแฟรม', produectUnit:'ตัน',
  //  surveyName:'กรมอุตสาหกรรมพื้นฐานและการเหมืองแร่',sourceName:'กรมอุตสาหกรรมพื้นฐานและการเหมืองแร่',
  //  pricePrevious:'1835.48',productLink:'0',priceRel:'100'}
];
@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss']
})
export class PageComponent implements OnInit {
  mock2 =[
    {month:"1",commodityCode:"2012111010000000",status:"2",af1:"80",af2:"87.25",af3:"99.01981",gm1:"77.45980",gm2:"74.12305",gm3:"97.45631"},
  ];
  displayedColumns: string[] = ['action2','editBy','productCode','surveyName','pricePrevious','priceCurrent','priceDb','priceUse',
  'priceNot','productLink','priceChange','priceRel','productStatus'];
  displayedDatasource:string[] = ['month','af1','af2','af3','gm1','gm2','gm3'];
  dataSource = new MatTableDataSource(this.mock2);
  dataSourceKey = new MatTableDataSource();
  totalData:number;
  isShowDiv1 = true;
  isShowDiv2 = false;
  file = new Array();
  selection = new SelectionModel<any>(true, []);
  constructor(
    private loading: NgxSpinnerService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    console.log(this.selection);
    this.dataSourceKey = new MatTableDataSource(ELEMENT_DATA);
    this.totalData = ELEMENT_DATA.length;
    console.log(this.dataSourceKey);
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogMockComponent, {
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

  openDialog2(): void {
    const dialogRef = this.dialog.open(DialogMock2Component, {
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

  getTotalCost1() {
    let sum = ELEMENT_DATA.map(t => parseInt(t.pricePrevious)).reduce((acc, value) => acc + value, 0);
    let result = sum/ELEMENT_DATA.length;
    return result;
  }

  getTotalCost2() {
    let sum = ELEMENT_DATA.map(t => parseInt(t.pricePrevious)).reduce((acc, value) => acc + value, 0);
    let result = sum/ELEMENT_DATA.length;
    return result;
  }

  getTotalCost3() {
    let sum = ELEMENT_DATA.map(t => parseInt(t.pricePrevious)).reduce((acc, value) => acc + value, 0);
    let result = sum/ELEMENT_DATA.length;
    return result;
  }

  getTotalCost4() {
    let sum = ELEMENT_DATA.map(t => parseInt(t.priceRel)).reduce((acc, value) => acc + value, 0);
    let result = sum/ELEMENT_DATA.length;
    return result;
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSourceKey.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSourceKey.data.forEach(row => this.selection.select(row));
  }

  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

  calWeight(){
    this.isShowDiv2 = true;
    this.isShowDiv1 = false;
    this.mock2.push({month:"2",commodityCode:"1011112000000000",status:"2",af1:"80",af2:"87.25",af3:"99.01981",gm1:"77.45980",gm2:"74.12305",gm3:"97.45631"});
  }

  onChangePriceNot(e){

  }

  onSelectFile(event) {
    if (event.target.files && event.target.files[0]) {
      var filesAmount = event.target.files.length;
      console.log(event.target.files);
        this.file.push(event.target.files[0]);
      }
    }

}
