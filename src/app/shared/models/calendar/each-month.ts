import {SatDatepickerRangeValue} from 'saturn-datepicker';
import {Period} from './period';

export class EachMonth {
  month: Period[];
  fortnight: Period[];
  week: Period[];
  isShow: boolean;

  constructor() {
    this.month = [new Period(null, null, null)];
    this.fortnight = [
      new Period(null, null, null),
      new Period(null, null, null),
    ];
    this.week = [
      new Period(null, null, null),
      new Period(null, null, null),
      new Period(null, null, null),
      new Period(null, null, null),
    ];
  }
}
