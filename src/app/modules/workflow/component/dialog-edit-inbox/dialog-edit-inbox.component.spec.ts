import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogEditInboxComponent } from './dialog-edit-inbox.component';

describe('DialogEditInboxComponent', () => {
  let component: DialogEditInboxComponent;
  let fixture: ComponentFixture<DialogEditInboxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogEditInboxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogEditInboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
