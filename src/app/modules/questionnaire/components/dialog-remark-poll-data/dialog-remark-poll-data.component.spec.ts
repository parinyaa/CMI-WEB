import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogRemarkPollDataComponent } from './dialog-remark-poll-data.component';

describe('DialogRemarkPollDataComponent', () => {
  let component: DialogRemarkPollDataComponent;
  let fixture: ComponentFixture<DialogRemarkPollDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogRemarkPollDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogRemarkPollDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
