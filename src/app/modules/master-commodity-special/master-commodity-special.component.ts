import { Component, OnInit, ViewChild } from '@angular/core';
import { CommoditySpecailService } from 'src/app/core/service/commoditySpecial/commodity-specail.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommoditySpecialModel, CommodityNotInSpecialRequest, UpdateCommoditySpacialMappingRequest } from 'src/app/shared/models/commoditySpecial/CommoditySpecial';
import { MatSelectChange, PageEvent, MatPaginator, MatSelectionListChange } from '@angular/material';
import { PageableResponse } from 'src/app/shared/response';

@Component({
  selector: 'app-master-commodity-special',
  templateUrl: './master-commodity-special.component.html',
  styleUrls: ['./master-commodity-special.component.scss']
})
export class MasterCommoditySpecialComponent implements OnInit {
  @ViewChild('paginator', { static: false }) paginatorCommodity: MatPaginator;
  @ViewChild('paginatorSpecial', { static: false }) paginatorSpecial: MatPaginator;
  commoditySpecial: CommoditySpecialModel;
  commoditySpecialList = new Array<CommoditySpecialModel>();
  commodityList = new Array<CommoditySpecialModel>();
  commodityMappingList = new Array<CommoditySpecialModel>();
  totalRecordCommodity: number;
  totalRecordCommodityMapping: number;
  pageEvent = new PageEvent();
  pageEventSpecial = new PageEvent();
  pageSize = 10;
  keywordCommodity: string;
  keywordMapping: string;
  specialList = new Set<CommoditySpecialModel>();
  specialDeletedList = new Set<CommoditySpecialModel>();
  constructor(
    private commoditySpecailService: CommoditySpecailService,
    private loading: NgxSpinnerService
  ) {
  }

  ngOnInit() {
    this.getCommoditySpecialDropDownList();
  }

  getCommoditySpecialDropDownList() {
    this.loading.show();
    this.commoditySpecailService.inquireCommoditySpecialList().subscribe(
      (res: CommoditySpecialModel[]) => {
        this.loading.hide();
        this.commoditySpecialList = res;
      }, (error) => {
        this.loading.hide();
      }
    )
  }

  async inquireCommodityNotInSpecialList() {
    this.loading.show();
    let request = new CommodityNotInSpecialRequest();
    request.cpipId = this.commoditySpecial ? this.commoditySpecial.cpipId : null;
    request.keyword = this.keywordCommodity;
    this.commoditySpecailService.inquireCommodityNotInSpecialList(request, this.pageEvent.pageIndex, this.pageEvent.pageSize).subscribe(
      (res: PageableResponse) => {
        this.loading.hide();
        console.log(this.loading);
        this.commodityList = res.content;
        this.totalRecordCommodity = res.totalRecords;
      }, (error) => {
        this.loading.hide();
      }
    )
  }

  async inquireCommodityMappingSpecialList() {
    this.loading.show();
    let request = new CommodityNotInSpecialRequest();
    request.cpipId = this.commoditySpecial ? this.commoditySpecial.cpipId : null;
    request.keyword = this.keywordMapping;
    this.commoditySpecailService.inquireCommodityMappingSpecialList(request, this.pageEventSpecial.pageIndex, this.pageEventSpecial.pageSize).subscribe(
      (res: PageableResponse) => {
        this.loading.hide();
        this.commodityMappingList = res.content;
        this.totalRecordCommodityMapping = res.totalRecords;
      }, (error) => {
        this.loading.hide();
      }
    )
  }

  async updateCommodityMappingSpecial(action: string) {
    this.loading.show();
    let request = new UpdateCommoditySpacialMappingRequest();
    let cpipIdlist = new Array<number>();
    request.cpipId = this.commoditySpecial ? this.commoditySpecial.cpipId : null;
    if (action === 'ADD') {
      request.action = "ADD";
      this.specialList.forEach(c => { cpipIdlist.push(c.cpipId) })
      request.cpipIdUpdate = cpipIdlist;
    } else {
      request.action = "DELETED";
      this.specialDeletedList.forEach(c => { cpipIdlist.push(c.cpipId) })
      request.cpipIdUpdate = cpipIdlist;
    }
    console.log(request);
    this.commoditySpecailService.updateCommodityMappingSpecial(request).subscribe(
      async (res: PageableResponse) => {
        this.loading.hide();
        this.specialList.clear();
        this.specialDeletedList.clear();
        await this.inquireCommodityNotInSpecialList();
        await this.inquireCommodityMappingSpecialList();
      }, (error) => {
        this.loading.hide();
      }
    )
  }

  async selectionChange(e: MatSelectChange) {
    if (e.value) {
      this.commoditySpecial = e.value;
      this.initPageableCommodity();
      this.initPageableSpecial();
      this.specialList.clear();
      this.specialDeletedList.clear();
      await this.inquireCommodityNotInSpecialList();
      await this.inquireCommodityMappingSpecialList()
    }
  }

  updatePagination(e: PageEvent) {
    this.pageEvent = e;
    this.inquireCommodityNotInSpecialList();
    return;
  }

  updatePaginationSpecial(e: PageEvent) {
    this.pageEventSpecial = e;
    this.inquireCommodityMappingSpecialList();
    return;
  }

  searchFilter(action: string) {
    if (action === 'COMMODITY') {
      this.initPageableCommodity();
      this.paginatorCommodity.firstPage();
      this.specialList.clear();
      this.inquireCommodityNotInSpecialList();
    } else {
      this.initPageableSpecial();
      this.paginatorSpecial.firstPage();
      this.specialDeletedList.clear();
      this.inquireCommodityMappingSpecialList();
    }

  }

  initPageableCommodity() {
    this.pageEvent.pageIndex = 0;
    this.pageEvent.pageSize = this.pageSize;
  }

  initPageableSpecial() {
    this.pageEventSpecial.pageIndex = 0;
    this.pageEventSpecial.pageSize = this.pageSize;
  }

  selectionCommodityChange(e: MatSelectionListChange) {
    if (e.option.selected) {
      this.specialList.add(e.option.value);
    } else {
      this.specialList.delete(e.option.value);
    }
  }

  selectionCommodityMappingChange(e: MatSelectionListChange) {
    if (e.option.selected) {
      this.specialDeletedList.add(e.option.value);
    } else {
      this.specialDeletedList.delete(e.option.value);
    }
  }

}
