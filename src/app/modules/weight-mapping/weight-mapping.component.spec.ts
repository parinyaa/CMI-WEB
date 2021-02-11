import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WeightMappingComponent } from './weight-mapping.component';

describe('WeightMappingComponent', () => {
  let component: WeightMappingComponent;
  let fixture: ComponentFixture<WeightMappingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WeightMappingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WeightMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
