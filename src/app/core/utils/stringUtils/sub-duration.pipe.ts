import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'subDuration',
})
export class SubDurationPipe implements PipeTransform {
  transform(str: string): any {
    let month = [
      'มกราคม',
      'กุมภาพันธ์',
      'มีนาคม',
      'เมษายน',
      'พฤษภาคม',
      'มิถุนายน',
      'กรกฎาคม',
      'สิงหาคม',
      'กันยายน',
      'ตุลาคม',
      'พฤศจิกายน',
      'ธันวาคม',
    ];
    let week = ['สัปดาห์ที่ 1', 'สัปดาห์ที่ 2', 'สัปดาห์ที่ 3', 'สัปดาห์ที่ 4'];
    let checkMonth = str.search('M');
    let checkWeek = str.search('W');
    let checkStr: number = +str.substring(str.length - 1);
    let checkStrMonth: number = +str.substring(4, 6);
    let result = '';
    if (checkMonth > -1) {
      result = month[checkStrMonth - 1];
    } else if (checkWeek > -1) {
      result = week[checkStr - 1];
    }

    return result;
  }
}
