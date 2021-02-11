import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMoveWeighttwoDialogComponent } from './add-move-weighttwo-dialog.component';

describe('AddMoveWeighttwoDialogComponent', () => {
  let component: AddMoveWeighttwoDialogComponent;
  let fixture: ComponentFixture<AddMoveWeighttwoDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddMoveWeighttwoDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMoveWeighttwoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
