import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewStageThirdTwoComponent } from './view-stage-third-two.component';

describe('ViewStageThirdTwoComponent', () => {
  let component: ViewStageThirdTwoComponent;
  let fixture: ComponentFixture<ViewStageThirdTwoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewStageThirdTwoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewStageThirdTwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
