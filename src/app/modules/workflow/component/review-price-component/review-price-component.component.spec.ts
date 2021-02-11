import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewPriceComponentComponent } from './review-price-component.component';

describe('ReviewPriceComponentComponent', () => {
  let component: ReviewPriceComponentComponent;
  let fixture: ComponentFixture<ReviewPriceComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReviewPriceComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewPriceComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
