import { SoptreeService } from './../../core/service/soptree/soptree.service';
import { DialogAddtreesopComponent } from './component/dialog-addtreesop/dialog-addtreesop.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material';
import { NgxSpinnerService } from 'ngx-spinner';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { DialogEdittreesopComponent } from './component/dialog-edittreesop/dialog-edittreesop.component';

@Component({
  selector: 'app-master-treesop',
  templateUrl: './master-treesop.component.html',
  styleUrls: ['./master-treesop.component.scss']
})
export class MasterTreesopComponent implements OnInit {
  @ViewChild("succussDeleteSwal", { static: false }) succussDeleteSwal: SwalComponent;
  nodes = new Array();
  node: any;
  currentParantId: number;
  constructor(
    private dialog: MatDialog,
    private sopTreeService: SoptreeService,
    private loading: NgxSpinnerService
  ) { }

  ngOnInit() {
    this.loadNodeSop(0);
  }

  loadNodeSop(parentId) {
    this.loading.show();
    this.sopTreeService.getSopTree(parentId).subscribe(
      (res) => {
        this.loading.hide();
        this.nodes = res;
      },
      (error) => {
        this.loading.hide();
        this.nodes = [];
      }
    )
  }

  refreshNode() {
    let node = this.findNodeById(this.nodes, this.currentParantId);
    if (node) {
      node.loading = true;
      this.sopTreeService.getSopTree(this.currentParantId).subscribe(
        (res) => {
          node.child = res;
          node.sopTotalChild = res.length;
          node.loading = false;
          node.showChild = true;
        },
        (error) => {
        }
      )
    } else {
      this.loadNodeSop(0);
    }
    console.log(this.nodes);
  }

  addNode(node) {
    this.currentParantId = node.sopId ? node.sopId : 0;
    const dialogRef = this.dialog.open(DialogAddtreesopComponent, {
      width: '650px',
      height: 'auto',
      data: node,
      position: {
        top: '5%',
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.refreshNode();
      }
    });
  }


  viewChildNode(parantId) {
    let node = this.findNodeById(this.nodes, parantId);
    if (node) {
      node.showChild = true;
    }
    if (node && !node.child) {
      node.loading = true;
      this.sopTreeService.getSopTree(parantId).subscribe(
        (res) => {
          node.child = res;
          node.loading = false;
        },
        (error) => {
          console.log(error);
        }
      )
    }
    console.log(this.nodes);
  }

  hideChildNode(parantId) {
    let node = this.findNodeById(this.nodes, parantId);
    if (node) {
      node.showChild = false;
    }
  }

  deleteNode(id) {
    this.loading.show();
    this.currentParantId = id.parentId ? id.parentId : 0;
    this.sopTreeService.deleteNode(id.sopId).subscribe(
      (res) => {
        this.loading.hide();
        this.succussDeleteSwal.show();
      },
      (error) => {
        this.loading.hide();
      }
    )
  }

  editNode(node) {
    const dialogRef = this.dialog.open(DialogEdittreesopComponent, {
      width: '650px',
      height: 'auto',
      data: node,
      position: {
        top: '5%',
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.currentParantId = node.parentId ? node.parentId : 0;
        this.refreshNode();
      }
    });
  }

  private findNodeById(o: any, id: number) {
    if (o && typeof o.sopId != undefined && o.sopId === id) {
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
}
