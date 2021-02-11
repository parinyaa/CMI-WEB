import { SatDatepickerRangeValue } from 'saturn-datepicker';
export class Period implements SatDatepickerRangeValue<Date>{
    begin: Date;
    end: Date;
    durationCode: String;

    constructor(code: String, begin: Date, end: Date){
        if(begin != null && end != null){
            this.durationCode = code;
            this.begin = begin;
            this.end = end;
        }
    }
}
