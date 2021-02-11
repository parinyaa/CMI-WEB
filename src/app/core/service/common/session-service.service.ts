import { PriceDataRequestForm } from './../../../shared/models/dataenty/request/PriceDataRequestForm';
import { Injectable } from '@angular/core';
import {InspectParameter} from '../../../modules/commodity-validate/models/inspect-parameter';
import {InquiryProvinceNameResponse} from '../../../shared/models/weight/request/InquiryProvinceNameResponse.model';

@Injectable({
  providedIn: 'root'
})
export class SessionServiceService {

  constructor() { }

  public setInspectParam(value: InspectParameter): void {
    sessionStorage.setItem('inspectParam', JSON.stringify(value));
  }

  public getInspectParam(): InspectParameter {
    const json = JSON.parse(sessionStorage.getItem('inspectParam'));
    const obj: InspectParameter = json;
    return obj;
  }

  public rmInspectParam(): void {
    sessionStorage.removeItem('inspectParam');
  }

  public setWeightAndIndexParam(value: string) {
    const x = value;
    sessionStorage.setItem('weightAndIndexParam', x);
  }
  public getWeightAndIndexParam() {
    const x = sessionStorage.getItem('weightAndIndexParam');
    return x;
  }
  public setKeyinParam(value: any) {
    sessionStorage.setItem('keyinParam', JSON.stringify(value));
  }
  public getKeyinParam(): any {
    return JSON.parse(sessionStorage.getItem('keyinParam'));
  }
  public getTabIndex(): number {
    const x = sessionStorage.getItem('currentTabIndex');
    return Number.parseInt(x);
  }
  public setTabIndex(value: number) {
    const x = String(value);
    sessionStorage.setItem('currentTabIndex', x);
  }
  public getFrequency() {
    const x = sessionStorage.getItem('frequency');
    return x;
  }
  public setFrequency(value: string) {
    const x = value;
    sessionStorage.setItem('frequency', x);
  }
  public getMonthlyData() {
    return JSON.parse(sessionStorage.getItem('monthlyData'));
  }
  public setMonthlyData(value: any) {
    sessionStorage.setItem('monthlyData', JSON.stringify(value));
  }
  public getUserProfile() {
    return JSON.parse(sessionStorage.getItem('userProfile'));
  }
  public setUserProfile(value: any) {
    sessionStorage.setItem('userProfile', JSON.stringify(value));
  }
  public checkProfileIsContainObject(value: string): boolean {
    let result = false;
    const profile = JSON.parse(sessionStorage.getItem('userProfile'));
    const allObjects: [string] = profile.objects;
    if ( -1 < allObjects.indexOf(value) ) {
      result = true;
    }
    return result;
  }
  public getIsSaved() {
    const x = sessionStorage.getItem('isSaved');
    return x === 'true';
  }
  public setIsSaved(value: boolean) {
    const x = String(value);
    sessionStorage.setItem('isSaved', x);
  }
  public setBreadcrumb(region:string,province:string,amphur:string,tambol:string){
    const x = {'region':region,'province':province,'amphur':amphur,'tambol':tambol};
    sessionStorage.setItem('breadcrumbRegion',JSON.stringify(x));
  }
  public getBreadcrumb(){
    const x = JSON.parse(sessionStorage.getItem('breadcrumbRegion'));
    return x;
  }
  public setBreadcrumbCode(region:number,province:number,amphur:number,tambol:number){
    const x = {'region':region,'province':province,'amphur':amphur,'tambol':tambol};
    sessionStorage.setItem('breadcrumbRegionCode',JSON.stringify(x));
  }
  public getBreadcrumbCode(){
    const x = JSON.parse(sessionStorage.getItem('breadcrumbRegionCode'));
    return x;
  }
  public setImputation(imputation:any){
    sessionStorage.setItem('imputation',JSON.stringify(imputation));
  }
  public getImputation(){
    const x = JSON.parse(sessionStorage.getItem('imputation'));
    return x;
  }
  public setCalendar(calendar:any){
    sessionStorage.setItem('calendar',JSON.stringify(calendar));
  }
  public getCalendar(){
    const x = JSON.parse(sessionStorage.getItem('calendar'));
    return x;
  }
  public setPriceDataByFrequency(request : PriceDataRequestForm){
    sessionStorage.setItem('priceDataByFrequency',JSON.stringify(request));
  }
  public getPriceDataByFrequency(){
    const x = JSON.parse(sessionStorage.getItem('priceDataByFrequency'));
    return x;
  }

  public setProvinceData(value: InquiryProvinceNameResponse) {
    const x = String(value);
    sessionStorage.setItem('provinceData', JSON.stringify(value));
  }
  public setKeyMigratePrice(value: any) {
    sessionStorage.setItem('migratePrice', JSON.stringify(value));
  }
  public getKeyMigratePrice(): any {
    return JSON.parse(sessionStorage.getItem('migratePrice'));
  }
}
