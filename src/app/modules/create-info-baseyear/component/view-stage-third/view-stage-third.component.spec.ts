import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewStageThirdComponent } from './view-stage-third.component';

describe('ViewStageThirdComponent', () => {
  let component: ViewStageThirdComponent;
  let fixture: ComponentFixture<ViewStageThirdComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewStageThirdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewStageThirdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
