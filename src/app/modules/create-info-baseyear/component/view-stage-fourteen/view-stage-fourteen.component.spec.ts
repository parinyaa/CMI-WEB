import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewStageFourteenComponent } from './view-stage-fourteen.component';

describe('ViewStageFourteenComponent', () => {
  let component: ViewStageFourteenComponent;
  let fixture: ComponentFixture<ViewStageFourteenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewStageFourteenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewStageFourteenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
