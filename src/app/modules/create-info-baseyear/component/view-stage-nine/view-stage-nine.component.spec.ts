import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewStageNineComponent } from './view-stage-nine.component';

describe('ViewStageNineComponent', () => {
  let component: ViewStageNineComponent;
  let fixture: ComponentFixture<ViewStageNineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewStageNineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewStageNineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
