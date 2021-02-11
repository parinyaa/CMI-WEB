import { Component, OnInit, EventEmitter, Output, Input, ViewChild } from '@angular/core';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { ParamService } from 'src/app/core/service/param/param.service';
import { ParamInfo } from 'src/app/modules/master-params/model/param';


@Component({
  selector: 'app-tree-ppi',
  templateUrl: './tree-ppi.component.html',
  styleUrls: ['./tree-ppi.component.scss']
})
export class TreePpiComponent implements OnInit {
  @ViewChild('errorSwal', { static: false }) errorSwal: SwalComponent;
  @Input()
  nodes: any;

  @Output()
  clickViewChildNode: EventEmitter<number> = new EventEmitter<number>();

  @Output()
  clickHideChildNode: EventEmitter<number> = new EventEmitter<number>();

  @Output()
  addChildNode: EventEmitter<number> = new EventEmitter<number>();

  @Output()
  deletedChildNode: EventEmitter<number> = new EventEmitter<number>();

  @Output()
  editChildNode: EventEmitter<number> = new EventEmitter<number>();

  nodeParent = new Array;
  constructor(private paramService: ParamService,) { }

  ngOnInit() {
  }

  addNode(id) {
    console.log("addTree => " + id);
    this.addChildNode.emit(id);
  }

  viewChildNode(node) {
    console.log("viewChildNode => " + node.ppiId);
    this.clickViewChildNode.emit(node);
  }

  hideChildNode(id: number) {
    console.log("hideChildNode => " + id);
    this.clickHideChildNode.emit(id);
  }
  deleteNode(id) {
    this.deletedChildNode.emit(id);
  }

  editNode(id) {
    this.editChildNode.emit(id);
  }

  onErrorSwal() {
    let msg = this.paramService.getParamByGroupCodeAndInfoCode("INFO_MESSAGE", "ADD_EDIT_DEL_ACTION") as ParamInfo;
    this.errorSwal.title = msg ? msg.paramLocalMessage : "";
    this.errorSwal.type = "warning";
    this.errorSwal.show();
  }



}
