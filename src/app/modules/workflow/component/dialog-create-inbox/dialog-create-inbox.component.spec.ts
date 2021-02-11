import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogCreateInboxComponent } from './dialog-create-inbox.component';

describe('DialogCreateInboxComponent', () => {
  let component: DialogCreateInboxComponent;
  let fixture: ComponentFixture<DialogCreateInboxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogCreateInboxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogCreateInboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
