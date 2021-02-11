import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MigratePriceDataComponent } from './migrate-price-data.component';

describe('MigratePriceDataComponent', () => {
  let component: MigratePriceDataComponent;
  let fixture: ComponentFixture<MigratePriceDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MigratePriceDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MigratePriceDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
