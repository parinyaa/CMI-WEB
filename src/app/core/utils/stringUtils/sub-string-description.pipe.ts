import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'subStringDescription'
})
export class SubStringDescriptionPipe implements PipeTransform {

  transform(str: string): any {
    let result: string = str.substring(0, 15);
    if (str.length > 15) {
      result = str.substring(0, 15);
      result += '...';
    }
    else {
      result = str;
    }
    return result;
  }

}
