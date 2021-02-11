import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewStageThirteenComponent } from './view-stage-thirteen.component';

describe('ViewStageThirteenComponent', () => {
  let component: ViewStageThirteenComponent;
  let fixture: ComponentFixture<ViewStageThirteenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewStageThirteenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewStageThirteenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
