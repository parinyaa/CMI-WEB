import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-tree-node',
  templateUrl: './tree-node.component.html',
  styleUrls: ['./tree-node.component.scss']
})
export class TreeNodeComponent implements OnInit {
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
  constructor() { }

  ngOnInit() {
  }

  addNode(id) {
    this.addChildNode.emit(id);
  }

  viewChildNode(id) {
    this.clickViewChildNode.emit(id);
  }

  hideChildNode(id: number) {
    this.clickHideChildNode.emit(id);
  }
  deleteNode(id) {
    this.deletedChildNode.emit(id);
  }

  editNode(id) {
    this.editChildNode.emit(id);
  }

}
