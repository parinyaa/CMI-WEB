import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewStageFifteenComponent } from './view-stage-fifteen.component';

describe('ViewStageFifteenComponent', () => {
  let component: ViewStageFifteenComponent;
  let fixture: ComponentFixture<ViewStageFifteenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewStageFifteenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewStageFifteenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
