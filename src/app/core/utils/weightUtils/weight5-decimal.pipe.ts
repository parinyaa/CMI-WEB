import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'weight5Decimal'
})
export class Weight5DecimalPipe implements PipeTransform {

  transform(weight): any {

    let weightArr: string[] = weight.toString().split('.');
    if (weightArr.length > 1) {
      if (weightArr[1].length > 0 && weightArr[1].length < 5) {
        for (let i = weightArr[1].length; i < 5; i++) {
          weightArr[1] += '0';
        }
        let result = Number(weightArr[0]).toLocaleString('en') + '.' + weightArr[1];
        return result;
      }
      else if (weightArr[1].length > 0 && weightArr[1].length > 5) {
        let weightArrTmp: string[] = parseFloat(weight).toFixed(5).toString().split('.');
        return Number(weightArrTmp[0]).toLocaleString('en') + '.' + weightArrTmp[1]
      }
      else {
        return Number(weightArr[0]).toLocaleString('en') + '.' + weightArr[1];
      }
    }
    else {
      return weight;
    }

  }

}
