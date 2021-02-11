import {Component, OnInit, ViewChild} from '@angular/core';
import {EachMonth} from '../../../shared/models/calendar/each-month';
import {SatDatepickerRangeValue} from 'saturn-datepicker';
import {CalendarService} from '../../../core/service/calendar/calendar.service';
import {Period} from 'src/app/shared/models/calendar/period';
import {SwalComponent} from '@sweetalert2/ngx-sweetalert2';
import {NgxSpinnerService} from 'ngx-spinner';
import {PkgMigrateService} from 'src/app/core/service/pkgmigrate/pkg-migrate.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent implements OnInit {
  @ViewChild('saveCalendarSuccess', {static: false})
  saveCalendarSuccess: SwalComponent;
  constructor(
    private calendarService: CalendarService,
    private loading: NgxSpinnerService,
    private pkgMigrateService: PkgMigrateService,
  ) {}
  isError: Boolean = true;
  oldData: any;
  minDate: Date[] = new Array();
  maxDate: Date[] = new Array();
  row: EachMonth[] = new Array();
  seletedDate: Period[] = new Array();
  indexArr: number = 0;
  monthName: String[] = [
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
  nameMonth = 1;
  nameYear;
  currentYear = new Date().getFullYear();
  previousYear = new Date().getFullYear() - 1;
  flagInitial = false;
  month = [
    {
      name: 'มกราคม ',
      value: 0,
    },
    {
      name: 'กุมภาพันธ์ ',
      value: 1,
    },
    {
      name: 'มีนาคม ',
      value: 2,
    },
    {
      name: 'เมษายน ',
      value: 3,
    },
    {
      name: 'พฤษภาคม ',
      value: 4,
    },
    {
      name: 'มิถุนายน ',
      value: 5,
    },
    {
      name: 'กรกฎาคม ',
      value: 6,
    },
    {
      name: 'สิงหาคม ',
      value: 7,
    },
    {
      name: 'กันยายน ',
      value: 8,
    },
    {
      name: 'ตุลาคม ',
      value: 9,
    },
    {
      name: 'พฤศจิกายน ',
      value: 10,
    },
    {
      name: 'ธันวาคม ',
      value: 11,
    },
  ];
  year = [];

  async ngOnInit() {
    // this.year.push(this.previousYear + 543);
    // this.year.push(this.currentYear + 543);
    const yearList = await this.getYearAll();
    this.year = yearList;
    this.getYearMonth();
    this.onCheckCalendar();
  }

  getYearAll() {
    return this.calendarService.yearDistinctInCalendar().toPromise();
  }

  onCheckCalendar() {
    this.loading.show();
    this.calendarService
      .checkCalendar(this.currentYear)
      .toPromise()
      .then(
        (res) => {
          this.loading.hide();
          this.flagInitial = res && res.flag === 'Y' ? false : true;
        },
        (error) => {
          console.log(error);
          this.loading.hide();
        },
      );
  }

  initialCalendar() {
    this.loading.show();
    this.calendarService
      .initialCalendar(this.currentYear)
      .toPromise()
      .then(
        (res) => {
          this.loading.hide();
          this.saveCalendarSuccess.show();
        },
        (error) => {
          console.log(error);
          this.loading.hide();
        },
      );
  }

  getYearMonth() {
    this.pkgMigrateService.getYearMonth().subscribe(
      (res) => {
        this.nameMonth = res.month;
        let findMounth = this.month.find((x) => this.nameMonth - 1 === x.value);
        this.nameMonth = findMounth.value;
        this.nameYear = res.year;
        let year = this.year.find(
          (x) =>
            x === (this.nameYear < 2560 ? this.nameYear + 543 : this.nameYear),
        );
        this.nameYear = year;
        this.refresh();
      },
      (error) => {},
    );
  }

  refresh() {
    this.initialMinMax(false);
    this.getAllCalendarInTheYear(this.nameYear.toString());
  }

  checkDisabled(d: Date): Boolean {
    if (d != undefined) {
      let today = new Date();
      let thisMonth = today.getMonth();
      let thisYear = today.getFullYear();
      if (thisMonth === 0) {
        if (d.getFullYear() >= thisYear - 1) {
          if (d.getFullYear() > thisYear - 1) {
            return false;
          } else if (d.getMonth() >= 11) {
            return false;
          }
        }
      } else {
        if (d.getFullYear() >= thisYear) {
          if (d.getFullYear() > thisYear) {
            return false;
          } else if (d.getMonth() >= thisMonth - 1) {
            return false;
          }
        }
      }
    }
    return true;
  }

  onFilter() {
    this.initialMinMax(true);
    this.getAllCalendarInTheYear(this.nameYear.toString());
    // this.getAllCalendarInTheYear((new Date().getFullYear() + 543).toString());
  }

  filterDate = (d: Date): boolean => {
    const date: number = d.getDate();
    let to: number, from: number;
    let check: boolean[] = [true, true, true, true];
    for (let i in this.seletedDate) {
      if (
        this.seletedDate[i].begin != null &&
        this.seletedDate[i].end != null &&
        this.indexArr.toString() != i
      ) {
        from = this.seletedDate[i].begin.getDate();
        to = this.seletedDate[i].end.getDate();
        check[i] = date < from || date > to;
      }
    }
    if (to != null && from != null) {
      return check[0] && check[1] && check[2] && check[3];
    } else {
      return true;
    }
  };

  preOpenCalendar(list: Period[], indexArr: number): void {
    this.seletedDate = new Array();
    for (let i of list) {
      if (i != null) {
        this.seletedDate.push(i);
      }
    }
    this.indexArr = indexArr;
  }

  clickSelectDate(idMonth: number, col: string, idWeek: number): void {
    if (col == 'month')
      if (new Date(this.row[idMonth].month[idWeek].end) >= new Date())
        this.row[idMonth].month[idWeek] = new Period(
          this.oldData[idMonth].month[idWeek].durationCode,
          new Date(this.row[idMonth].month[idWeek].begin),
          new Date(this.row[idMonth].month[idWeek].end),
        );
      else {
        this.isError = true;
        this.row[idMonth].month[idWeek] = new Period(
          this.oldData[idMonth].month[idWeek].durationCode,
          new Date(this.row[idMonth].month[idWeek].begin),
          new Date(),
        );
      }
    //     else if(col == 'fortnight')
    //       this.row[idMonth].fortnight[idWeek] = new Period(this.oldData[idMonth].fortnight[idWeek].durationCode, new Date(this.row[idMonth].fortnight[idWeek].begin),new Date(this.row[idMonth].fortnight[idWeek].end));
    else if (col == 'week')
      this.row[idMonth].week[idWeek] = new Period(
        this.oldData[idMonth].week[idWeek].durationCode,
        new Date(this.row[idMonth].week[idWeek].begin),
        new Date(this.row[idMonth].week[idWeek].end),
      );
  }

  checkLimitDate(endDate: Date): void {
    console.log('DATEINPUT');
  }

  getAllCalendarInTheYear(yearId: string) {
    this.calendarService.getAllCalendarInTheYear(yearId).subscribe(
      (res) => {
        this.oldData = res;
        console.log(this.oldData);

        // for (let i = 0; i < res.length; i++) {
        //   this.row[i].month[0] = new Period(
        //     res[i].month[0].durationCode,
        //     new Date(res[i].month[0].begin),
        //     new Date(res[i].month[0].end),
        //   );
        //   for (let j = 0; j < 4; j++) {
        //     this.row[i].week[j] = new Period(
        //       res[i].week[j].durationCode,
        //       new Date(res[i].week[j].begin),
        //       new Date(res[i].week[j].end),
        //     );
        //   }
        // }
        for (let i = 0; i < res.length; i++) {
          if (i === this.nameMonth) {
            this.row[i].isShow = true;
            this.row[this.nameMonth].month[0] = new Period(
              res[this.nameMonth].month[0].durationCode,
              new Date(res[this.nameMonth].month[0].begin),
              new Date(res[this.nameMonth].month[0].end),
            );
            for (let j = 0; j < 4; j++) {
              this.row[this.nameMonth].week[j] = new Period(
                res[this.nameMonth].week[j].durationCode,
                new Date(res[this.nameMonth].week[j].begin),
                new Date(res[this.nameMonth].week[j].end),
              );
            }
          } else {
            this.row[i].isShow = false;
          }
        }
        this.loading.hide();
      },
      (error) => {
        console.log(error);
        this.loading.hide();
      },
    );
  }

  saveAllCalendar() {
    this.loading.show();
    let year = new Date().getFullYear() + 543;
    if (this.nameMonth === 0) {
      year = year - 1;
      this.nameMonth = 11;
    }
    let yearId = year.toString();

    // let yearId: string = (new Date().getFullYear() + 543).toString();
    this.calendarService.saveAllCalendar(yearId, this.row).subscribe(
      (res) => {
        this.loading.hide();
        this.saveCalendarSuccess.show();
      },
      (error) => {
        console.log(error);
      },
    );
  }

  initialMinMax(isFilter: Boolean) {
    this.row = new Array();
    let filterYear = this.currentYear;
    let subRow: EachMonth;
    this.minDate = new Array();
    this.maxDate = new Array();

    if (isFilter) {
      filterYear = this.nameYear - 543;
    }

    for (let i = 0; i < 12; i++) {
      if (i === 11) {
        this.minDate.push(new Date(filterYear + 1, 0, 1));
        this.maxDate.push(new Date(filterYear + 1, 1, 0));
      } else {
        this.minDate.push(new Date(filterYear, i + 1, 1));
        this.maxDate.push(new Date(filterYear, i + 2, 0));
      }
      subRow = new EachMonth();
      this.row.push(subRow);
    }
  }
}
