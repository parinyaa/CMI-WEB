import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { ParamService } from 'src/app/core/service/param/param.service';
import { ParamInfo } from 'src/app/modules/master-params/model/param';

@Component({
  selector: 'app-tree-cpa',
  templateUrl: './tree-cpa.component.html',
  styleUrls: ['./tree-cpa.component.scss']
})
export class TreeCpaComponent implements OnInit {
  @ViewChild('errorSwal', { static: false }) errorSwal: SwalComponent;

  @Input()
  nodes:any;

  @Output()
  clickViewChildNode: EventEmitter<number> = new EventEmitter<number>(); 

  @Output()
  clickHideChildNode: EventEmitter<number> = new EventEmitter<number>(); 

  @Output()
  addChildNode: EventEmitter<number> = new EventEmitter<number>(); 

  @Output()
  editChildNode: EventEmitter<number> = new EventEmitter<number>(); 

  @Output()
  deletedChildNode: EventEmitter<number> = new EventEmitter<number>(); 

  constructor(private paramService: ParamService,) { }

  ngOnInit() {
    
  }

  viewChildNode(node: any) {
    this.clickViewChildNode.emit(node);
  }

  hideChildNode(id: number) {
    this.clickHideChildNode.emit(id);
  }

  addNode(id){
    this.addChildNode.emit(id);
  }

  deleteNode(id){
    this.deletedChildNode.emit(id);
  }

  editNode(id){
    this.editChildNode.emit(id);
  }

  onErrorSwal() {
    let msg = this.paramService.getParamByGroupCodeAndInfoCode("INFO_MESSAGE", "ADD_EDIT_DEL_ACTION") as ParamInfo;
    this.errorSwal.title = msg ? msg.paramLocalMessage : "";
    this.errorSwal.type = "warning";
    this.errorSwal.show();
  }





}
