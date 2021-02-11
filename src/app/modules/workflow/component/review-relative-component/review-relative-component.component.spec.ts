import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewRelativeComponentComponent } from './review-relative-component.component';

describe('ReviewRelativeComponentComponent', () => {
  let component: ReviewRelativeComponentComponent;
  let fixture: ComponentFixture<ReviewRelativeComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReviewRelativeComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewRelativeComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
