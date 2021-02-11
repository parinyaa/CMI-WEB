import { CalendarService } from './../service/calendar/calendar.service';
import {Component, OnInit, ViewChild} from '@angular/core';
import {AuthserviceService} from '../service/user/authservice.service';
import {HeaderServiceService} from '../service/headerService/header-service.service';
import {Router} from '@angular/router';
import {SessionServiceService} from '../service/common/session-service.service';
import {SwalComponent} from '@sweetalert2/ngx-sweetalert2';
import {ParamService} from '../service/param/param.service';
import {SharedserviceService} from '../../modules/keyin-data/component-service/sharedservice.service';

declare var $: any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  userCodeCurrent: string;
  menuObject: any;
  currentUser: any;
  parentMenuId: number;
  navMenu: Array<any> = [];
  childMenu: Array<any> = [];
  alertSaveMessage: string;

  @ViewChild('saveDataSwal', {static: false}) saveDataSwal: SwalComponent;

  constructor(
    private getCurrentUserService: AuthserviceService,
    private vparamService: HeaderServiceService,
    private router: Router,
    private sessionService: SessionServiceService,
    private paramService: ParamService,
    public sharedService: SharedserviceService,
    public calendarService:CalendarService
  ) {
  }

  ngOnInit() {

    this.getCurrentUser();
    // this.getCalendar();


  }

  doCheckSavedProcess() {
    let result = false;
    const isSaved = this.sessionService.getIsSaved();
    if (isSaved) {
      result = true;
      return new Promise((resolve, reject) => {
        resolve(result);
      });
    } else {
      return  this.saveDataSwal.show() .then(x => {
        console.log(x);
        if (x.dismiss === 'cancel') {
          result = true;
        }
        if (x.value === true) {
          this.setIsSaved();
          result = true;
        }
        return result;
      });
    }
  }
  public route(url: string) {
    const rx = this.doCheckSavedProcess();
    rx.then((x) => {
      if (x) {
        console.log(url);
        // this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.navigate([url]);
      }
    }, (error) => {
      console.log(error);
    });
  }

  signOut() {
    sessionStorage.removeItem('currentUser');
    sessionStorage.removeItem('currentTabIndex');
    sessionStorage.removeItem('frequency');
    location.href = '/';
  }

  getCurrentUser() {
    this.getCurrentUserService.getCurrentUser()
      .subscribe(
        (res) => {
          this.userCodeCurrent = res.localFirstName;
          this.currentUser = res;
          console.log('current user => ', this.currentUser);
          this.getParentMenu();
          this.alertSaveMessage = this.paramService.getParamByGroupCodeAndInfoCode('ERROR_MESSAGE', 'PED01').paramLocalMessage;
          console.log(this.alertSaveMessage);
        },
        (error) => {

        }
      );
  }


  getMenuObject() {
    this.vparamService.getMenuObject()
      .subscribe(
        (res) => {
          this.menuObject = res;
        },
        (error) => {

        }
      );
  }

  getParentMenu() {
    console.log('getParentMenu');
    if (this.currentUser.menuObject != null) {
      this.currentUser.menuObject.forEach(object => {
        if (object.systemCode === 'CMI') {
          if (object.objects != null) {
            object.objects.forEach(obj => {
              if (obj.objectParentId == null) {
                this.parentMenuId = obj.objectId;
                this.setNavBar(this.parentMenuId, obj.objects);
              }
            });
          }
        }
      });

      // this.router.navigateByUrl("/");
    }


  }


  setNavBar(parentId: number, list: any) {
    list.forEach(childObj => {
      if (childObj.objectParentId === parentId) {
        this.navMenu.push(childObj);
      }
      if (childObj.objects != null) {
        this.setNavBar(parentId, childObj.objects);
      }
    });
  }

  getCalendar(){
    this.calendarService.getCalendarCurrentmonth().subscribe(
      (res) => {
        this.sessionService.setCalendar(res);
      },
      (error) => {
        console.log(error);
      }
    )
  }

  setIsSaved() {
    this.sessionService.setIsSaved(true);
  }

  


}
