import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogAddIndexMatrixComponent } from './dialog-add-index-matrix.component';

describe('DialogAddIndexMatrixComponent', () => {
  let component: DialogAddIndexMatrixComponent;
  let fixture: ComponentFixture<DialogAddIndexMatrixComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogAddIndexMatrixComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogAddIndexMatrixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
