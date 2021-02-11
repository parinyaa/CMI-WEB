import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupInboxdetailDetailComponent } from './popup-inboxdetail-detail.component';

describe('PopupInboxdetailDetailComponent', () => {
  let component: PopupInboxdetailDetailComponent;
  let fixture: ComponentFixture<PopupInboxdetailDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopupInboxdetailDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopupInboxdetailDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
