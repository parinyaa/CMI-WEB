import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewStageTwelveComponent } from './view-stage-twelve.component';

describe('ViewStageTwelveComponent', () => {
  let component: ViewStageTwelveComponent;
  let fixture: ComponentFixture<ViewStageTwelveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewStageTwelveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewStageTwelveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
