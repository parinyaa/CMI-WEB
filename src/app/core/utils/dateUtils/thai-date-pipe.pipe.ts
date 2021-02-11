import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'thaiDatePipe'
})
export class ThaiDatePipePipe extends DatePipe implements PipeTransform {

  transform(dateStr: string): any {

    let result = new Date(dateStr).toLocaleDateString('th-TH');


    return result;
  }

}
