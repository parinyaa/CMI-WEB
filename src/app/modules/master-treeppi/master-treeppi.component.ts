import { MatDialogRef, MatDialog } from '@angular/material';
import { DialogAddtreeppiComponent } from './component/dialog-addtreeppi/dialog-addtreeppi.component';
import { PpitreeService } from './../../core/service/ppitree/ppitree.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { DialogEdittreeppiComponent } from './component/dialog-edittreeppi/dialog-edittreeppi.component';
import { CpipGetParentIdRequest } from 'src/app/shared/models/ppitree/request/CpipGetParentIdRequest';


@Component({
  selector: 'app-master-treeppi',
  templateUrl: './master-treeppi.component.html',
  styleUrls: ['./master-treeppi.component.scss']
})
export class MasterTreeppiComponent implements OnInit {
 @ViewChild("succussDeleteSwal",{static:false}) succussDeleteSwal:SwalComponent;
  nodes = new Array();
  node:any;
  showChildPpi = false;
  loadingPpi = false;
  parent = new Array();
  currentParantId:any;
  constructor(
    private ppitreeService:PpitreeService,
    private dialog:MatDialog,
    private loading:NgxSpinnerService,
    private cpipGetParentIdRequest: CpipGetParentIdRequest,
  ) { }

  ngOnInit() {
    this.loadNodeCommodity(null);
    this.showChildPpi = true;
    this.loadingPpi = true;
  }

  loadNodeCommodity(parentId){
    this.cpipGetParentIdRequest.parentId = parentId;
    this.loading.show();
    console.log('load reantId',parentId)
    this.ppitreeService.getCpipTree(this.cpipGetParentIdRequest).subscribe(
      (res) => {
        this.nodes = res
        
        console.log('nodes:', res);
        this.loading.hide();
      },
      (error) => {
        this.nodes = [];
        this.loading.hide();
      }
    )
  }

  refreshNode(){
    let node = this.findNodeById(this.nodes, this.currentParantId);
    console.log('refresh node',node);
    if(node){
      node.loading = true;
      console.log('refres reantId',this.currentParantId)
      this.cpipGetParentIdRequest.parentId = this.currentParantId;
      this.ppitreeService.getCpipTree(this.cpipGetParentIdRequest).subscribe(
         (res) => {
          node.child = res;
          node.ppiTotalChild = res.length;
          node.loading = false;
          node.showChild = true;
         },
         (error) => {
         }
      )
    }else{
      this.loadNodeCommodity(null);
    }
  }

  viewChildNode(node){

    console.log('res node',node);
    if(node){
      node.showChild = true;
    }
    if (node && !node.child) {
      node.loading = true;
      console.log('res nodeppiId',node.ppiId);
      this.cpipGetParentIdRequest.parentId = node.ppiId;
      this.ppitreeService.getCpipTree(this.cpipGetParentIdRequest).subscribe(
        (res) => {
          node.child = res;
          console.log('res node child',node.ppiId);
          node.loading = false;
        },
        (error) => {
          console.log(error);
        }
      );
  }
    console.log(node);
  }

  hideChildNode(parantId){
    let node = this.findNodeById(this.nodes, parantId);
    if(node){
      node.showChild = false;
    }
  }

  private findNodeById(o: any, id: number) {
    if (o && typeof o.ppiId != undefined && o.ppiId === id) {
      return o;
    }
    let result: any, p: string | number;
    for (p in o) {
      if (o.hasOwnProperty(p) && typeof o[p] === 'object') {
        result = this.findNodeById(o[p], id);
        if (result) {
          return result;
        }
      }
    }
    return result;
  }

  addNode(commodity): void {
    this.currentParantId = commodity.ppiId ? commodity.ppiId : 0;
    const dialogRef = this.dialog.open(DialogAddtreeppiComponent, {
      width: '650px',
      height: 'auto',
      data: commodity,
      position: {
        top: '5%',
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.refreshNode();
      }
    });
  }

  editNode(commodity): void {
    const dialogRef = this.dialog.open(DialogEdittreeppiComponent, {
      width: '650px',
      height: 'auto',
      data: commodity,
      position: {
        top: '5%',
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.currentParantId = commodity.parentId;
        this.refreshNode();
      }
    });
  }

  deleteNode(node){
    this.loading.show();
    this.currentParantId = node.parentId?node.parentId : 0;
    this.ppitreeService.deleteNode(node.ppiId).subscribe(
      (res) => {
        this.loading.hide();
        this.succussDeleteSwal.show();
      },
      (error) => {
        this.loading.hide();
      }
    )
  }

  
}
