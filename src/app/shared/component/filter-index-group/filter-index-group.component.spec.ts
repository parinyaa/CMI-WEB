import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterIndexGroupComponent } from './filter-index-group.component';

describe('FilterIndexGroupComponent', () => {
  let component: FilterIndexGroupComponent;
  let fixture: ComponentFixture<FilterIndexGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilterIndexGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterIndexGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
