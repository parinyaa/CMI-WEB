import { FormBuilder } from '@angular/forms';
import { MatTableDataSource, MatSort } from '@angular/material';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
declare var $:any;
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
   {productCode: "2021111011110101", productDetail:'ตะกั่ว สินแร่', produectUnit:'ตัน',
   surveyName:'กรมอุตสาหกรรมพื้นฐานและการเหมืองแร่',sourceName:'กรมอุตสาหกรรมพื้นฐานและการเหมืองแร่',
   pricePrevious:'62806.45',productLink:'0',priceRel:'94.47'},
   {productCode: "2021111021110101", productDetail:'สังกะสี', produectUnit:'ตัน',
   surveyName:'กรมอุตสาหกรรมพื้นฐานและการเหมืองแร่',sourceName:'กรมอุตสาหกรรมพื้นฐานและการเหมืองแร่',
   pricePrevious:'91861.61',productLink:'0',priceRel:'97.52'},
   {productCode: "2021111031110101", productDetail:'ดีบุก  เป็นโลหะ มีแร่ดีบุก 72% เป็นผงสีดำ คล้ายเม็ดทราย', produectUnit:'ตัน',
   surveyName:'กรมอุตสาหกรรมพื้นฐานและการเหมืองแร่',sourceName:'กรมอุตสาหกรรมพื้นฐานและการเหมืองแร่',
   pricePrevious:'666973.87',productLink:'0',priceRel:'93.42'},
   {productCode: "2021111041110101", productDetail:'แร่วุลแฟรม', produectUnit:'หาบหลวง',
   surveyName:'กรมอุตสาหกรรมพื้นฐานและการเหมืองแร่',sourceName:'กรมอุตสาหกรรมพื้นฐานและการเหมืองแร่',
   pricePrevious:'18900',productLink:'0',priceRel:'100'},
   {productCode: "2021111041110102", productDetail:'แร่วุลแฟรม', produectUnit:'ตัน',
   surveyName:'กรมอุตสาหกรรมพื้นฐานและการเหมืองแร่',sourceName:'กรมอุตสาหกรรมพื้นฐานและการเหมืองแร่',
   pricePrevious:'466551.71',productLink:'0',priceRel:'97.18'},
   {productCode: "2021111051110101", productDetail:'แร่วุลแฟรม', produectUnit:'ตัน',
   surveyName:'กรมอุตสาหกรรมพื้นฐานและการเหมืองแร่',sourceName:'กรมอุตสาหกรรมพื้นฐานและการเหมืองแร่',
   pricePrevious:'1835.48',productLink:'0',priceRel:'100'}
];
@Component({
  selector: 'app-keyin-dataweek',
  templateUrl: './keyin-dataweek.component.html',
  styleUrls: ['./keyin-dataweek.component.scss']
})
export class KeyinDataweekComponent implements OnInit {
  @ViewChild(MatSort,{static:true}) sort:MatSort
  displayedColumns: string[] = ['productCode','surveyName','currency','pricePrevious','week1','week2','week3','week4','priceCurrent','priceNot','productLink','priceChange','priceRel','productStatus'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);
  myGroup:any;
  totalData:number;
  month = ["มกราคม ","กุมภาพันธ์ ","มีนาคม ","เมษายน ","พฤษภาคม ","มิถุนายน ","กรกฎาคม ","สิงหาคม ","กันยายน ","ตุลาคม ","พฤศจิกายน ","ธันวาคม "];
  year = ["2562","2561","2560","2559","2558","2557"];
  constructor(
    private formBuilderb: FormBuilder,
    private loading:NgxSpinnerService
    ) {}

  ngOnInit() {
    this.loading.show();
    this.totalData = ELEMENT_DATA.length;
    this.dataSource.sort  = this.sort;
    setTimeout(() => {
      this.loading.hide();
    }, 500);
  }
  
  onChangePriceNot(event){
    console.log(event.source.id +" ==> " + event.checked);
    let id = "#priceCurrent"+event.source.id;
    if(event.checked){
      let product = ELEMENT_DATA.find( x => x.productCode === event.source.id);
      let price = product.pricePrevious;
      $(id).val(price);
      $(id).prop('disabled', true);
    }else{
      $(id).val("");
      $(id).prop('disabled', false);
    }
  }

}
