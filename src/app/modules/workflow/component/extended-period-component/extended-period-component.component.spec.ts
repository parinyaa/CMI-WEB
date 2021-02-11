import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtendedPeriodComponentComponent } from './extended-period-component.component';

describe('ExtendedPeriodComponentComponent', () => {
  let component: ExtendedPeriodComponentComponent;
  let fixture: ComponentFixture<ExtendedPeriodComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExtendedPeriodComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtendedPeriodComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
