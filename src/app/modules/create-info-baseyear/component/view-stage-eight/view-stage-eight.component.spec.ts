import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewStageEightComponent } from './view-stage-eight.component';

describe('ViewStageEightComponent', () => {
  let component: ViewStageEightComponent;
  let fixture: ComponentFixture<ViewStageEightComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewStageEightComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewStageEightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
