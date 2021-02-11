import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WeightPageComponent } from './weight-page.component';

describe('WeightPageComponent', () => {
  let component: WeightPageComponent;
  let fixture: ComponentFixture<WeightPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WeightPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WeightPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
