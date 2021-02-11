import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'splitWorkflowDesc'
})
export class SplitWorkflowDescPipe implements PipeTransform {

  transform(str: string): any {
    let strArr: string[] = str.split('$1');
    let result: string = '';
    strArr.forEach(element => {
      result += element;
    });
    return result;
  }

}
