import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewStageSecondComponent } from './view-stage-second.component';

describe('ViewStageSecondComponent', () => {
  let component: ViewStageSecondComponent;
  let fixture: ComponentFixture<ViewStageSecondComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewStageSecondComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewStageSecondComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
